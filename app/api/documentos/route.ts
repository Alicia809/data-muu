import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

function parseCorrelativo(correlativo: string) {
  if (!correlativo || correlativo.length < 10) {
    return {
      tomo: null,
      folio: null,
      registro: null,
    };
  }
  return {
    tomo: correlativo.slice(0, 4),   // Año, ej. "2025"
    folio: correlativo.slice(4, 6),  // Mes, ej. "09"
    registro: correlativo.slice(6),  // Número correlativo, ej. "0006"
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      vendedorId,
      compradorId,
      semovienteId,
      precio,
      fechaSolicitud,
      estado,
      nombreAbogado,
    } = body;

    if (!vendedorId || !compradorId || !semovienteId) {
      return NextResponse.json({ error: "Faltan IDs obligatorios" }, { status: 400 });
    }

    // Obtener o crear vendedor
    let vendedorData;
    const { data: existingVendedor, error: vendedorCheckError } = await supabaseServer
      .from("cv_vendedor")
      .select("id")
      .eq("persona_id", vendedorId)
      .maybeSingle();

    if (vendedorCheckError) throw vendedorCheckError;

    if (!existingVendedor) {
      const { data: newVendedor, error: createVendedorError } = await supabaseServer
        .from("cv_vendedor")
        .insert([{ persona_id: vendedorId }])
        .select()
        .single();

      if (createVendedorError) throw createVendedorError;
      vendedorData = newVendedor;
    } else {
      vendedorData = existingVendedor;
    }

    // Obtener o crear comprador
    let compradorData;
    const { data: existingComprador, error: compradorCheckError } = await supabaseServer
      .from("cv_comprador")
      .select("id")
      .eq("persona_id", compradorId)
      .maybeSingle();

    if (compradorCheckError) throw compradorCheckError;

    if (!existingComprador) {
      const { data: newComprador, error: createCompradorError } = await supabaseServer
        .from("cv_comprador")
        .insert([{ persona_id: compradorId }])
        .select()
        .single();

      if (createCompradorError) throw createCompradorError;
      compradorData = newComprador;
    } else {
      compradorData = existingComprador;
    }

    // Generar correlativo
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const prefix = `${year}${month}`;

    const { data: lastVenta, error: lastVentaError } = await supabaseServer
      .from("cv_ventas")
      .select("correlativo")
      .like("correlativo", `${prefix}%`)
      .order("correlativo", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastVentaError) throw lastVentaError;

    let newNumber = 1;

    if (lastVenta?.correlativo) {
      const lastNumberStr = lastVenta.correlativo.slice(prefix.length);
      const lastNumber = parseInt(lastNumberStr, 10);
      newNumber = lastNumber + 1;

      if (newNumber > 9999) {
        return NextResponse.json({ error: "Se alcanzó el máximo correlativo para este mes" }, { status: 400 });
      }
    }

    const correlativo = `${prefix}${String(newNumber).padStart(4, "0")}`;

    const { data: ventaData, error: ventaError } = await supabaseServer
      .from("cv_ventas")
      .insert([
        {
          correlativo,
          fecha_transaccion: fechaSolicitud,
          fecha_registrada: estado === "confirmado" ? new Date().toISOString() : null,
          precio,
          estado: estado || "borrador",
          nombre_abogado: nombreAbogado || "Carlos Suazo",
          cv_vendedor_id: vendedorData.id,
          cv_comprador_id: compradorData.id,
          cv_semoviente_id: semovienteId,
        },
      ])
      .select()
      .single();

    if (ventaError) throw ventaError;

    const parsed = parseCorrelativo(ventaData.correlativo);

    return NextResponse.json({
      id: ventaData.id,
      numeroRegistro: ventaData.correlativo,
      fechaSolicitud: ventaData.fecha_transaccion,
      fechaRegistro: ventaData.fecha_registrada,
      precio: ventaData.precio,
      estado: ventaData.estado,
      nombreAbogado: ventaData.nombre_abogado,
      vendedorId,
      compradorId,
      semovienteId,
      tomo: parsed.tomo,
      folio: parsed.folio,
      registro: parsed.registro,
    });
  } catch (err) {
    console.error("Error en POST /api/documentos:", err);
    return NextResponse.json({ error: "Error al crear carta de venta" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("cv_ventas")
      .select(`
        *,
        cv_vendedor!inner(persona_id),
        cv_comprador!inner(persona_id),
        cv_semoviente!inner(*)
      `);

    if (error) throw error;

    const cartasFormateadas = data.map((venta: any) => {
      const parsed = parseCorrelativo(venta.correlativo);

      return {
        id: venta.id.toString(),
        numeroRegistro: venta.correlativo,
        tomo: parsed.tomo,
        folio: parsed.folio,
        registro: parsed.registro,
        vendedorId: venta.cv_vendedor?.persona_id || null,
        compradorId: venta.cv_comprador?.persona_id || null,
        semovienteId: venta.cv_semoviente_id || null,
        precio: venta.precio.toString(),
        fechaSolicitud: venta.fecha_transaccion,
        fechaRegistro: venta.fecha_registrada,
        estado: venta.estado as "borrador" | "confirmado",
        nombreAbogado: venta.nombre_abogado || "Carlos Suazo",
      };
    });

    return NextResponse.json(cartasFormateadas);
  } catch (err) {
    console.error("Error en GET /api/documentos:", err);
    return NextResponse.json({ error: "Error al obtener cartas de venta" }, { status: 500 });
  }
}

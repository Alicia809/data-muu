import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from("persona")
      .select("id, p_nombre, s_nombre, p_apellido, s_apellido, dni, rtn, telefono_1, domicilio, genero");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre1, nombre2, apellido1, apellido2, dni, rtn, telefono, direccion, genero } = body;

    const { data, error } = await supabaseServer
      .from("persona")
        .insert([{
          p_nombre: nombre1,
          s_nombre: nombre2,
          p_apellido: apellido1,
          s_apellido: apellido2,
          dni,
          rtn,
          telefono_1: telefono,
          domicilio: direccion,
          genero
        }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al crear cliente" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre1, nombre2, apellido1, apellido2, dni, rtn, telefono, direccion, genero } = body;

    const { data, error } = await supabaseServer
      .from("persona")
      .update({
        p_nombre: nombre1,
        s_nombre: nombre2,
        p_apellido: apellido1,
        s_apellido: apellido2,
        dni,
        rtn,
        telefono_1: telefono,
        domicilio: direccion,
        genero
      })
      .eq("dni", dni)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { data, error } = await supabaseServer
      .from("persona")
      .delete()
      .eq("id", Number(id))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar cliente" }, { status: 500 });
  }
}

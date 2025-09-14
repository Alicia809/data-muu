import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  // Tablas para totales
  const tablasTotales = {
    contribuyentes: 'persona',
    semovientes: 'cv_semoviente',
    fierros: 'cv_fierro_semoviente',
    cartasVenta: 'cv_ventas'
  };

  // Traemos totales en paralelo
  const [contribuyentes, semovientes, fierros, cartasVenta] = await Promise.all([
    supabaseServer.from(tablasTotales.contribuyentes).select('*', { count: 'exact', head: true }),
    supabaseServer.from(tablasTotales.semovientes).select('*', { count: 'exact', head: true }),
    supabaseServer.from(tablasTotales.fierros).select('*', { count: 'exact', head: true }),
    supabaseServer.from(tablasTotales.cartasVenta).select('*', { count: 'exact', head: true })
  ]);

  if (contribuyentes.error || semovientes.error || fierros.error || cartasVenta.error) {
    return NextResponse.json({ error: 'Error al obtener totales' }, { status: 500 });
  }

  // Traemos últimos registros
  const [ultimoCliente, ultimoDocumento] = await Promise.all([
    supabaseServer
      .from('persona')
      .select('id, p_nombre, s_nombre, p_apellido, s_apellido ')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseServer
      .from('cv_ventas')
      .select('id, correlativo, fecha_transaccion')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  return NextResponse.json({
    // Totales
    contribuyentes: contribuyentes.count ?? 0,
    semovientes: semovientes.count ?? 0,
    fierros: fierros.count ?? 0,
    cartasVenta: cartasVenta.count ?? 0,
    // Últimos registros
    ultimoCliente: ultimoCliente.data ??  null,
    ultimoDocumento: ultimoDocumento.data ?? null,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from("cv_tipo_semoviente")
      .select("id, nombre, descripcion");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al obtener tipos de semovientes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {nombre, descripcion } = body;

    const { data, error } = await supabaseServer
      .from("cv_tipo_semoviente")
        .insert([{
          nombre, 
          descripcion
        }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al crear tipo de semoviente" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {id, nombre, descripcion } = body;

    const { data, error } = await supabaseServer
      .from("cv_tipo_semoviente")
      .update({
        nombre,
        descripcion
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error al actualizar tipo de semoviente" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { data, error } = await supabaseServer
      .from("cv_tipo_semoviente")
      .delete()
      .eq("id", Number(id))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar tipo de semoviente" }, { status: 500 });
  }
}

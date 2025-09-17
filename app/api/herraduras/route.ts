import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// 🔹 Obtener lista de fierros
export async function GET(req: NextRequest) {
  const { data, error } = await supabaseServer
    .from("cv_fierro_semoviente")
    .select(`
      *,
      persona:persona_id (p_nombre, s_nombre, p_apellido, s_apellido)
    `)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error Supabase GET:", error); // <-- primero log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mapear nombre completo
  const mappedData = data.map((h: any) => ({
    ...h,
    nombre_persona: `${h.persona?.p_nombre ?? ""} ${h.persona?.s_nombre ?? ""} ${h.persona?.p_apellido ?? ""} ${h.persona?.s_apellido ?? ""}`.trim(),
  }));

  return NextResponse.json(mappedData);
}

// 🔹 Crear nuevo fierro
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { persona_id, observaciones, imagen_base64 } = body;

  const { data, error } = await supabaseServer.from("cv_fierro_semoviente").insert([
    {
      persona_id,
      descripcion: observaciones,
      imagen: imagen_base64,
    },
  ]);

  if (error) {
    console.error("Error Supabase INSERT:", error); // <-- primero log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Fierro guardado", data });
}


// 🔹 Actualizar fierro
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, persona_id, observaciones, imagen_base64 } = body;

  const { data, error } = await supabaseServer
    .from("cv_fierro_semovienteras")
    .update({
      persona_id,
      descripcion: observaciones,
      imagen: imagen_base64,
    })
    .eq("id", id);

  if (error) {
    console.error("Error Supabase PUT:", error); // <-- primero log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Fierro actualizado", data });
}

// 🔹 Eliminar fierro
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { error } = await supabaseServer.from("cv_fierro_semoviente").delete().eq("id", id);

  if (error) {
    console.error("Error Supabase DELETE:", error); // <-- primero log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Fierro eliminado" });
}

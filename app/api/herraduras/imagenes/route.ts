// /pages/api/imagen.ts
import { supabase } from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;

  if (!path || typeof path !== "string") {
    return res.status(400).json({ error: "Falta path de la imagen" });
  }

  try {
    // Genera URL firmada válida por 60 segundos
    const { data, error } = await supabase.storage
      .from("fierros")
      .createSignedUrl(path, 60*60);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ url: data.signedUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

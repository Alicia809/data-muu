"use client";

import "./registro-herraduras.css";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdArrowBack,
  MdSave,
} from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { TbHorseshoe } from "react-icons/tb";
import { BiSolidImageAdd } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

function SignedImage({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/imagen?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.error(err));
  }, [path]);

  if (!url) return <div className="h-32 bg-gray-100 rounded mb-2" />;

  return <img src={url} alt={alt} className="h-32 object-cover rounded mb-2" />;
}

export default function HerradurasPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingHerradura, setEditingHerradura] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [personas, setPersonas] = useState<any[]>([]);
  const [busquedaPropietario, setBusquedaPropietario] = useState("");
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [userName, setUserName] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Si guardaste el nombre en user_metadata al registrarlo:
        setUserName(user.user_metadata?.nombre || user.email) 
      }
    }

    getUser()
  }, [])


  const [formData, setFormData] = useState({
    imagen_base64:"",
    persona_id: "",
    observaciones: "",
  });

  const fetchSignedUrl = async (path: string) => {
    if (!path) return null;
    if (signedUrls[path]) return signedUrls[path]; // si ya la tenemos, no volver a pedir

    try {
      const res = await fetch(`/api/imagen?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.url) {
        setSignedUrls(prev => ({ ...prev, [path]: data.url }));
        return data.url;
      }
    } catch (err) {
      console.error("Error al obtener signed URL:", err);
    }
    return null;
  };


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Datos guardados en DB (para mostrar lista)
  const [herraduras, setHerraduras] = useState<any[]>([]);

  const router = useRouter();

  // 🔹 Cargar personas desde la base de datos
  useEffect(() => {
    const fetchPersonas = async () => {
      const { data, error } = await supabase
        .from("persona")
        .select("id, p_nombre, s_nombre, p_apellido, s_apellido");
      if (!error && data) {
        const mapped = data.map((p) => ({
          ...p,
          nombre_completo: `${p.p_nombre ?? ""} ${p.s_nombre ?? ""} ${
            p.p_apellido ?? ""
          } ${p.s_apellido ?? ""}`.trim(),
        }));
        setPersonas(mapped);
      }
    };
    fetchPersonas();
  }, []);

  // 🔹 Obtener lista desde la API
  const fetchHerraduras = async () => {
    const res = await fetch("/api/herraduras");
    const data = await res.json();
    setHerraduras(data);
  };

  useEffect(() => {
    fetchHerraduras();
  }, []);

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // 🔹 Manejar cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // 🔹 Manejar imagen seleccionada y convertir a base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setPreviewUrl(base64); // para previsualización
        setImageFile(file);
        setFormData({ ...formData, imagen_base64: base64 }); // guardar en formData
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Subir formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      // Se envía directamente formData, ya contiene la propiedad imagen_base64
      const res = await fetch("/api/herraduras", {
        method: editingHerradura ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingHerradura?.id,
          persona_id: formData.persona_id,
          observaciones: formData.observaciones,
          imagen_base64: formData.imagen_base64 || null,
        }),
      });

      if (!res.ok) {
        setError("Por favor, complete todos los campos obligatorios")
        setTimeout(() => setError(""), 10000)
        return
      }


      resetForm();
      fetchHerraduras();
      setSuccess("Fierro registrado correctamente");
      // Limpiar la alerta de éxito después de 10 segundos
      setTimeout(() => setSuccess(""), 10000);
    } catch (err) {
      console.error(err)
      setError("Ocurrió un error")
      setTimeout(() => setError(""), 10000)
    }
  };


  // 🔹 Editar
  const handleEdit = (herradura: any) => {
    setFormData({
      imagen_base64: "",
      persona_id: herradura.persona_id,
      observaciones: herradura.descripcion,
    });
    setPreviewUrl(null);
    setEditingHerradura(herradura);
    setShowForm(true);
  };

  // 🔹 Eliminar
  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este fierro?")) {
      const res = await fetch(`/api/herraduras?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchHerraduras();
      }
    }
  };

  // 🔹 Resetear form
  const resetForm = () => {
    setFormData({ imagen_base64: "", persona_id: "", observaciones: "" });
    setImageFile(null);
    setPreviewUrl(null);
    setShowForm(false);
    setEditingHerradura(null);
  };

  // 🔹 Filtrar
  const filteredHerraduras = Array.isArray(herraduras)
    ? herraduras.filter((h) =>
        h.nombre_persona?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo2.png" alt="Logo" className="w-50" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:block titulo">
              Bienvenido, {userName || "Usuario"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="logout-button parrafo"
            >
              <MdLogout className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/dashboard")}
              className="regresar-btn parrafo"
            >
              <MdArrowBack className="h-4 w-4 mr-2" />
              Panel Principal
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <TbHorseshoe className="h-6 w-6 text-primary" />
                <span>Registro de Fierros</span>
              </h1>
              <p className="text-muted-foreground parrafo">
                Gestione el registro de fierros con imágenes y datos del
                propietario
              </p>
            </div>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="nuevo-btn parrafo">
              <MdAdd className="h-4 w-4 mr-2" />
              Registrar Fierro
            </Button>
          )}
        </div>
        
        {/* Alertas */}
        <div className="max-w-7xl mx-auto p-6 parrafo">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>

        {showForm ? (
          /* Formulario */
          <Card className="mb-8 card-principal">
            <CardHeader>
              <CardTitle className="titulo">
                {editingHerradura ? "Editar Fierro" : "Registrar Nuevo Fierro"}
              </CardTitle>
              <CardDescription className="parrafo">
                Complete la información del Fierro y del propietario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Imagen */}
                  <div className="space-y-2 parrafo">
                    <Label>Imagen del Fierro</Label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-30 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                      {/* Icono central */}                      
                      <BiSolidImageAdd className="h-8 w-8 mr-1" />

                      {/* Botón de seleccionar imagen */}
                      <label className="mt-2 px-4 py-2 bg-white border rounded shadow-sm text-sm text-gray-700 cursor-pointer hover:bg-gray-100  regresar-btn">
                        Seleccionar Imagen
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    {/* Previsualización */}
                    {previewUrl && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="max-h-64 w-auto object-contain rounded"
                        />
                      </div>
                    )}
                  </div>
                  {/* Información */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">
                      Datos del Propietario
                    </h3>
                    <div>
                      <Label htmlFor="propietario" className="parrafo">
                        Nombre del Propietario *
                      </Label>
                      <Input
                        type="text"
                        placeholder="Escriba para filtrar por nombre..."
                        value={busquedaPropietario}
                        onChange={(e) =>
                          setBusquedaPropietario(e.target.value)
                        }
                        className="mb-2 parrafo"
                      />

                      <select
                        id="persona_id"
                        value={formData.persona_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            persona_id: e.target.value,
                          })
                        }
                        className="block w-full border border-gray-300 rounded-md p-2 parrafo"
                        required
                      >
                        <option value="">Seleccione una persona</option>
                        {personas
                          .filter((p) =>
                            p.nombre_completo
                              .toLowerCase()
                              .includes(busquedaPropietario.toLowerCase())
                          )
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre_completo}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="observaciones" className="parrafo">Observaciones</Label>
                      <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        className="border p-2 w-full rounded parrafo"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="nuevo-btn parrafo">
                    <MdSave className="h-4 w-4 mr-2" />
                    {editingHerradura
                      ? "Actualizar Fierro"
                      : "Registrar Fierro"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="regresar-btn parrafo"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Lista */
          <div className="space-y-6">
            {/* Barra de búsqueda */}
            <Card className="card-principal">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 card-content">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por propietario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 parrafo"
                    />
                  </div>
                  <Badge variant="secondary" className="parrafo">
                    {filteredHerraduras.length} fierro
                    {filteredHerraduras.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredHerraduras.map((herradura) => (
                <Card
                  key={herradura.id}
                  className="overflow-hidden w-[250px] p-2 mb-4 mx-auto"
                >
                  {/* Imagen en Base64 */}
                  {herradura.imagen && (
                    <img
                      src={herradura.imagen}
                      alt={herradura.descripcion || 'Imagen'}
                      className="max-h-40 w-auto max-w-full object-contain rounded mx-auto"
                    />
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg titulo">
                        Propietario
                      </CardTitle>
                    </div>
                    <CardDescription className="parrafo">
                      {herradura.nombre_persona}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2 mt-4 parrafo justify-center">                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(herradura.id)}
                        className="regresar-btn parrafo"
                      >
                        <MdDelete className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHerraduras.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <TbHorseshoe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No se encontraron fierros
                  </h3>
                  <Button onClick={() => setShowForm(true)} className="nuevo-btn parrafo">
                    <MdAdd className="h-4 w-4 mr-2" />
                    Registrar Primer Fierro
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

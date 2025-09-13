"use client"

import "./registro-clientes.css"
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, User, Save } from "lucide-react"
import { MdLogout, MdCancel } from "react-icons/md"
import { FaRegIdCard, FaPhoneAlt, FaHome, FaEdit, FaTrash } from "react-icons/fa"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"


interface Cliente {
  id: number
  nombre1: string
  nombre2: string
  apellido1: string
  apellido2: string
  dni: string
  rtn: string
  telefono: string
  direccion: string
  genero: string
}

export default function ClientesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();

      if (Array.isArray(data)) {
        // Mapear campos de Supabase a tu interfaz Cliente
        const mapped = data.map((c: any) => ({
          id: c.id,
          nombre1: c.p_nombre,
          nombre2: c.s_nombre,
          apellido1: c.p_apellido,
          apellido2: c.s_apellido,
          dni: c.dni,
          rtn: c.rtn,
          telefono: c.telefono_1,
          direccion: c.domicilio,
          genero: c.genero
        }));
        setClientes(mapped);
      } else {
        setClientes([]);
        console.warn("La API no devolvió un array:", data);
      }

    } catch (err) {
      setError("Error al cargar los contribuyentes");
      setClientes([]);
      setTimeout(() => setError(""), 10000);
    } finally {
      setIsLoading(false);
    }
  };




  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    dni: "",
    rtn: "",
    telefono: "",
    direccion: "",
    genero: "",
  })

  // Datos de ejemplo
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validaciones (igual que antes)
    if (!formData.nombre1 || !formData.apellido1 || !formData.dni || !formData.telefono) {
      setError("Por favor, complete todos los campos obligatorios");
      setIsLoading(false);
      return;
    }

    if (!formData.genero) {
      setError("Por favor, seleccione un género");
      setIsLoading(false);
      return;
    }

    const dniRegex = /^\d{4}-\d{4}-\d{5}$/;
    if (!dniRegex.test(formData.dni)) {
      setError("Por favor, ingrese un DNI válido en el formato 0000-0000-00000");
      setIsLoading(false);
      return;
    }

    try {
      let res;
      if (editingClient) {
        res = await fetch("/api/clientes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClient.id, ...formData }),
        });
        setSuccess("Cliente actualizado correctamente");
        // Limpiar la alerta de éxito después de 10 segundos
        setTimeout(() => setSuccess(""), 10000);
      } else {
        res = await fetch("/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        setSuccess("Cliente registrado correctamente");
        // Limpiar la alerta de éxito después de 10 segundos
        setTimeout(() => setSuccess(""), 10000);
      }

      await res.json();
      fetchClientes(); // recarga lista desde la API
      setFormData({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        dni: "",
        rtn: "",
        telefono: "",
        direccion: "",
        genero: "",
      });
      setShowForm(false);
      setEditingClient(null);
    } catch (err) {
      setError("Error al guardar el cliente. Inténtelo de nuevo.");
      // Limpiar el error después de 10 segundos (10000 ms)
      setTimeout(() => {
        setError("");
      }, 10000);
    } finally {
      setIsLoading(false);
    }
  };


  const handleEdit = (cliente: Cliente) => {
    setFormData({ ...cliente })
    setEditingClient(cliente)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
      try {
        await fetch(`/api/clientes?id=${id}`, { method: "DELETE" });
        setSuccess("Cliente eliminado correctamente");
        // Limpiar la alerta de éxito después de 10 segundos
        setTimeout(() => setSuccess(""), 10000);
        fetchClientes(); // recarga lista desde la API
      } catch {
        setError("Error al eliminar cliente");
        // Limpiar el error después de 10 segundos (10000 ms)
        setTimeout(() => {
          setError("");
        }, 10000);
      }
    }
  };


  const filteredClientes = clientes.filter((cliente) =>
    (cliente.nombre1?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (cliente.nombre2?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (cliente.apellido1?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (cliente.apellido2?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );


  const handleBack = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src="/logo2.png"
                alt="Logo"
                className="w-50"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:block">Bienvenido, Usuario</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="logout-button">
              <MdLogout className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto pt-5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => (window.location.href = "/dashboard")} className="regresar-btn">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Panel Principal
            </Button>

            <div>
              <h1 className="text-2xl text-foreground titulo flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <span>Gestión de Contribuyentes</span>
              </h1>
              <p className="parrafo text-muted-foreground">
                Administre y mantenga la información de sus contribuyentes
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm} className="nuevo-btn">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Contribuyente
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Alertas */}
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
      </div>

      {/* Formulario de registro/edición */}
      {showForm && (
        <Card className="mb-6 card-principal max-w-7xl mx-auto p-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingClient ? "Editar Contribuyente" : "Registrar Nuevo Contribuyente"}</CardTitle>
                <CardDescription>
                  {editingClient
                    ? "Modifique los datos del Contribuyente"
                    : "Complete la información del Contribuyente"}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false)
                  setEditingClient(null)
                  setFormData({
                    nombre1: "",
                    nombre2: "",
                    apellido1: "",
                    apellido2: "",
                    dni: "",
                    rtn: "",
                    telefono: "",
                    direccion: "",
                    genero: "",
                  })
                }}
              >
                <MdCancel className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-7xl mx-auto">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="nombre1"
                      value={formData.nombre1}
                      onChange={(e) => handleInputChange("nombre1", e.target.value)}
                      placeholder="Primer nombre"
                      required
                      className="card-content"
                    />
                    <Input
                      id="nombre2"
                      value={formData.nombre2}
                      onChange={(e) => handleInputChange("nombre2", e.target.value)}
                      placeholder="Segundo nombre"
                      className="card-content"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <div className="grid grid-cols-2 gap-2">
                   <Input
                      id="apellido1"
                      value={formData.apellido1}
                      onChange={(e) => handleInputChange("apellido1", e.target.value)}
                      placeholder="Primer apellido"
                      required
                      className="card-content"
                    />
                    <Input
                      id="apellido2"
                      value={formData.apellido2}
                      onChange={(e) => handleInputChange("apellido2", e.target.value)}
                      placeholder="Segundo apellido"
                      required
                      className="card-content"
                    />
                  </div>
                </div>
              </div>

              {/* DNI y RTN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="DNI">DNI *</Label>
                  <Input
                    id="DNI"
                    value={formData.dni}
                    onChange={(e) => handleInputChange("dni", e.target.value)}
                    placeholder="Ejemplo: 0318-2000-12345"
                    required
                    className="card-content"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RTN">RTN</Label>
                  <Input
                    id="RTN"
                    value={formData.rtn}
                    onChange={(e) => handleInputChange("rtn", e.target.value)}
                    placeholder="Ejemplo: 0318-2000-123456"
                    className="card-content"
                  />
                </div>
              </div>

              {/* Teléfono y Genero */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                      placeholder="Ejemplo: +504 9999-9999"
                      required
                      className="card-content"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <div className="grid grid-cols-2 gap-2">
                   <Select
                      value={formData.genero}
                      onValueChange={(value) => handleInputChange("genero", value)}
                    >
                      <SelectTrigger className="card-content">
                        <SelectValue placeholder="Seleccione el género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Direccion */} 
                           
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    placeholder="Describa Aldea, caserío, barrio o colonia"
                    className="card-content w-full border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    required
                  />
                </div>               
              </div>

              {/* Botones */}
              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="nuevo-btn">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Guardando..." : editingClient ? "Actualizar Contribuyente" : "Registrar Contribuyente"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingClient(null)
                  }}
                  className="regresar-btn"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Contribuyentes */}
      {!showForm && (
        <Card className="mb-6 card-principal max-w-7xl mx-auto p-6">
          <CardHeader>
            <div className="flex items-center justify-between space-y-6 w-full max-w-7xl mx-auto">
              <div>
                <CardTitle>Lista de Contribuyentes</CardTitle>
                <CardDescription>Gestione y visualice todos los contribuyentes registrados</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative card-content">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contribuyentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClientes.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No se encontraron contribuyentes</p>
                </div>
              ) : (
                filteredClientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors card-content"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg parrafo">
                            {cliente.nombre1} {cliente.nombre2} {cliente.apellido1} {cliente.apellido2}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2 parrafo">
                            <FaRegIdCard className="h-4 w-4" />
                            <span>{cliente.dni}</span>
                          </div>
                          <div className="flex items-center space-x-2 parrafo">
                            <FaPhoneAlt className="h-4 w-4" />
                            <span>{cliente.telefono}</span>
                          </div>
                          <div className="flex items-center space-x-2 parrafo col-span-1 md:col-span-2">
                            <FaHome className="h-4 w-4" />
                            <span>{cliente.direccion}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente.id)}>
                          <FaTrash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

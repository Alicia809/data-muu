"use client"

import "./registro-animales.css"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MdLogout, MdAdd, MdEdit, MdDelete, MdSearch, MdArrowBack, MdSave, MdCancel, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { GiCow } from "react-icons/gi"
import { PiCowDuotone } from "react-icons/pi"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface Semoviente {
  id: number
  tipo_animal: string
  color: string
  venteado: string
  cv_tipo_semoviente_id: string
}

interface Tipo_Semoviente {
  id: number
  nombre: string
  descripcion: string
}

export default function FormSemoviente() {
  const router = useRouter()

  const [showForm, setShowForm] = useState(false)
  const [showFormTipo, setShowFormTipo] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Semoviente | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // semovientes
  const [animales, setSemovientes] = useState<Semoviente[]>([])
  // tipos semoviente
  const [tiposAnimal, setTiposAnimal] = useState<Tipo_Semoviente[]>([])

  // form semoviente
  const [formData, setFormData] = useState({
    tipo_animal: "",
    color: "",
    venteado: "",
    cv_tipo_semoviente_id: "",
  })

  // form tipo semoviente
  const [formTipoData, setFormTipoData] = useState({
    nombre: "",
    descripcion: "",
  })

  useEffect(() => {
    fetchSemoviente()
    fetchTipo_Semoviente()
  }, [])

  // cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // traer semovientes
  const fetchSemoviente = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/animales")
      const data = await res.json()

      if (Array.isArray(data)) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          tipo_animal: c.tipo_animal,
          color: c.color,
          venteado: c.venteado,
          cv_tipo_semoviente_id: c.cv_tipo_semoviente_id,
        }))
        setSemovientes(mapped)
      } else {
        setSemovientes([])
      }
    } catch (err) {
      setError("Error al cargar los semovientes")      
      console.error('Error detalle GET animales:', err);
      setSemovientes([])
    } finally {
      setIsLoading(false)
    }
  }

  // traer tipos de semoviente
  const fetchTipo_Semoviente = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/animales/tipo_animal")
      const data = await res.json()

      if (Array.isArray(data)) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          nombre: c.nombre,
          descripcion: c.descripcion,
        }))
        setTiposAnimal(mapped)
      } else {
        setTiposAnimal([])
      }
    } catch (err) {
      setError("Error al cargar los tipos de semovientes")
      setTiposAnimal([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTipoInputChange = (field: string, value: string) => {
    setFormTipoData((prev) => ({ ...prev, [field]: value }))
  }

  // submit semoviente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formData.tipo_animal || !formData.color || !formData.venteado) {
      setError("Por favor, complete todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    try {
      let res
      if (editingAnimal) {
        res = await fetch("/api/animales", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAnimal.id, ...formData }),
        })
        setSuccess("Semoviente actualizado correctamente")
      } else {
        res = await fetch("/api/animales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        setSuccess("Semoviente registrado correctamente")
      }

      await res.json()
      fetchSemoviente()
      setFormData({ tipo_animal: "", color: "", venteado:  "", cv_tipo_semoviente_id: "" })
      setShowForm(false)
      setEditingAnimal(null)
    } catch (err) {
      setError("Error al guardar el semoviente. Inténtelo de nuevo.")
      console.error('Error detalle POST animales:', err);
    } finally {
      setIsLoading(false)
    }
  }

  // submit tipo semoviente
  const handleSubmitTipo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formTipoData.nombre) {
      setError("Por favor, complete el nombre del tipo")
      setIsLoading(false)
      return
    }

    try {
      let res = await fetch("/api/animales/tipo_animal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formTipoData),
      })
      setSuccess("Tipo de semoviente registrado correctamente")
      await res.json()
      fetchTipo_Semoviente()
      setFormTipoData({ nombre: "", descripcion: "" })
      setShowFormTipo(false)
    } catch (err) {
      setError("Error al guardar el tipo. Inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (animal: Semoviente) => {
    setFormData({
      id: animal.id,
      color: animal.color,
      venteado: animal.venteado,
      tipo_animal: animal.tipo_animal,                  // nombre del tipo
      cv_tipo_semoviente_id: animal.cv_tipo_semoviente_id, // id del tipo
    });
    setEditingAnimal(animal);
    setShowForm(true);
  };


  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este semoviente?")) {
      try {
        await fetch(`/api/animales?id=${id}`, { method: "DELETE" })
        setSuccess("Semoviente eliminado correctamente")
        fetchSemoviente()
      } catch {
        setError("Error al eliminar semoviente")
      }
    }
  }

  const handleDeleteTipo = async (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este tipo de semoviente?")) {
      try {
        await fetch(`/api/animales/tipo_animal?id=${id}`, { method: "DELETE" })
        setSuccess("Tipo de semoviente eliminado correctamente")
        fetchTipo_Semoviente()
      } catch {
        setError("Error al eliminar tipo")
      }
    }
  }

  const resetForm = () => {
    setFormData({ tipo_animal: "", color: "", venteado: "", cv_tipo_semoviente_id: "" })
    setEditingAnimal(null)
    setShowForm(false)
  }

  const resetFormTipo = () => {
    setFormTipoData({ nombre: "", descripcion: "" })
    setShowFormTipo(false)
  }

  const filteredAnimales = animales.filter((animal) => {
    const venteadoText = animal.venteado ? "venteado" : "no venteado"; // convertir booleano a texto
    return (
      animal.tipo_animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.color.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  return (
    <div className="animales-page min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/logo2.png" alt="Logo" className="w-50" />
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
              <MdArrowBack className="h-4 w-4 mr-2" />
              Panel Principal
            </Button>
            <div>
              <h1 className="text-2xl text-foreground titulo flex items-center space-x-2">
                <PiCowDuotone className="h-6 w-6 text-primary" />
                <span>Registro de Semovientes</span>
              </h1>
              <p className="parrafo text-muted-foreground">Gestione el registro de semovientes</p>
            </div>
          </div>
          <Button onClick={() => setShowFormTipo(true)} disabled={showFormTipo} className="nuevo-btn">
            <MdAdd className="h-4 w-4 mr-2" />
            Registrar Tipo de Semoviente
          </Button>
          <Button onClick={() => setShowForm(true)} disabled={showForm} className="nuevo-btn">
            <MdAdd className="h-4 w-4 mr-2" />
            Registrar Semoviente
          </Button>
        </div>

        {/* FORMULARIO SEMOVIENTE */}
        {showForm && (
          <Card className="mb-8 card-principal max-w-3xl mx-auto p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="titulo">
                    {editingAnimal ? "Editar Semoviente" : "Registrar Nuevo Semoviente"}
                  </CardTitle>
                  <CardDescription className="parrafo">Complete la información del animal</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <MdCancel className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="tipo_animal" className="parrafo">Tipo de semoviente</Label>
                    <select
                      id="tipo_animal"
                      value={formData.cv_tipo_semoviente_id || ""}
                      onChange={(e) => {
                        const selectedTipo = tiposAnimal.find(
                          (tipo) => tipo.id === Number(e.target.value)
                        );
                        if (selectedTipo) {
                          setFormData({
                            ...formData,
                            cv_tipo_semoviente_id: selectedTipo.id,
                            tipo_animal: selectedTipo.nombre, // enviar también el nombre
                          });
                        }
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposAnimal.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="color" className="parrafo">
                      Color
                    </Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      className="parrafo card-content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="Venteado" className="parrafo">
                      ¿Venteado?
                    </Label>
                    <select
                      id="Venteado"
                      value={formData.venteado}
                     onChange={(e) => handleInputChange("venteado", e.target.value === "Sí" ? "Sí" : "No")}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background parrafo card-content"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="nuevo-btn">
                    <MdSave className="h-4 w-4 mr-2" />
                    {editingAnimal ? "Actualizar Semoviente" : "Registrar Semoviente"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="regresar-btn">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* FORMULARIO TIPO SEMOVIENTE */}
        {showFormTipo && (
          <Card className="mb-8 card-principal max-w-3xl mx-auto p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="titulo">Registrar Tipo de Semoviente</CardTitle>
                  <CardDescription className="parrafo">Complete la información del tipo de semoviente</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={resetFormTipo}>
                  <MdCancel className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmitTipo} className="space-y-6 w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nombre" className="parrafo">
                      Nombre del Tipo *
                    </Label>
                    <Input
                      id="nombre"
                      value={formTipoData.nombre}
                      onChange={(e) => handleTipoInputChange("nombre", e.target.value)}
                      required
                      className="parrafo card-content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcion" className="parrafo">
                      Descripción
                    </Label>
                    <Textarea
                      id="descripcion"
                      value={formTipoData.descripcion}
                      onChange={(e) => handleTipoInputChange("descripcion", e.target.value)}
                      className="parrafo card-content"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="nuevo-btn">
                    <MdSave className="h-4 w-4 mr-2" />
                    Registrar Tipo
                  </Button>
                  <Button type="button" variant="outline" onClick={resetFormTipo} className="regresar-btn">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* LISTA DE SEMOVIENTES */}
        {!showForm && !showFormTipo && (
          <div className="space-y-6">
            {/* Búsqueda */}
            <Card className="card-principal">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1  card-content">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por tipo o color"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 parrafo"
                    />
                  </div>
                  <Badge variant="secondary" className="parrafo">
                    {filteredAnimales.length} animal{filteredAnimales.length !== 1 ? "es" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Lista de animales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimales.map((animal) => (
                <Card key={animal.id} className="overflow-hidden w-[300px] p-4 mx-auto">
                  <CardHeader>
                    <div className="flex items-center justify-center">
                      <CardTitle className="text-lg titulo">
                        <GiCow className="h-10 w-10 mr-2" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color:</span>
                      <span>{animal.color}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo de Semoviente:</span>
                      <span>{animal.tipo_animal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Venteado:</span>
                      {animal.venteado.trim().toLowerCase() === "sí" ? (
                        <MdCheckBox className="text-green-600 w-5 h-5" />
                      ) : (
                        <MdCheckBoxOutlineBlank className="text-green-600 w-5 h-5" />
                      )}
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(animal)} className="nuevo-btn">
                        <MdEdit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(animal.id)} className="regresar-btn">
                        <MdDelete className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAnimales.length === 0 && (
              <Card>
                <CardContent className="text-center py-12 parrafo">
                  <PiCowDuotone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg mb-2 titulo">No se encontraron animales</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "No hay animales que coincidan con su búsqueda."
                      : "Comience registrando su primer animal."}
                  </p>
                  <Button onClick={() => setShowForm(true)} className="nuevo-btn">
                    <MdAdd className="h-4 w-4 mr-2" />
                    Registrar Primer Animal
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Lista de Tipos de Semoviente */}
            <Card>
              <CardHeader>
                <CardTitle className="titulo">Tipos de Semovientes Registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tiposAnimal.map((t) => (
                    <Card
                      key={t.id}
                      className="overflow-hidden w-[200px] p-2 mx-auto"
                    >
                      <div className="flex items-center justify-between"> 
                        {/* Nombre del tipo */}
                        <CardTitle className="text-lg titulo parrafo">{t.nombre}</CardTitle>

                        {/* Botón eliminar */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTipo(t.id)}
                          className="flex items-center regresar-btn"
                        >
                          <MdDelete className="h-4 w-4 mr-1" />                          
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

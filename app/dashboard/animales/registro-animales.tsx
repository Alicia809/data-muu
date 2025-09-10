"use client"
 
import "./registro-animales.css"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  MdPets,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdArrowBack,
  MdImage,
  MdSave,
  MdCancel,
} from "react-icons/md"

import {
  MdLogout,
} from "react-icons/md"


import { PiCowDuotone } from "react-icons/pi"

export default function AnimalesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    color: "",
    Tipo_de_semoviente: "",
    Venteado: "",
    observaciones: "",
  })

  // Tipos de semovientes
  const [showFormTipo, setShowFormTipo] = useState(false)
  const [editingTipo, setEditingTipo] = useState(null)
  const [tipos, setTipos] = useState([
    { id: 1, tipo: "Vaca", descripcion: "Animal hembra productora de leche" },
    { id: 2, tipo: "Toro", descripcion: "Animal macho reproductor" },
  ])
  const [formTipo, setFormTipo] = useState({
    tipo: "",
    descripcion: "",
  })


  const handleLogout = () => {
    // Aquí conectarías con tu API de logout
    console.log("Cerrando sesión...")
    window.location.href = "/login"
  }

  const [animales, setAnimales] = useState([
    {
      id: 1,
      nombre: "Thunder",
      color: "Castaño",
      Tipo_de_semoviente: "Macho",
      observaciones: "Animal de competición",
    },
    {
      id: 2,
      nombre: "Bella",
      color: "Blanco y Negro",
      Tipo_de_semoviente: "Hembra",
      observaciones: "Excelente productora de leche",
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAnimal) {
      setAnimales(
        animales.map((animal) =>
          animal.id === editingAnimal.id
            ? { ...formData, id: editingAnimal.id, imagen: selectedImage || editingAnimal.imagen }
            : animal
        )
      )
    } else {
      const newAnimal = {
        ...formData,
        id: Date.now(),
        imagen: selectedImage || "/animal-gen-rico.png",
      }
      setAnimales([...animales, newAnimal])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      color: "",
      Tipo_de_semoviente: "",
      Venteado: "",
      observaciones: "",
    })
    setSelectedImage(null)
    setShowForm(false)
    setEditingAnimal(null)
  }

  const handleEdit = (animal) => {
    setFormData(animal)
    setSelectedImage(animal.imagen)
    setEditingAnimal(animal)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("¿Está seguro de que desea eliminar este animal?")) {
      setAnimales(animales.filter((animal) => animal.id !== id))
    }
  }


  const filteredAnimales = animales.filter(
    (animal) =>
      animal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.Tipo_de_semoviente.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  const handleSubmitTipo = (e) => {
  e.preventDefault()
  if (editingTipo) {
    setTipos(
      tipos.map((t) =>
        t.id === editingTipo.id
          ? { ...formTipo, id: editingTipo.id }
          : t
      )
    )
  } else {
    const newTipo = {
      ...formTipo,
      id: Date.now(),
    }
    setTipos([...tipos, newTipo])
  }
  resetFormTipo()
}

const resetFormTipo = () => {
  setFormTipo({ tipo: "", descripcion: "" })
  setShowFormTipo(false)
  setEditingTipo(null)
}

const handleEditTipo = (tipo) => {
  setFormTipo(tipo)
  setEditingTipo(tipo)
  setShowFormTipo(true)
}

const handleDeleteTipo = (id) => {
  if (confirm("¿Está seguro de que desea eliminar este tipo?")) {
    setTipos(tipos.filter((t) => t.id !== id))
  }
}

  return (
    <div className="animales-page min-h-screen bg-background">
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
              <MdArrowBack className="h-4 w-4 mr-2" />
              Panel Principal
            </Button>
            <div>
              <h1 className="text-2xl text-foreground titulo flex items-center space-x-2">
                <PiCowDuotone className="h-6 w-6 text-primary" />
                <span>Registro de Semovientes</span>
              </h1>
              <p className="parrafo text-muted-foreground">
                Gestione el registro de animales 
              </p>
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

        {showForm ? (
          <Card className="mb-8 card-principal max-w-3xl mx-auto p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="titulo">
                    {editingAnimal ? "Editar Animal" : "Registrar Nuevo Semoviente"}
                  </CardTitle>
                  <CardDescription className="parrafo">
                    Complete la información del animal
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetForm(); // esta ya limpia y cierra
                  }}
                >
                  <MdCancel className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nombre" className="parrafo">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                      className="parrafo card-content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color" className="parrafo">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="parrafo card-content"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="Tipo_de_semoviente" className="parrafo">Tipo de semoviente</Label>
                    <select
                      id="Tipo_de_semoviente"
                      value={formData.Tipo_de_semoviente}
                      onChange={(e) => setFormData({ ...formData, Tipo_de_semoviente: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background parrafo card-content"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Vaca">Vaca</option>
                      <option value="Toro">Toro</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="Venteado" className="parrafo">¿Venteado?</Label>
                    <select
                      id="Venteado"
                      value={formData.Venteado}
                      onChange={(e) => setFormData({ ...formData, Venteado: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background parrafo card-content"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observaciones" className="parrafo">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    rows={3}
                    className="parrafo card-content"
                  />
                </div>

                {/* Botones */}
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
        ) : showFormTipo ? (
            <Card className="mb-8 card-principal max-w-3xl mx-auto p-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="titulo">
                      {editingTipo ? "Editar Tipo de Semoviente" : "Registrar Tipo de Semoviente"}
                    </CardTitle>
                    <CardDescription className="parrafo">
                      Complete la información del tipo de semoviente
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetFormTipo()}
                  >
                    <MdCancel className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmitTipo} className="space-y-6 w-full max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tipo" className="parrafo">Tipo de Semoviente *</Label>
                      <Input
                        id="tipo"
                        value={formTipo.tipo}
                        onChange={(e) => setFormTipo({ ...formTipo, tipo: e.target.value })}
                        required
                        className="parrafo card-content"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descripcion" className="parrafo">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formTipo.descripcion}
                        onChange={(e) => setFormTipo({ ...formTipo, descripcion: e.target.value })}
                        className="parrafo card-content"
                      />
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4">
                    <Button type="submit" className="nuevo-btn">
                      <MdSave className="h-4 w-4 mr-2" />
                      {editingTipo ? "Actualizar Tipo" : "Registrar Tipo"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetFormTipo} className="regresar-btn">
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>              
        ) : (
          <div className="space-y-6">
            {/* Búsqueda */}
            <Card className="card-principal">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1  card-content">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre o propietario..."
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
                  <div className="inline-flex items-center justify-center">
                    
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-center">
                      <CardTitle className="text-lg titulo">{animal.nombre}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span>{animal.color}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo de Semoviente:</span>
                        <span>{animal.Tipo_de_semoviente}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venteado:</span>
                        <span>{animal.Venteado ? "Sí" : "No"}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tipos.map((t) => (
                    <Card key={t.id} className="overflow-hidden w-[300px] p-4 mx-auto">
                      <CardHeader>
                        <div className="flex items-center justify-center">
                          <CardTitle className="text-lg titulo">{t.tipo}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{t.descripcion}</p>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => handleEditTipo(t)} className="nuevo-btn">
                            <MdEdit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteTipo(t.id)} className="regresar-btn">
                            <MdDelete className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
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

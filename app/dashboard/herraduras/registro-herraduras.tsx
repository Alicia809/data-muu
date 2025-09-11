"use client"


import "./registro-herraduras.css"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MdBuild, MdAdd, MdEdit, MdDelete, MdSearch, MdArrowBack, MdImage, MdSave, MdCancel } from "react-icons/md"
import {
  MdLogout,
} from "react-icons/md"
import { TbHorseshoe } from "react-icons/tb"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function HerradurasPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingHerradura, setEditingHerradura] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({
    codigo: "",
    propietario: "",
    observaciones: "",
    imagen: null,
  })


  const router = useRouter()

  const handleLogout = async () => {
    // Cerrar sesión en Supabase
    await supabase.auth.signOut()
    // Redirigir a login
    router.push("/login")
  }

  // Datos de ejemplo
  const [herraduras, setHerraduras] = useState([
    {
      id: 1,
      codigo: "HRD-001",
      propietario: "Carlos Mendoza",
      observaciones: "Herradura para caballo de trabajo",
      imagen: "/herradura-acero.png",
    },
    {
      id: 2,
      codigo: "HRD-002",
      propietario: "Ana Rodríguez",
      observaciones: "Herradura especial para rehabilitación",
      imagen: "/herradura-aluminio.png",
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingHerradura) {
      setHerraduras(
        herraduras.map((herradura) =>
          herradura.id === editingHerradura.id
            ? { ...formData, id: editingHerradura.id, imagen: selectedImage || editingHerradura.imagen }
            : herradura,
        ),
      )
    } else {
      const newHerradura = {
        ...formData,
        id: Date.now(),
        imagen: selectedImage || "/herradura-gen-rica.png",
      }
      setHerraduras([...herraduras, newHerradura])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      codigo: "",
      propietario: "",
      observaciones: "",
      imagen: null,
    })
    setSelectedImage(null)
    setShowForm(false)
    setEditingHerradura(null)
  }

  const handleEdit = (herradura) => {
    setFormData(herradura)
    setSelectedImage(herradura.imagen)
    setEditingHerradura(herradura)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("¿Está seguro de que desea eliminar esta herradura?")) {
      setHerraduras(herraduras.filter((herradura) => herradura.id !== id))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredHerraduras = herraduras.filter((h) =>
    [h.codigo, h.propietario].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

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
              <MdArrowBack className="h-4 w-4 mr-2" />
              Panel Principal
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <TbHorseshoe className="h-6 w-6 text-primary" />
                <span>Registro de Fierros</span>
              </h1>
              <p className="text-muted-foreground">
                Gestione el registro de fierros con imágenes y datos del propietario
              </p>
            </div>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="nuevo-btn">
              <MdAdd className="h-4 w-4 mr-2" />
              Registrar Fierro
            </Button>
          )}
        </div>

        {showForm ? (
          /* Formulario de registro */
          <Card className="mb-8 card-principal">
            <CardHeader>
              <CardTitle>{editingHerradura ? "Editar Herradura" : "Registrar Nuevo Fierro"}</CardTitle>
              <CardDescription>Complete la información del Fierro y del propietario</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Imagen */}
                  <div className="space-y-4">
                    <Label>Imagen del Fierro</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center card-content">
                      {selectedImage ? (
                        <div className="space-y-4">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg mx-auto"
                          />
                          <Button type="button" variant="outline" onClick={() => setSelectedImage(null)}>
                            Cambiar Imagen
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <MdImage className="h-12 w-12 text-muted-foreground mx-auto" />
                          <div>
                            <Label htmlFor="imagen" className="cursor-pointer">
                              <Button type="button" variant="outline">
                                Seleccionar Imagen
                              </Button>
                            </Label>
                            <Input
                              id="imagen"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información de la herradura */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="codigo">Código *</Label>
                      <Input
                        id="codigo"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        placeholder="Ej: HRD-001"
                        required
                        className="card-content"
                      />
                    </div>
                    {/* Información del propietario */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Datos del Propietario</h3>
                    <div>
                      <Label htmlFor="propietario">Nombre del Propietario *</Label>
                      <Select
                        value={formData.propietario}
                        onValueChange={(value) => setFormData({ ...formData, propietario: value })}
                      >
                        <SelectTrigger id="propietario" className="card-content">
                          <SelectValue placeholder="Seleccione el propietario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carlos">Carlos Mendoza</SelectItem>
                          <SelectItem value="ana">Ana Rodríguez</SelectItem>
                          <SelectItem value="luis">Luis Fernández</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={formData.observaciones}
                        onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                        rows={3}
                        className="card-content"
                      />
                    </div>
                  </div>

                  
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="nuevo-btn">
                    <MdSave className="h-4 w-4 mr-2" />
                    {editingHerradura ? "Actualizar Fierro" : "Registrar Fierro"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="regresar-btn">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Lista de herraduras */
          <div className="space-y-6">
            {/* Barra de búsqueda */}
            <Card className="card-principal">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 card-content">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por código o propietario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Badge variant="secondary">
                    {filteredHerraduras.length} herradura{filteredHerraduras.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Grid de herraduras */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredHerraduras.map((herradura) => (
                <Card key={herradura.id} className="overflow-hidden w-[300px] p-4 mx-auto">
                  <div className="inline-flex items-center justify-center">
                    <img
                      src={herradura.imagen || "/placeholder.svg"}
                      
                      alt={herradura.codigo}
                      className="w-40 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{herradura.codigo}</CardTitle>
                      <Badge variant="outline">{herradura.estado}</Badge>
                    </div>
                    <CardDescription>{herradura.tipo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                     
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Propietario:</span>
                        <span>{herradura.propietario}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(herradura)} className="nuevo-btn">
                        <MdEdit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(herradura.id)} className="regresar-btn">
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
                  <h3 className="text-lg font-medium mb-2">No se encontraron fierros</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "No hay Fierros que coincidan con su búsqueda."
                      : "Comience registrando su primera Fierro."}
                  </p>
                  <Button onClick={() => setShowForm(true)} className="nuevo-btn">
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
  )
}

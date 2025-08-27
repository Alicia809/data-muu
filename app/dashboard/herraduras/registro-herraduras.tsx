"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MdBuild, MdAdd, MdEdit, MdDelete, MdSearch, MdArrowBack, MdImage, MdSave, MdCancel } from "react-icons/md"

export default function HerradurasPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingHerradura, setEditingHerradura] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({
    codigo: "",
    tipo: "",
    tamaño: "",
    material: "",
    peso: "",
    estado: "",
    fechaFabricacion: "",
    propietario: "",
    telefono: "",
    email: "",
    direccion: "",
    observaciones: "",
    imagen: null,
  })

  // Datos de ejemplo
  const [herraduras, setHerraduras] = useState([
    {
      id: 1,
      codigo: "HRD-001",
      tipo: "Herradura Estándar",
      tamaño: "Talla 3",
      material: "Acero Forjado",
      peso: "250g",
      estado: "Nueva",
      fechaFabricacion: "2024-01-15",
      propietario: "Carlos Mendoza",
      telefono: "555-0789",
      email: "carlos@email.com",
      direccion: "Calle Principal 123",
      observaciones: "Herradura para caballo de trabajo",
      imagen: "/herradura-acero.png",
    },
    {
      id: 2,
      codigo: "HRD-002",
      tipo: "Herradura Terapéutica",
      tamaño: "Talla 4",
      material: "Aluminio",
      peso: "180g",
      estado: "Usada",
      fechaFabricacion: "2023-12-10",
      propietario: "Ana Rodríguez",
      telefono: "555-0321",
      email: "ana@email.com",
      direccion: "Avenida Central 456",
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
      tipo: "",
      tamaño: "",
      material: "",
      peso: "",
      estado: "",
      fechaFabricacion: "",
      propietario: "",
      telefono: "",
      email: "",
      direccion: "",
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

  const filteredHerraduras = herraduras.filter(
    (herradura) =>
      herradura.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herradura.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herradura.propietario.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => (window.location.href = "/dashboard")}>
              <MdArrowBack className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <MdBuild className="h-6 w-6 text-primary" />
                <span>Registro de Herraduras</span>
              </h1>
              <p className="text-muted-foreground">
                Gestione el registro de herraduras con imágenes y datos del propietario
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <MdAdd className="h-4 w-4 mr-2" />
            Registrar Herradura
          </Button>
        </div>

        {showForm ? (
          /* Formulario de registro */
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingHerradura ? "Editar Herradura" : "Registrar Nueva Herradura"}</CardTitle>
              <CardDescription>Complete la información de la herradura y del propietario</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Imagen */}
                  <div className="space-y-4">
                    <Label>Imagen de la Herradura</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo de Herradura *</Label>
                      <Input
                        id="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        placeholder="Ej: Herradura Estándar"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tamaño">Tamaño</Label>
                        <Input
                          id="tamaño"
                          value={formData.tamaño}
                          onChange={(e) => setFormData({ ...formData, tamaño: e.target.value })}
                          placeholder="Ej: Talla 3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="peso">Peso</Label>
                        <Input
                          id="peso"
                          value={formData.peso}
                          onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                          placeholder="Ej: 250g"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="Ej: Acero Forjado"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estado">Estado</Label>
                        <select
                          id="estado"
                          value={formData.estado}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Nueva">Nueva</option>
                          <option value="Usada">Usada</option>
                          <option value="Reparada">Reparada</option>
                          <option value="Descartada">Descartada</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="fechaFabricacion">Fecha de Fabricación</Label>
                        <Input
                          id="fechaFabricacion"
                          type="date"
                          value={formData.fechaFabricacion}
                          onChange={(e) => setFormData({ ...formData, fechaFabricacion: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información del propietario */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Datos del Propietario</h3>
                    <div>
                      <Label htmlFor="propietario">Nombre Completo *</Label>
                      <Input
                        id="propietario"
                        value={formData.propietario}
                        onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={formData.observaciones}
                        onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit">
                    <MdSave className="h-4 w-4 mr-2" />
                    {editingHerradura ? "Actualizar Herradura" : "Registrar Herradura"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <MdCancel className="h-4 w-4 mr-2" />
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
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por código, tipo o propietario..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHerraduras.map((herradura) => (
                <Card key={herradura.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={herradura.imagen || "/placeholder.svg"}
                      alt={herradura.codigo}
                      className="w-full h-full object-cover"
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
                        <span className="text-muted-foreground">Tamaño:</span>
                        <span>{herradura.tamaño}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material:</span>
                        <span>{herradura.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peso:</span>
                        <span>{herradura.peso}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Propietario:</span>
                        <span>{herradura.propietario}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(herradura)}>
                        <MdEdit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(herradura.id)}>
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
                  <MdBuild className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron herraduras</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "No hay herraduras que coincidan con su búsqueda."
                      : "Comience registrando su primera herradura."}
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <MdAdd className="h-4 w-4 mr-2" />
                    Registrar Primera Herradura
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

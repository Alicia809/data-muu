"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MdPets, MdAdd, MdEdit, MdDelete, MdSearch, MdArrowBack, MdImage, MdSave, MdCancel } from "react-icons/md"

export default function AnimalesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    peso: "",
    color: "",
    sexo: "",
    propietario: "",
    telefono: "",
    observaciones: "",
    imagen: null,
  })

  // Datos de ejemplo
  const [animales, setAnimales] = useState([
    {
      id: 1,
      nombre: "Thunder",
      especie: "Equino",
      raza: "Pura Sangre",
      edad: "5 años",
      peso: "450 kg",
      color: "Castaño",
      sexo: "Macho",
      propietario: "Juan Pérez",
      telefono: "555-0123",
      observaciones: "Animal de competición",
      imagen: "/caballo-casta-o.png",
    },
    {
      id: 2,
      nombre: "Bella",
      especie: "Bovino",
      raza: "Holstein",
      edad: "3 años",
      peso: "600 kg",
      color: "Blanco y Negro",
      sexo: "Hembra",
      propietario: "María García",
      telefono: "555-0456",
      observaciones: "Excelente productora de leche",
      imagen: "/vaca-holstein.png",
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAnimal) {
      setAnimales(
        animales.map((animal) =>
          animal.id === editingAnimal.id
            ? { ...formData, id: editingAnimal.id, imagen: selectedImage || editingAnimal.imagen }
            : animal,
        ),
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
      especie: "",
      raza: "",
      edad: "",
      peso: "",
      color: "",
      sexo: "",
      propietario: "",
      telefono: "",
      observaciones: "",
      imagen: null,
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

  const filteredAnimales = animales.filter(
    (animal) =>
      animal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.propietario.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <MdPets className="h-6 w-6 text-primary" />
                <span>Registro de Animales</span>
              </h1>
              <p className="text-muted-foreground">Gestione el registro de animales con imágenes y características</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <MdAdd className="h-4 w-4 mr-2" />
            Registrar Animal
          </Button>
        </div>

        {showForm ? (
          /* Formulario de registro */
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingAnimal ? "Editar Animal" : "Registrar Nuevo Animal"}</CardTitle>
              <CardDescription>Complete la información del animal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Imagen */}
                  <div className="space-y-4">
                    <Label>Imagen del Animal</Label>
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

                  {/* Información básica */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre del Animal *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="especie">Especie *</Label>
                      <Input
                        id="especie"
                        value={formData.especie}
                        onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                        placeholder="Ej: Equino, Bovino, Ovino"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="raza">Raza</Label>
                      <Input
                        id="raza"
                        value={formData.raza}
                        onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edad">Edad</Label>
                        <Input
                          id="edad"
                          value={formData.edad}
                          onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                          placeholder="Ej: 3 años"
                        />
                      </div>
                      <div>
                        <Label htmlFor="peso">Peso</Label>
                        <Input
                          id="peso"
                          value={formData.peso}
                          onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                          placeholder="Ej: 450 kg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sexo">Sexo</Label>
                        <select
                          id="sexo"
                          value={formData.sexo}
                          onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Macho">Macho</option>
                          <option value="Hembra">Hembra</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="propietario">Propietario *</Label>
                      <Input
                        id="propietario"
                        value={formData.propietario}
                        onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
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
                    {editingAnimal ? "Actualizar Animal" : "Registrar Animal"}
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
          /* Lista de animales */
          <div className="space-y-6">
            {/* Barra de búsqueda */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre, especie o propietario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Badge variant="secondary">
                    {filteredAnimales.length} animal{filteredAnimales.length !== 1 ? "es" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Grid de animales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimales.map((animal) => (
                <Card key={animal.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={animal.imagen || "/placeholder.svg"}
                      alt={animal.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{animal.nombre}</CardTitle>
                      <Badge variant="outline">{animal.especie}</Badge>
                    </div>
                    <CardDescription>{animal.raza}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Edad:</span>
                        <span>{animal.edad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peso:</span>
                        <span>{animal.peso}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span>{animal.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Propietario:</span>
                        <span>{animal.propietario}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(animal)}>
                        <MdEdit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(animal.id)}>
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
                <CardContent className="text-center py-12">
                  <MdPets className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron animales</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "No hay animales que coincidan con su búsqueda."
                      : "Comience registrando su primer animal."}
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <MdAdd className="h-4 w-4 mr-2" />
                    Registrar Primer Animal
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

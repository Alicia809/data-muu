"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, User, Mail, Phone, MapPin, Building2, Save, X } from "lucide-react"

interface Cliente {
  id: number
  nombre: string
  apellidos: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  codigoPostal: string
  tipoCliente: string
  empresa?: string
  notas?: string
  fechaRegistro: string
}

export default function ClientesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    tipoCliente: "",
    empresa: "",
    notas: "",
  })

  // Datos de ejemplo (en producción vendrían de tu API)
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nombre: "Juan",
      apellidos: "Pérez García",
      email: "juan.perez@email.com",
      telefono: "+34 600 123 456",
      direccion: "Calle Mayor 123",
      ciudad: "Madrid",
      codigoPostal: "28001",
      tipoCliente: "particular",
      notas: "Cliente preferente",
      fechaRegistro: "2024-01-15",
    },
    {
      id: 2,
      nombre: "María",
      apellidos: "González López",
      email: "maria.gonzalez@empresa.com",
      telefono: "+34 600 789 012",
      direccion: "Avenida Principal 456",
      ciudad: "Barcelona",
      codigoPostal: "08001",
      tipoCliente: "empresa",
      empresa: "Empresa ABC S.L.",
      fechaRegistro: "2024-01-20",
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validación básica
    if (!formData.nombre || !formData.apellidos || !formData.email || !formData.telefono) {
      setError("Por favor, complete todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor, ingrese un email válido")
      setIsLoading(false)
      return
    }

    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingClient) {
        // Actualizar cliente existente
        setClientes((prev) =>
          prev.map((cliente) => (cliente.id === editingClient.id ? { ...cliente, ...formData } : cliente)),
        )
        setSuccess("Cliente actualizado correctamente")
      } else {
        // Crear nuevo cliente
        const nuevoCliente: Cliente = {
          id: Date.now(),
          ...formData,
          fechaRegistro: new Date().toISOString().split("T")[0],
        }
        setClientes((prev) => [nuevoCliente, ...prev])
        setSuccess("Cliente registrado correctamente")
      }

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        tipoCliente: "",
        empresa: "",
        notas: "",
      })
      setShowForm(false)
      setEditingClient(null)
    } catch (err) {
      setError("Error al guardar el cliente. Inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      codigoPostal: cliente.codigoPostal,
      tipoCliente: cliente.tipoCliente,
      empresa: cliente.empresa || "",
      notas: cliente.notas || "",
    })
    setEditingClient(cliente)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id))
      setSuccess("Cliente eliminado correctamente")
    }
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBack = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Gestión de Clientes</h1>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </header>

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

          {/* Formulario de registro/edición */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{editingClient ? "Editar Cliente" : "Registrar Nuevo Cliente"}</CardTitle>
                    <CardDescription>
                      {editingClient ? "Modifique los datos del cliente" : "Complete la información del cliente"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowForm(false)
                      setEditingClient(null)
                      setFormData({
                        nombre: "",
                        apellidos: "",
                        email: "",
                        telefono: "",
                        direccion: "",
                        ciudad: "",
                        codigoPostal: "",
                        tipoCliente: "",
                        empresa: "",
                        notas: "",
                      })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información personal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Nombre del cliente"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange("apellidos", e.target.value)}
                        placeholder="Apellidos del cliente"
                        required
                      />
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="cliente@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="+34 600 123 456"
                        required
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                      placeholder="Calle, número, piso..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange("ciudad", e.target.value)}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                        placeholder="28001"
                      />
                    </div>
                  </div>

                  {/* Tipo de cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
                      <Select
                        value={formData.tipoCliente}
                        onValueChange={(value) => handleInputChange("tipoCliente", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="empresa">Empresa</SelectItem>
                          <SelectItem value="autonomo">Autónomo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.tipoCliente === "empresa" && (
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Nombre de la Empresa</Label>
                        <Input
                          id="empresa"
                          value={formData.empresa}
                          onChange={(e) => handleInputChange("empresa", e.target.value)}
                          placeholder="Nombre de la empresa"
                        />
                      </div>
                    )}
                  </div>

                  {/* Notas */}
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas adicionales</Label>
                    <Textarea
                      id="notas"
                      value={formData.notas}
                      onChange={(e) => handleInputChange("notas", e.target.value)}
                      placeholder="Información adicional sobre el cliente..."
                      rows={3}
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Guardando..." : editingClient ? "Actualizar Cliente" : "Registrar Cliente"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setEditingClient(null)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de clientes */}
          {!showForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>Gestione y visualice todos los clientes registrados</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar clientes..."
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
                      <p className="text-muted-foreground">No se encontraron clientes</p>
                    </div>
                  ) : (
                    filteredClientes.map((cliente) => (
                      <div
                        key={cliente.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                {cliente.nombre} {cliente.apellidos}
                              </h3>
                              <Badge variant={cliente.tipoCliente === "empresa" ? "default" : "secondary"}>
                                {cliente.tipoCliente}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{cliente.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{cliente.telefono}</span>
                              </div>
                              {cliente.ciudad && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{cliente.ciudad}</span>
                                </div>
                              )}
                              {cliente.empresa && (
                                <div className="flex items-center space-x-2">
                                  <Building2 className="h-4 w-4" />
                                  <span>{cliente.empresa}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
      </div>
    </div>
  )
}

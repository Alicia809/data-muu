"use client"

import "./registro-clientes.css"
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
import { ArrowLeft, Plus, Search, Edit, Trash2, User, Mail, Phone, IdCard , Building2, Save, X } from "lucide-react"
import {
  MdLogout, MdCancel
} from "react-icons/md"

interface Cliente {
  id: number
  nombre: string
  apellidos: string
  DNI: string
  telefono: string
  direccion: string
  RTN: string
  Género: string
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

  const handleLogout = () => {
    // Aquí conectarías con tu API de logout
    console.log("Cerrando sesión...")
    window.location.href = "/login"
  }

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    DNI: "",
    telefono: "",
    direccion: "",
    RTN: "",
    Género: "",
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
      DNI: "0318-2000-54321",
      telefono: "+504 9990-0000",
      direccion: "Calle Mayor 123",
      RTN: "0318-2000-543211",
      Género: "Masculino",
      tipoCliente: "particular",
      notas: "Cliente preferente",
      fechaRegistro: "2024-01-15",
    },
    {
      id: 2,
      nombre: "María",
      apellidos: "González López",
      DNI: "0318-1990-00000",
      telefono: "+504 9999-0000",
      direccion: "Avenida Principal 456",
      RTN: "0318-2000-543212",
      Género: "Femenino",
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
    if (!formData.nombre || !formData.apellidos || !formData.DNI || !formData.telefono) {
      setError("Por favor, complete todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    const dniRegex = /^\d{4}-\d{4}-\d{5}$/;

    if (!dniRegex.test(formData.DNI)) {
      setError("Por favor, ingrese un DNI válido en el formato 0000-0000-00000");
      setIsLoading(false);
      return;
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
        DNI: "",
        telefono: "",
        direccion: "",
        RTN: "",
        Género: "",
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
      DNI: cliente.DNI,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      RTN: cliente.RTN,
      Género: cliente.Género,
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
      cliente.DNI.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <span>Gestión de Clientes</span>
              </h1>
              <p className="parrafo text-muted-foreground">
                Administre y mantenga la información de sus clientes
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm} className="nuevo-btn">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
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

          {/* Formulario de registro/edición */}
          {showForm && (
            <Card className="mb-6 card-principal">
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
                        DNI: "",
                        telefono: "",
                        direccion: "",
                        RTN: "",
                        Género: "",
                        tipoCliente: "",
                        empresa: "",
                        notas: "",
                      })
                    }}
                  >
                    <MdCancel className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre y Apellidos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombres *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange("nombre", e.target.value)}
                          placeholder="Primer nombre del cliente"
                          required
                          className="card-content"
                        />
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange("nombre", e.target.value)}
                          placeholder="Segundo nombre del cliente"
                          className="card-content"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="apellidos"
                          value={formData.apellidos}
                          onChange={(e) => handleInputChange("apellidos", e.target.value)}
                          placeholder="Primer apellido del cliente"
                          required
                          className="card-content"
                        />
                        <Input
                          id="apellidos"
                          value={formData.apellidos}
                          onChange={(e) => handleInputChange("apellidos", e.target.value)}
                          placeholder="Segundo apellido del cliente"
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
                        value={formData.DNI}
                        onChange={(e) => handleInputChange("DNI", e.target.value)}
                        placeholder="Ejemplo: 0318-2000-12345"
                        required
                        className="card-content"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="RTN">RTN (opcional)</Label>
                      <Input
                        id="RTN"
                        value={formData.RTN}
                        onChange={(e) => handleInputChange("RTN", e.target.value)}
                        placeholder="Ejemplo: 0318-2000-123456"
                        className="card-content"
                      />
                    </div>
                  </div>

                  {/* Teléfono y Dirección */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="Ejemplo: +504 9999-9999"
                        required
                        className="card-content"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                        placeholder="Describa Aldea, caserillo, barrio o colonia"
                        className="card-content"
                      />
                    </div>
                  </div>

                  {/* Género y Tipo de cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genero">Género *</Label>
                      <Select
                        value={formData.Género}
                        onValueChange={(value) => handleInputChange("Género", value)}
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
                    <div className="space-y-2">
                      <Label htmlFor="tipoCliente">Tipo de Cliente *</Label>
                      <Select
                        value={formData.tipoCliente}
                        onValueChange={(value) => handleInputChange("tipoCliente", value)}
                      >
                        <SelectTrigger className="card-content">
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="empresa">Empresa</SelectItem>
                          <SelectItem value="autonomo">Autónomo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Empresa (si aplica) */}
                  {formData.tipoCliente === "empresa" && (
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Nombre de la Empresa</Label>
                      <Input
                        id="empresa"
                        value={formData.empresa}
                        onChange={(e) => handleInputChange("empresa", e.target.value)}
                        placeholder="Nombre de la empresa"
                        className="card-content"
                      />
                    </div>
                  )}

                  {/* Notas */}
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas adicionales</Label>
                    <Textarea
                      id="notas"
                      value={formData.notas}
                      onChange={(e) => handleInputChange("notas", e.target.value)}
                      placeholder="Información adicional sobre el cliente..."
                      rows={3}
                      className="card-content"
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={isLoading} className="nuevo-btn">
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
                      className="regresar-btn"
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
            <Card className="card-principal">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>Gestione y visualice todos los clientes registrados</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative card-content">
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
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors card-content"
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
                                <span>{cliente.DNI}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{cliente.telefono}</span>
                              </div>
                              {cliente.RTN && (
                                <div className="flex items-center space-x-2">
                                  <IdCard  className="h-4 w-4" />
                                  <span>{cliente.DNI}</span>
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
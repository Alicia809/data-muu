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
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Search, FileText, Download, Printer, Eye, Calendar, User, Save, X } from "lucide-react"

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
}

interface Documento {
  id: number
  tipo: string
  titulo: string
  cliente: Cliente
  datos: Record<string, any>
  fechaCreacion: string
  estado: string
}

export default function DocumentosPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  // Datos de ejemplo de clientes
  const clientes: Cliente[] = [
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
    },
  ]

  // Estado del formulario de documento
  const [documentData, setDocumentData] = useState({
    titulo: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
    importe: "",
    concepto: "",
    observaciones: "",
    validoHasta: "",
    numeroDocumento: "",
    condiciones: "",
  })

  // Documentos de ejemplo
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: 1,
      tipo: "contrato",
      titulo: "Contrato de Servicios #001",
      cliente: clientes[0],
      datos: { importe: "1500", concepto: "Servicios de consultoría" },
      fechaCreacion: "2024-01-15",
      estado: "generado",
    },
    {
      id: 2,
      tipo: "factura",
      titulo: "Factura #002",
      cliente: clientes[1],
      datos: { importe: "850", concepto: "Desarrollo web" },
      fechaCreacion: "2024-01-20",
      estado: "enviado",
    },
  ])

  const tiposDocumento = [
    { value: "contrato", label: "Contrato de Servicios" },
    { value: "factura", label: "Factura" },
    { value: "presupuesto", label: "Presupuesto" },
    { value: "certificado", label: "Certificado" },
    { value: "carta", label: "Carta Comercial" },
    { value: "recibo", label: "Recibo" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setDocumentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!selectedClient || !documentType || !documentData.titulo) {
      setError("Por favor, complete todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    try {
      // Simulación de generación de documento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const nuevoDocumento: Documento = {
        id: Date.now(),
        tipo: documentType,
        titulo: documentData.titulo,
        cliente: selectedClient,
        datos: documentData,
        fechaCreacion: new Date().toISOString().split("T")[0],
        estado: "generado",
      }

      setDocumentos((prev) => [nuevoDocumento, ...prev])
      setSuccess("Documento generado correctamente")

      // Limpiar formulario
      setDocumentData({
        titulo: "",
        descripcion: "",
        fecha: new Date().toISOString().split("T")[0],
        importe: "",
        concepto: "",
        observaciones: "",
        validoHasta: "",
        numeroDocumento: "",
        condiciones: "",
      })
      setSelectedClient(null)
      setDocumentType("")
      setShowForm(false)
    } catch (err) {
      setError("Error al generar el documento. Inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    if (!selectedClient || !documentType || !documentData.titulo) {
      setError("Complete los campos obligatorios para ver la vista previa")
      return
    }
    setShowPreview(true)
  }

  const handlePrint = (documento: Documento) => {
    // Aquí implementarías la lógica de impresión
    console.log("Imprimiendo documento:", documento)
    alert("Función de impresión activada")
  }

  const handleDownload = (documento: Documento) => {
    // Aquí implementarías la lógica de descarga
    console.log("Descargando documento:", documento)
    alert("Función de descarga activada")
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBack = () => {
    window.location.href = "/dashboard"
  }

  const renderDocumentFields = () => {
    switch (documentType) {
      case "contrato":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importe">Importe del Contrato</Label>
                <Input
                  id="importe"
                  value={documentData.importe}
                  onChange={(e) => handleInputChange("importe", e.target.value)}
                  placeholder="1500.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validoHasta">Válido Hasta</Label>
                <Input
                  id="validoHasta"
                  type="date"
                  value={documentData.validoHasta}
                  onChange={(e) => handleInputChange("validoHasta", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condiciones">Condiciones del Contrato</Label>
              <Textarea
                id="condiciones"
                value={documentData.condiciones}
                onChange={(e) => handleInputChange("condiciones", e.target.value)}
                placeholder="Términos y condiciones del contrato..."
                rows={4}
              />
            </div>
          </>
        )
      case "factura":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroDocumento">Número de Factura</Label>
                <Input
                  id="numeroDocumento"
                  value={documentData.numeroDocumento}
                  onChange={(e) => handleInputChange("numeroDocumento", e.target.value)}
                  placeholder="FAC-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="importe">Importe Total</Label>
                <Input
                  id="importe"
                  value={documentData.importe}
                  onChange={(e) => handleInputChange("importe", e.target.value)}
                  placeholder="850.00"
                />
              </div>
            </div>
          </>
        )
      case "presupuesto":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importe">Importe del Presupuesto</Label>
                <Input
                  id="importe"
                  value={documentData.importe}
                  onChange={(e) => handleInputChange("importe", e.target.value)}
                  placeholder="2500.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validoHasta">Válido Hasta</Label>
                <Input
                  id="validoHasta"
                  type="date"
                  value={documentData.validoHasta}
                  onChange={(e) => handleInputChange("validoHasta", e.target.value)}
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
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
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Generación de Documentos</h1>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Documento
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

          {/* Formulario de generación de documento */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generar Nuevo Documento</CardTitle>
                    <CardDescription>Complete los datos para generar el documento</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedClient(null)
                      setDocumentType("")
                      setShowPreview(false)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selección de cliente */}
                  <div className="space-y-4">
                    <Label>Cliente *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchTerm && (
                      <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                        {filteredClientes.map((cliente) => (
                          <div
                            key={cliente.id}
                            className={`p-3 cursor-pointer hover:bg-muted/50 ${
                              selectedClient?.id === cliente.id ? "bg-accent" : ""
                            }`}
                            onClick={() => {
                              setSelectedClient(cliente)
                              setSearchTerm("")
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {cliente.nombre} {cliente.apellidos}
                                </p>
                                <p className="text-sm text-muted-foreground">{cliente.email}</p>
                              </div>
                              <Badge variant={cliente.tipoCliente === "empresa" ? "default" : "secondary"}>
                                {cliente.tipoCliente}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedClient && (
                      <div className="p-3 bg-accent rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {selectedClient.nombre} {selectedClient.apellidos}
                            </p>
                            <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tipo de documento */}
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Tipo de Documento *</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposDocumento.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Datos básicos del documento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título del Documento *</Label>
                      <Input
                        id="titulo"
                        value={documentData.titulo}
                        onChange={(e) => handleInputChange("titulo", e.target.value)}
                        placeholder="Ej: Contrato de Servicios #001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha del Documento</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={documentData.fecha}
                        onChange={(e) => handleInputChange("fecha", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concepto">Concepto/Descripción</Label>
                    <Input
                      id="concepto"
                      value={documentData.concepto}
                      onChange={(e) => handleInputChange("concepto", e.target.value)}
                      placeholder="Descripción del servicio o producto"
                    />
                  </div>

                  {/* Campos específicos por tipo de documento */}
                  {documentType && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Datos Específicos del {tiposDocumento.find((t) => t.value === documentType)?.label}
                        </h3>
                        {renderDocumentFields()}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={documentData.observaciones}
                      onChange={(e) => handleInputChange("observaciones", e.target.value)}
                      placeholder="Notas adicionales..."
                      rows={3}
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Generando..." : "Generar Documento"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handlePreview}>
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setSelectedClient(null)
                        setDocumentType("")
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Vista previa del documento */}
          {showPreview && selectedClient && documentType && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vista Previa del Documento</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-8 border border-border rounded-lg shadow-sm">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{documentData.titulo}</h1>
                    <p className="text-gray-600">Fecha: {documentData.fecha}</p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Datos del Cliente:</h2>
                    <p className="text-gray-700">
                      {selectedClient.nombre} {selectedClient.apellidos}
                    </p>
                    <p className="text-gray-700">{selectedClient.email}</p>
                    <p className="text-gray-700">{selectedClient.telefono}</p>
                    {selectedClient.direccion && (
                      <p className="text-gray-700">
                        {selectedClient.direccion}, {selectedClient.ciudad}
                      </p>
                    )}
                  </div>

                  {documentData.concepto && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Concepto:</h2>
                      <p className="text-gray-700">{documentData.concepto}</p>
                    </div>
                  )}

                  {documentData.importe && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Importe:</h2>
                      <p className="text-xl font-bold text-gray-900">€{documentData.importe}</p>
                    </div>
                  )}

                  {documentData.observaciones && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Observaciones:</h2>
                      <p className="text-gray-700">{documentData.observaciones}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de documentos generados */}
          {!showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos Generados</CardTitle>
                <CardDescription>Historial de documentos creados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentos.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No hay documentos generados</p>
                    </div>
                  ) : (
                    documentos.map((documento) => (
                      <div
                        key={documento.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">{documento.titulo}</h3>
                              <Badge variant="outline">{documento.tipo}</Badge>
                              <Badge variant={documento.estado === "enviado" ? "default" : "secondary"}>
                                {documento.estado}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>
                                  {documento.cliente.nombre} {documento.cliente.apellidos}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{documento.fechaCreacion}</span>
                              </div>
                              {documento.datos.importe && (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">€{documento.datos.importe}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleDownload(documento)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handlePrint(documento)}>
                              <Printer className="h-4 w-4" />
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

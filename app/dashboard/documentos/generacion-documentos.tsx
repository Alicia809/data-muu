"use client"
import "./generacion-documentos.css"
import { es } from 'date-fns/locale'
import { jsPDF } from "jspdf"
import "./fonts/Montserrat-Bold-normal.js"
import "./fonts/Roboto-Light-normal.js"
import type React from "react"
import { useState, useEffect, useMemo } from "react" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  Printer,
  Eye,
  Calendar,
  User,
  Save,
  X,
  CheckCircle,
  Lock,
  Edit,
} from "lucide-react"
import { MdLogout } from "react-icons/md"
import { format } from "date-fns"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

interface Persona {
  id: number
  p_nombre: string
  s_nombre: string | null
  p_apellido: string
  s_apellido: string | null
  dni: string
  domicilio: string
  telefono_1: string
}

interface Semoviente {
  id: number
  tipo_animal: string
  color: string
  venteado: string
  cv_tipo_semoviente_id: number
}

interface CartaVentaGanado {
  id: string
  numeroRegistro: string
  tomo: number
  folio: number
  registro: number
  vendedorId: number | null
  compradorId: number | null
  semovienteId: number | null
  precio: string
  fechaSolicitud: string
  fechaRegistro: string | null
  estado: "borrador" | "confirmado"
  observaciones?: string
  nombreAbogado: string
}

export default function DocumentosPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCarta, setEditingCarta] = useState<CartaVentaGanado | null>(null)
  const [selectedVendedor, setSelectedVendedor] = useState<Persona | null>(null)
  const [selectedComprador, setSelectedComprador] = useState<Persona | null>(null)
  const [selectedSemoviente, setSelectedSemoviente] = useState<Semoviente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cartas, setCartas] = useState<CartaVentaGanado[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [semovientes, setSemovientes] = useState<Semoviente[]>([])
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

  useEffect(() => {
    fetchPersonas()
    fetchSemovientes()
    fetchCartas()
  }, [])

  const fetchPersonas = async () => {
    try {
      const res = await fetch("/api/clientes")  
      if (!res.ok) throw new Error("Error al cargar personas")
      const data = await res.json()
      setPersonas(data)
    } catch (err) {
      console.error(err)
      setError("No se pudieron cargar las personas")
    }
  }

  const fetchSemovientes = async () => {
    try {
      const res = await fetch("/api/animales")
      if (!res.ok) throw new Error("Error al cargar semovientes")
      const data = await res.json()
      setSemovientes(data)
    } catch (err) {
      console.error(err)
      setError("No se pudieron cargar los semovientes")
    }
  }

  const fetchCartas = async () => {
    try {
      const res = await fetch("/api/documentos")
      if (!res.ok) throw new Error("Error al cargar cartas")
      const data = await res.json()
      setCartas(data)
    } catch (err) {
      console.error(err)
      setError("No se pudieron cargar las cartas de venta")
    }
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    window.location.href = "/login"
  }

  const generarNumeroRegistro = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const lastId = cartas.filter(c => c.folio === month && c.tomo === year).length
    const nextRegistro = lastId + 1
    return {
      numeroRegistro: `${year}${String(month).padStart(2, "0")}${String(nextRegistro).padStart(4, "0")}`,
      tomo: year,
      folio: month,
      registro: nextRegistro,
    }
  }

  const nuevoNumeroRegistro = useMemo(() => {
    if (editingCarta) {
      return editingCarta.numeroRegistro; 
    }
    return generarNumeroRegistro().numeroRegistro; 
  }, [editingCarta, cartas]); 

  useEffect(() => {
    if (editingCarta) {
      setFormData({
        vendedorId: editingCarta.vendedorId,
        compradorId: editingCarta.compradorId,
        semovienteId: editingCarta.semovienteId,
        precio: editingCarta.precio,
        fechaSolicitud: editingCarta.fechaSolicitud,
        fechaRegistro: editingCarta.fechaRegistro,
        observaciones: editingCarta.observaciones || "",
        estado: editingCarta.estado,
        nombreAbogado: editingCarta.nombreAbogado,
      })
      const vendedor = personas.find((p) => p.id === editingCarta.vendedorId) || null
      const comprador = personas.find((p) => p.id === editingCarta.compradorId) || null
      const semoviente = semovientes.find((s) => s.id === editingCarta.semovienteId) || null
      setSelectedVendedor(vendedor)
      setSelectedComprador(comprador)
      setSelectedSemoviente(semoviente)
    } else {
      resetForm()
    }
  }, [editingCarta, personas, semovientes])

  const resetForm = () => {
    setFormData({
      vendedorId: null,
      compradorId: null,
      semovienteId: null,
      precio: "",
      fechaSolicitud: format(new Date(), "yyyy-MM-dd"),
      fechaRegistro: null,
      observaciones: "",
      estado: "borrador",
      nombreAbogado: "Lucas Martínez",
    })
    setSelectedVendedor(null)
    setSelectedComprador(null)
    setSelectedSemoviente(null)
    setShowForm(false)
    setEditingCarta(null)
    setError("")
    setSuccess("")
  }

  const [formData, setFormData] = useState({
    vendedorId: null as number | null,
    compradorId: null as number | null,
    semovienteId: null as number | null,
    precio: "",
    fechaSolicitud: format(new Date(), "yyyy-MM-dd"),
    fechaRegistro: null as string | null,
    observaciones: "",
    estado: "borrador" as "borrador" | "confirmado",
    nombreAbogado: "Lucas Martínez",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formData.vendedorId || !formData.compradorId || !formData.semovienteId || !formData.precio) {
      setError("Por favor, complete todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    const vendedor = getPersonaById(formData.vendedorId)
    const comprador = getPersonaById(formData.compradorId)
    const dniRegex = /^\d{4}-\d{4}-\d{5}$/

    if (vendedor && !dniRegex.test(vendedor.dni)) {
      setError("El DNI del vendedor no tiene un formato válido (0000-0000-00000)")
      setIsLoading(false)
      return
    }

    if (comprador && !dniRegex.test(comprador.dni)) {
      setError("El DNI del comprador no tiene un formato válido (0000-0000-00000)")
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        vendedorId: formData.vendedorId,
        compradorId: formData.compradorId,
        semovienteId: formData.semovienteId,
        precio: formData.precio,
        fechaSolicitud: formData.fechaSolicitud,
        observaciones: formData.observaciones,
        estado: formData.estado,
        nombreAbogado: formData.nombreAbogado,
      }

      const url = editingCarta ? "/api/documentos" : "/api/documentos"
      const method = editingCarta ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error en la respuesta del servidor")

      const cartaGuardada = await res.json()

      if (editingCarta) {
        setCartas(prev => prev.map(c => c.id === editingCarta.id ? cartaGuardada : c))
        setSuccess("Carta actualizada correctamente")
      } else {
        setCartas(prev => [cartaGuardada, ...prev])
        setSuccess("Carta de venta creada correctamente")
      }

      resetForm()
    } catch (err: any) {
      setError(err.message || "Error al guardar la carta. Inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmar = async () => {
    if (!formData.vendedorId || !formData.compradorId || !formData.semovienteId || !formData.precio) {
      setError("Complete todos los campos obligatorios antes de confirmar")
      return
    }

    if (!window.confirm("¿Está seguro de confirmar esta carta? No podrá editarse después.")) {
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        vendedorId: formData.vendedorId,
        compradorId: formData.compradorId,
        semovienteId: formData.semovienteId,
        precio: formData.precio,
        fechaSolicitud: formData.fechaSolicitud,
        observaciones: formData.observaciones,
        estado: "confirmado",
        nombreAbogado: formData.nombreAbogado,
      }

      const res = await fetch("/api/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error al confirmar la carta")

      const cartaConfirmada = await res.json()
      setCartas(prev => [cartaConfirmada, ...prev])
      setEditingCarta(cartaConfirmada)  
      setFormData(prev => ({ ...prev, estado: "confirmado" })) 
      setSuccess("Carta confirmada correctamente. Ahora puede exportarla como PDF.")
    } catch (err) {
      setError("Error al confirmar la carta. Inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (carta: CartaVentaGanado) => {
    if (carta.estado === "confirmado") {
      setError("No se puede editar una carta confirmada")
      return
    }
    setEditingCarta(carta)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta carta?")) return

    try {
      const res = await fetch(`/api/documentos?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar")

      setCartas(prev => prev.filter(c => c.id !== id))
      setSuccess("Carta eliminada correctamente")

      if (editingCarta?.id === id) resetForm()
    } catch {
      setError("Error al eliminar la carta")
    }
  }

  const handlePrint = (carta: CartaVentaGanado) => {
    if (carta.estado !== "confirmado") {
      alert("Solo se pueden imprimir cartas confirmadas")
      return
    }
    alert(`Imprimiendo Carta de Venta #${carta.numeroRegistro}`)
  }

  function numeroALetras(numStr: string): string {
    const num = parseFloat(numStr)
    if (isNaN(num)) return "Cero"

    const unidades = [
      "", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
      "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
    ]
    const decenas = [
      "", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa",
    ]
    const centenas = [
      "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos",
    ]

    function convertir(num: number): string {
      if (num === 0) return ""
      if (num < 20) return unidades[num]
      if (num < 100) {
        if (num % 10 === 0) return decenas[Math.floor(num / 10)]
        return `${decenas[Math.floor(num / 10)]} y ${unidades[num % 10]}`
      }
      if (num === 100) return "cien"
      if (num < 1000) return `${centenas[Math.floor(num / 100)]} ${convertir(num % 100)}`
      if (num < 2000) return `mil ${convertir(num % 1000)}`
      if (num < 10000) {
        const miles = Math.floor(num / 1000)
        const resto = num % 1000
        return `${unidades[miles]} mil${resto > 0 ? " " + convertir(resto) : ""}`
      }
      if (num < 100000) {
        const decenasDeMil = Math.floor(num / 1000)
        const resto = num % 1000
        return `${convertir(decenasDeMil)} mil${resto > 0 ? " " + convertir(resto) : ""}`
      }
      if (num < 1000000) {
        const centenasDeMil = Math.floor(num / 1000)
        const resto = num % 1000
        return `${convertir(centenasDeMil)} mil${resto > 0 ? " " + convertir(resto) : ""}`
      }
      return "Número demasiado grande"
    }

    const enteros = Math.floor(num)
    const decimales = Math.round((num - enteros) * 100)

    let resultado = ""
    if (enteros === 0) {
      resultado = "cero"
    } else {
      if (enteros === 1) {
        resultado = "un"
      } else {
        resultado = convertir(enteros)
      }
    }

    if (enteros > 1) resultado += " lempiras"
    else if (enteros === 1) resultado += " lempira"

    return `${resultado.toUpperCase()} (${num.toFixed(2)})`
  }

  const handleExportPDF = () => {
    if (!selectedVendedor || !selectedComprador || !selectedSemoviente || !formData.precio) {
      alert("Complete todos los campos antes de exportar")
      return
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const logoPath = "/logo1.png"
    const selloPath = "/logo1.png"

    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`))
        img.src = src
      })
    }

    const addParagraph = (
      doc: any,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      highlightWords: string[] = []
    ) => {
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        let currentX = x
        const words = line.split(" ")
        words.forEach((word) => {
          const cleanWord = word.replace(/[.,;:()\-]/g, "").toUpperCase()
          const isBold = highlightWords.some((hw) => {
            const cleanHw = hw.replace(/[.,;:()\-]/g, "").toUpperCase()
            return cleanWord === cleanHw
          })
          if (isBold) {
            doc.setFont("Montserrat-Bold", "normal")
          } else {
            doc.setFont("Roboto-Light", "normal")
          }
          doc.text(word + " ", currentX, y)
          currentX += doc.getTextWidth(word + " ")
        })
        y += lineHeight
      })
      return y
    }

    Promise.all([loadImage(logoPath), loadImage(selloPath)])
      .then(([logoImg, selloImg]) => {
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 10
        const contentWidth = pageWidth - margin * 2
        let y = 20
        const lineHeight = 5.8

        doc.setDrawColor(0)
        doc.setLineWidth(0.3)
        doc.rect(margin - 2, 8, contentWidth + 4, 270)

        doc.addImage(logoImg as HTMLImageElement, "PNG", margin, 10, 25, 15)
        doc.addImage(selloImg as HTMLImageElement, "PNG", pageWidth - margin - 25, 10, 25, 15)

        doc.setFont("Montserrat-Bold", "normal")
        doc.setFontSize(12)
        doc.text("Municipalidad de [Nombre del municipio]", pageWidth / 2, y, { align: "center" })
        y += 6
        doc.setFontSize(11)
        doc.text("Departamento de Comayagua", pageWidth / 2, y, { align: "center" })
        y += 6
        doc.text("Tel: 2487-1712", pageWidth / 2, y, { align: "center" })
        y += 12

        doc.setFontSize(14)
        doc.text("CARTA DE VENTA", pageWidth / 2, y, { align: "center" })
        y += 10

        doc.setFont("Roboto-Light", "normal")
        doc.setFontSize(10)
        const maxWidth = contentWidth - 10

        const nombreVendedor = `${selectedVendedor.p_nombre} ${selectedVendedor.s_nombre || ""} ${selectedVendedor.p_apellido} ${selectedVendedor.s_apellido || ""}`.trim()
        const nombreComprador = `${selectedComprador.p_nombre} ${selectedComprador.s_nombre || ""} ${selectedComprador.p_apellido} ${selectedComprador.s_apellido || ""}`.trim()
        const montoEnLetras = numeroALetras(formData.precio).toUpperCase().trim()

        const highlightWords = [
          ...nombreVendedor.split(" ").map(w => w.toUpperCase()),
          ...nombreComprador.split(" ").map(w => w.toUpperCase()),
          selectedVendedor.dni.replace(/[^0-9A-Z]/g, "").toUpperCase(),
          selectedComprador.dni.replace(/[^0-9A-Z]/g, "").toUpperCase(),
          selectedVendedor.telefono_1.replace(/[^0-9]/g, "").toUpperCase(),
          ...montoEnLetras.split(" "),
        ].filter(word => word !== "Y")

        const textoVendedor = `El vendedor ${nombreVendedor}, hondureño(a), mayor de edad, identificado(a) con DNI número ${selectedVendedor.dni}, con domicilio en ${selectedVendedor.domicilio} con teléfono ${selectedVendedor.telefono_1}, en pleno uso de sus facultades, declara la venta del semoviente descrito en este documento.`
        const textoComprador = `El comprador ${nombreComprador}, hondureño(a), mayor de edad, identificado(a) con DNI número ${selectedComprador.dni}, acepta la adquisición del semoviente en las condiciones aquí establecidas.`
        const textoPrecio = `El semoviente vendido es de color ${selectedSemoviente.color}, herrado y marcado con el fierro que se muestra en el reverso. Se entrega en buen estado, por un valor de ${montoEnLetras}, suma que el vendedor declara haber recibido a satisfacción.`
        const textoFierro = `El semoviente se encuentra identificado con la marca de fierro registrada en el recuadro del presente documento.`
        const notaFinal = `Esta carta de venta es válida únicamente en su versión original. Cualquier alteración o modificación la invalida de inmediato.`
        const fechaEsp = format(new Date(formData.fechaSolicitud), "d 'de' MMMM 'del' yyyy", { locale: es })
        const textoFecha = `Firmado en la ciudad de [Nombre del municipio], Comayagua, a los ${fechaEsp}.`

        y = addParagraph(doc, textoVendedor, margin, y, maxWidth, lineHeight, highlightWords)
        y += 1
        y = addParagraph(doc, textoComprador, margin, y, maxWidth, lineHeight, highlightWords)
        y += 1
        y = addParagraph(doc, textoPrecio, margin, y, maxWidth, lineHeight, highlightWords)
        y += 1

        doc.setFont("Montserrat-Bold", "normal")
        y = addParagraph(doc, textoFierro, margin, y, maxWidth, lineHeight, [])
        doc.setFont("Roboto-Light", "normal")

        doc.rect(pageWidth - 60, y - 6, 50, 20)
        y += lineHeight * 3

        doc.setFontSize(9)
        y = addParagraph(doc, notaFinal, margin, y, maxWidth, lineHeight - 0.5)
        y += lineHeight * 2

        doc.setFontSize(10)
        y = addParagraph(doc, textoFecha, margin, y, maxWidth, lineHeight)
        y += lineHeight * 2

        const tableX = pageWidth - margin - 50
        const tableY = y
        const boxWidth = 25
        const boxHeight = 8

        doc.setFontSize(9)
        doc.setFont("Montserrat-Bold", "normal")
        doc.text("TOMO:", tableX - 20, tableY + 6)
        doc.text("FOLIO:", tableX - 20, tableY + boxHeight + 6)
        doc.text("REGISTRO:", tableX - 20, tableY + boxHeight * 2 + 6)
        doc.setFont("Roboto-Light", "normal")

        const correlativo = editingCarta?.numeroRegistro || generarNumeroRegistro().numeroRegistro || "2025090001"
        const tomo = editingCarta?.tomo || new Date().getFullYear()
        const folio = editingCarta?.folio || new Date().getMonth() + 1
        const registro = correlativo.slice(-4).padStart(4, "0")

        doc.text(String(tomo), tableX + 7, tableY + 6)
        doc.text(String(folio), tableX + 7, tableY + boxHeight + 6)
        doc.text(registro, tableX + 7, tableY + boxHeight * 2 + 6)

        doc.rect(tableX, tableY, boxWidth, boxHeight)
        doc.rect(tableX, tableY + boxHeight, boxWidth, boxHeight)
        doc.rect(tableX, tableY + boxHeight * 2, boxWidth, boxHeight)

        y += boxHeight * 3 + 10

        doc.setFont("Montserrat-Bold", "normal")
        doc.line(15, y, 90, y)
        y += 5
        doc.text("FIRMA DEL VENDEDOR", 15, y)
        y += 25
        doc.line(15, y, 90, y)
        y += 5
        doc.text("SELLO Y FIRMA ABOG. " + formData.nombreAbogado.toUpperCase(), 15, y)
        y += 10
        doc.text("DIRECTOR DE JUSTICIA MUNICIPAL", 15, y)

        const fileName = `CartaVenta_${correlativo}.pdf`
        doc.save(fileName)
      })
      .catch((err) => {
        alert("Error al cargar imágenes para el PDF: " + err.message)
        console.error(err)
      })
  }

  const handleReExportPDF = (carta: CartaVentaGanado) => {
    if (carta.estado !== "confirmado") {
      alert("Solo se pueden volver a exportar cartas confirmadas")
      return
    }

    const vendedor = getPersonaById(carta.vendedorId)
    const comprador = getPersonaById(carta.compradorId)
    const semoviente = getSemovienteById(carta.semovienteId)

    if (!vendedor || !comprador || !semoviente) {
      alert("No se pudieron cargar los datos del documento para re-exportar.")
      return
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const logoPath = "/logo1.png"
    const selloPath = "/logo1.png"

    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`))
        img.src = src
      })
    }

    const addParagraph = (
      doc: any,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      highlightWords: string[] = []
    ) => {
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        let currentX = x
        const words = line.split(" ")
        words.forEach((word) => {
          const cleanWord = word.replace(/[.,;:()\-]/g, "").toUpperCase()
          const isBold = highlightWords.some((hw) => {
            const cleanHw = hw.replace(/[.,;:()\-]/g, "").toUpperCase()
            return cleanWord === cleanHw
          })
          if (isBold) {
            doc.setFont("Montserrat-Bold", "normal")
          } else {
            doc.setFont("Roboto-Light", "normal")
          }
          doc.text(word + " ", currentX, y)
          currentX += doc.getTextWidth(word + " ")
        })
        y += lineHeight
      })
      return y
    }

    Promise.all([loadImage(logoPath), loadImage(selloPath)])
      .then(([logoImg, selloImg]) => {
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 10
        const contentWidth = pageWidth - margin * 2
        let y = 20
        const lineHeight = 5.8

        doc.setDrawColor(0)
        doc.setLineWidth(0.3)
        doc.rect(margin - 2, 8, contentWidth + 4, 270)

        doc.addImage(logoImg as HTMLImageElement, "PNG", margin, 10, 25, 15)
        doc.addImage(selloImg as HTMLImageElement, "PNG", pageWidth - margin - 25, 10, 25, 15)

        doc.setFont("Montserrat-Bold", "normal")
        doc.setFontSize(12)
        doc.text("Municipalidad de [Nombre del municipio]", pageWidth / 2, y, { align: "center" })
        y += 6
        doc.setFontSize(11)
        doc.text("Departamento de Comayagua", pageWidth / 2, y, { align: "center" })
        y += 6
        doc.text("Tel: 2487-1712", pageWidth / 2, y, { align: "center" })
        y += 12

        doc.setFontSize(14)
        doc.text("CARTA DE VENTA", pageWidth / 2, y, { align: "center" })
        y += 10

        doc.setFont("Roboto-Light", "normal")
        doc.setFontSize(10)
        const maxWidth = contentWidth - 10

        const nombreVendedor = `${vendedor.p_nombre} ${vendedor.s_nombre || ""} ${vendedor.p_apellido} ${vendedor.s_apellido || ""}`.trim()
        const nombreComprador = `${comprador.p_nombre} ${comprador.s_nombre || ""} ${comprador.p_apellido} ${comprador.s_apellido || ""}`.trim()
        const montoEnLetras = numeroALetras(carta.precio).toUpperCase().trim()

        const highlightWords = [
          ...nombreVendedor.split(" ").map(w => w.toUpperCase()),
          ...nombreComprador.split(" ").map(w => w.toUpperCase()),
          vendedor.dni.replace(/[^0-9A-Z]/g, "").toUpperCase(),
          comprador.dni.replace(/[^0-9A-Z]/g, "").toUpperCase(),
          vendedor.telefono_1.replace(/[^0-9]/g, "").toUpperCase(),
          ...montoEnLetras.split(" "),
        ].filter(word => word !== "Y")

        const textoVendedor = `El vendedor ${nombreVendedor}, hondureño(a), mayor de edad, identificado(a) con DNI número ${vendedor.dni}, con domicilio en ${vendedor.domicilio} con teléfono ${vendedor.telefono_1}, en pleno uso de sus facultades, declara la venta del semoviente descrito en este documento.`
        const textoComprador = `El comprador ${nombreComprador}, hondureño(a), mayor de edad, identificado(a) con DNI número ${comprador.dni}, acepta la adquisición del semoviente en las condiciones aquí establecidas.`
        const textoPrecio = `El semoviente vendido es de color ${semoviente.color}, herrado y marcado con el fierro que se muestra en el reverso. Se entrega en buen estado, por un valor de ${montoEnLetras}, suma que el vendedor declara haber recibido a satisfacción.`
        const textoFierro = `El semoviente se encuentra identificado con la marca de fierro registrada en el recuadro del presente documento.`
        const notaFinal = `Esta carta de venta es válida únicamente en su versión original. Cualquier alteración o modificación la invalida de inmediato.`
        const fechaEsp = format(new Date(carta.fechaSolicitud), "d 'de' MMMM 'del' yyyy", { locale: es })
        const textoFecha = `Firmado en la ciudad de [Nombre del municipio], Comayagua, a los ${fechaEsp}.`

        y = addParagraph(doc, textoVendedor, margin, y, maxWidth, lineHeight, highlightWords)
        y += 1
        y = addParagraph(doc, textoComprador, margin, y, maxWidth, lineHeight, highlightWords)
        y += 1
        y = addParagraph(doc, textoPrecio, margin, y, maxWidth, lineHeight, highlightWords)
        y += 1

        doc.setFont("Montserrat-Bold", "normal")
        y = addParagraph(doc, textoFierro, margin, y, maxWidth, lineHeight, [])
        doc.setFont("Roboto-Light", "normal")

        doc.rect(pageWidth - 60, y - 6, 50, 20)
        y += lineHeight * 3

        doc.setFontSize(9)
        y = addParagraph(doc, notaFinal, margin, y, maxWidth, lineHeight - 0.5)
        y += lineHeight * 2

        doc.setFontSize(10)
        y = addParagraph(doc, textoFecha, margin, y, maxWidth, lineHeight)
        y += lineHeight * 2

        const tableX = pageWidth - margin - 50
        const tableY = y
        const boxWidth = 25
        const boxHeight = 8

        doc.setFontSize(9)
        doc.setFont("Montserrat-Bold", "normal")
        doc.text("TOMO:", tableX - 20, tableY + 6)
        doc.text("FOLIO:", tableX - 20, tableY + boxHeight + 6)
        doc.text("REGISTRO:", tableX - 20, tableY + boxHeight * 2 + 6)
        doc.setFont("Roboto-Light", "normal")

        doc.text(String(carta.tomo), tableX + 7, tableY + 6)
        doc.text(String(carta.folio), tableX + 7, tableY + boxHeight + 6)
        doc.text(String(carta.registro).padStart(3, "0"), tableX + 7, tableY + boxHeight * 2 + 6)

        doc.rect(tableX, tableY, boxWidth, boxHeight)
        doc.rect(tableX, tableY + boxHeight, boxWidth, boxHeight)
        doc.rect(tableX, tableY + boxHeight * 2, boxWidth, boxHeight)

        y += boxHeight * 3 + 10

        doc.setFont("Montserrat-Bold", "normal")
        doc.line(15, y, 90, y)
        y += 5
        doc.text("FIRMA DEL VENDEDOR", 15, y)
        y += 25
        doc.line(15, y, 90, y)
        y += 5
        doc.text("SELLO Y FIRMA ABOG. " + carta.nombreAbogado.toUpperCase(), 15, y)
        y += 10
        doc.text("DIRECTOR DE JUSTICIA MUNICIPAL", 15, y)

        const fileName = `CartaVenta_${carta.numeroRegistro}.pdf`
        doc.save(fileName)
      })
      .catch((err) => {
        alert("Error al cargar imágenes para el PDF: " + err.message)
        console.error(err)
      })
  }

  const handleVerDocumento = (carta: CartaVentaGanado) => {
    handleReExportPDF(carta)
  }

  const filteredPersonas = personas.filter(
    (persona) =>
      (persona.p_nombre?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (persona.s_nombre?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (persona.p_apellido?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (persona.s_apellido?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (persona.dni?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  )

  const handleBack = () => {
    window.location.href = "/dashboard"
  }

  const getPersonaById = (id: number | null): Persona | null => {
    if (!id) return null
    return personas.find((p) => p.id === id) || null
  }

  const getSemovienteById = (id: number | null): Semoviente | null => {
    if (!id) return null
    return semovientes.find((s) => s.id === id) || null
  }

  return (
    <div className="documentos-page min-h-screen bg-background">
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
            <span className="text-sm text-muted-foreground hidden sm:block titulo">Bienvenido, {userName || "Usuario"}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="logout-button parrafo">
              <MdLogout className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => (window.location.href = "/dashboard")} className="regresar-btn parrafo">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Panel Principal
            </Button>
            <div>
              <h1 className="text-2xl text-foreground titulo flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span>Carta de Ventas</span>
              </h1>
              <p className="parrafo text-muted-foreground">
                Genere y gestione cartas de ventas
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm} className="nuevo-btn parrafo">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Carta
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

          {/* Formulario de carta de venta */}
          {showForm && (
            <Card className="mb-6 card-principal">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {editingCarta
                        ? `Editar Carta #${editingCarta.numeroRegistro}`
                        : "Crear Nueva Carta de Venta"}
                    </CardTitle>
                    <CardDescription>
                      {editingCarta
                        ? editingCarta.estado === "confirmado"
                          ? "Carta confirmada - Solo lectura"
                          : "Modifique los datos de la carta"
                        : "Complete la información para la carta de venta"}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Número de registro */}
                  <div className="space-y-2">
                    <Label>Número de Registro</Label>
                    <Input
                      value={nuevoNumeroRegistro} 
                      disabled
                      className="bg-muted font-mono card-content"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vendedor *</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar vendedor..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 card-content"
                        />
                      </div>
                      {searchTerm && (
                        <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                          {filteredPersonas.map((persona) => (
                            <div
                              key={persona.id}
                              className={`p-3 cursor-pointer hover:bg-muted/50 ${
                                selectedVendedor?.id === persona.id ? "bg-accent" : ""
                              }`}
                              onClick={() => {
                                setSelectedVendedor(persona)
                                setFormData((prev) => ({ ...prev, vendedorId: persona.id }))
                                setSearchTerm("")
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {persona.p_nombre} {persona.s_nombre} {persona.p_apellido} {persona.s_apellido}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{persona.dni}</p>
                                </div>
                                <Badge variant="secondary">Seleccionar</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedVendedor && (
                        <div className="p-3 bg-accent rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {selectedVendedor.p_nombre} {selectedVendedor.s_nombre} {selectedVendedor.p_apellido} {selectedVendedor.s_apellido}
                              </p>
                              <p className="text-sm text-muted-foreground">{selectedVendedor.dni}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVendedor(null)
                                setFormData((prev) => ({ ...prev, vendedorId: null }))
                              }}
                              disabled={editingCarta?.estado === "confirmado"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio (Lps.) *</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        value={formData.precio}
                        onChange={(e) => handleInputChange("precio", e.target.value)}
                        placeholder="0.00"
                        required
                        disabled={editingCarta?.estado === "confirmado"}
                        className="card-content"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Comprador *</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar comprador..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 card-content"
                        />
                      </div>
                      {searchTerm && (
                        <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                          {filteredPersonas.map((persona) => (
                            <div
                              key={persona.id}
                              className={`p-3 cursor-pointer hover:bg-muted/50 ${
                                selectedComprador?.id === persona.id ? "bg-accent" : ""
                              }`}
                              onClick={() => {
                                setSelectedComprador(persona)
                                setFormData((prev) => ({ ...prev, compradorId: persona.id }))
                                setSearchTerm("")
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {persona.p_nombre} {persona.s_nombre} {persona.p_apellido} {persona.s_apellido}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{persona.dni}</p>
                                </div>
                                <Badge variant="secondary">Seleccionar</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedComprador && (
                        <div className="p-3 bg-accent rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {selectedComprador.p_nombre} {selectedComprador.s_nombre} {selectedComprador.p_apellido} {selectedComprador.s_apellido}
                              </p>
                              <p className="text-sm text-muted-foreground">{selectedComprador.dni}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedComprador(null)
                                setFormData((prev) => ({ ...prev, compradorId: null }))
                              }}
                              disabled={editingCarta?.estado === "confirmado"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaSolicitud">Fecha de Solicitud</Label>
                      <Input
                        id="fechaSolicitud"
                        type="date"
                        value={formData.fechaSolicitud}
                        onChange={(e) => handleInputChange("fechaSolicitud", e.target.value)}
                        disabled={editingCarta?.estado === "confirmado"}
                        className="card-content"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Semoviente *</Label>
                      <Select
                        value={formData.semovienteId?.toString() || ""}
                        onValueChange={(value) => {
                          const id = parseInt(value)
                          const semoviente = semovientes.find((s) => s.id === id) || null
                          setSelectedSemoviente(semoviente)
                          setFormData((prev) => ({ ...prev, semovienteId: id }))
                        }}
                        disabled={editingCarta?.estado === "confirmado"}
                      >
                        <SelectTrigger className="card-content">
                          <SelectValue placeholder="Seleccione un semoviente" />
                        </SelectTrigger>
                        <SelectContent>
                          {semovientes.map((semoviente) => (
                            <SelectItem key={semoviente.id} value={semoviente.id.toString()}>
                              {semoviente.tipo_animal} - {semoviente.color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombreAbogado">Nombre del Abogado (Director de Justicia)</Label>
                    <Input
                      id="nombreAbogado"
                      value={formData.nombreAbogado}
                      onChange={(e) => handleInputChange("nombreAbogado", e.target.value)}
                      placeholder="Lucas Martínez"
                      disabled={editingCarta?.estado === "confirmado"}
                      className="card-content"
                    />
                  </div>

                  {editingCarta && (
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={editingCarta.estado === "confirmado" ? "default" : "secondary"}
                          className="text-sm"
                        >
                          {editingCarta.estado === "confirmado" ? (
                            <>
                              <Lock className="h-3 w-3 mr-1 inline" />
                              Confirmado
                            </>
                          ) : (
                            <>
                              <Edit className="h-3 w-3 mr-1 inline" />
                              Borrador
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <Button
                      type="button"
                      onClick={handleConfirmar}
                      disabled={isLoading || formData.estado === "confirmado"}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {formData.estado === "confirmado" ? "Confirmada" : "Confirmar Carta"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleExportPDF}
                      disabled={isLoading || formData.estado !== "confirmado"}
                      className="bg-amber-400 hover:bg-amber-500 text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="regresar-btn"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {!showForm && (
            <Card className="card-principal">
              <CardHeader>
                <CardTitle>Cartas de Venta Generadas</CardTitle>
                <CardDescription>Historial de cartas de venta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartas.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No hay cartas de venta generadas</p>
                    </div>
                  ) : (
                    cartas.map((carta) => (
                      <div
                        key={carta.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors card-content"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                Carta #{carta.numeroRegistro}
                              </h3>
                              <Badge
                                variant={carta.estado === "confirmado" ? "default" : "secondary"}
                              >
                                {carta.estado === "confirmado" ? (
                                  <>
                                    <Lock className="h-3 w-3 mr-1 inline" />
                                    Confirmado
                                  </>
                                ) : (
                                  <>
                                    <Edit className="h-3 w-3 mr-1 inline" />
                                    Borrador
                                  </>
                                )}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>
                                  {getPersonaById(carta.vendedorId)?.p_nombre || "Vendedor"} →{" "}
                                  {getPersonaById(carta.compradorId)?.p_nombre || "Comprador"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{carta.fechaSolicitud}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">Lps. {carta.precio}</span>
                              </div>
                              {carta.fechaRegistro && (
                                <div className="flex items-center space-x-2 col-span-1 md:col-span-3 lg:col-span-1">
                                  <Lock className="h-4 w-4" />
                                  <span className="text-xs">Registrado: {carta.fechaRegistro}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {carta.estado === "confirmado" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVerDocumento(carta)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Re-exportar documento"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                            {carta.estado === "borrador" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(carta)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
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
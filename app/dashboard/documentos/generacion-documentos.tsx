"use client"
import "./generacion-documentos.css"
import { es } from 'date-fns/locale'
import { jsPDF } from "jspdf"
import "./fonts/Montserrat-Bold-normal.js"
import "./fonts/Roboto-Light-normal.js"
import type React from "react"
import { useState, useEffect } from "react"
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

interface Cliente {
  id: number
  nombre: string
  apellidos: string
  DNI: string
  telefono: string
  direccion: string
  RTN?: string
  Género?: string
  tipoCliente: string
  empresa?: string
}

interface Semoviente {
  id: number
  nombre: string
  color: string
  Tipo_de_semoviente: string
  Venteado: string
  observaciones: string
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
  const [selectedVendedor, setSelectedVendedor] = useState<Cliente | null>(null)
  const [selectedComprador, setSelectedComprador] = useState<Cliente | null>(null)
  const [selectedSemoviente, setSelectedSemoviente] = useState<Semoviente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cartaSeleccionada, setCartaSeleccionada] = useState<CartaVentaGanado | null>(null)

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    window.location.href = "/login"
  }

  // Datos simulados de clientes
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nombre: "Juan",
      apellidos: "Pérez",
      DNI: "0318-2000-54321",
      telefono: "+504 9990-0000",
      direccion: "Calle Mayor 123",
      tipoCliente: "vendedor",
    },
    {
      id: 2,
      nombre: "María",
      apellidos: "González",
      DNI: "0318-1990-00000",
      telefono: "+504 9999-0000",
      direccion: "Avenida Principal 456",
      tipoCliente: "comprador",
    },
    {
      id: 3,
      nombre: "Carlos",
      apellidos: "López",
      DNI: "0318-1985-11111",
      telefono: "+504 8888-0000",
      direccion: "Barrio El Centro",
      tipoCliente: "ambos",
    },
  ])

  // Datos simulados de semovientes
  const [semovientes, setSemovientes] = useState<Semoviente[]>([
    {
      id: 1,
      nombre: "Thunder",
      color: "Castaño",
      Tipo_de_semoviente: "Toro",
      Venteado: "Sí",
      observaciones: "Animal de competición",
    },
    {
      id: 2,
      nombre: "Bella",
      color: "Blanco y Negro",
      Tipo_de_semoviente: "Vaca",
      Venteado: "No",
      observaciones: "Excelente productora de leche",
    },
  ])

  const [formData, setFormData] = useState({
    vendedorId: null as number | null,
    compradorId: null as number | null,
    semovienteId: null as number | null,
    precio: "",
    fechaSolicitud: format(new Date(), "yyyy-MM-dd"),
    fechaRegistro: null as string | null,
    observaciones: "",
    estado: "borrador" as "borrador" | "confirmado",
    nombreAbogado: "Carlos Suazo",
  })

  const [cartas, setCartas] = useState<CartaVentaGanado[]>([])

  const generarNumeroRegistro = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const lastId = cartas.filter(c => c.folio === month && c.tomo === year).length
    const nextRegistro = lastId + 1
    return {
      numeroRegistro: `${year}${String(month).padStart(2, "0")}${String(nextRegistro).padStart(3, "0")}`,
      tomo: year,
      folio: month,
      registro: nextRegistro,
    }
  }

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
      const vendedor = clientes.find((c) => c.id === editingCarta.vendedorId) || null
      const comprador = clientes.find((c) => c.id === editingCarta.compradorId) || null
      const semoviente = semovientes.find((s) => s.id === editingCarta.semovienteId) || null
      setSelectedVendedor(vendedor)
      setSelectedComprador(comprador)
      setSelectedSemoviente(semoviente)
    } else {
      resetForm()
    }
  }, [editingCarta, clientes, semovientes])

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
      nombreAbogado: "Carlos Suazo",
    })
    setSelectedVendedor(null)
    setSelectedComprador(null)
    setSelectedSemoviente(null)
    setShowForm(false)
    setEditingCarta(null)
    setError("")
    setSuccess("")
  }

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
    const vendedor = getClienteById(formData.vendedorId)
    const comprador = getClienteById(formData.compradorId)
    const dniRegex = /^\d{4}-\d{4}-\d{5}$/
    if (vendedor && !dniRegex.test(vendedor.DNI)) {
      setError("El DNI del vendedor no tiene un formato válido (0000-0000-00000)")
      setIsLoading(false)
      return
    }
    if (comprador && !dniRegex.test(comprador.DNI)) {
      setError("El DNI del comprador no tiene un formato válido (0000-0000-00000)")
      setIsLoading(false)
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      let cartaActualizada: CartaVentaGanado
      if (editingCarta && editingCarta.estado === "borrador") {
        cartaActualizada = {
          ...editingCarta,
          vendedorId: formData.vendedorId,
          compradorId: formData.compradorId,
          semovienteId: formData.semovienteId,
          precio: formData.precio,
          fechaSolicitud: formData.fechaSolicitud,
          observaciones: formData.observaciones,
          nombreAbogado: formData.nombreAbogado,
        }
      } else {
        const { numeroRegistro, tomo, folio, registro } = generarNumeroRegistro()
        cartaActualizada = {
          id: Date.now().toString(),
          numeroRegistro,
          tomo,
          folio,
          registro,
          vendedorId: formData.vendedorId,
          compradorId: formData.compradorId,
          semovienteId: formData.semovienteId,
          precio: formData.precio,
          fechaSolicitud: formData.fechaSolicitud,
          fechaRegistro: formData.estado === "confirmado" ? format(new Date(), "yyyy-MM-dd HH:mm:ss") : null,
          estado: formData.estado,
          observaciones: formData.observaciones,
          nombreAbogado: formData.nombreAbogado,
        }
      }
      if (editingCarta) {
        setCartas((prev) =>
          prev.map((carta) => (carta.id === editingCarta.id ? cartaActualizada : carta))
        )
        setSuccess("Carta actualizada correctamente")
      } else {
        setCartas((prev) => [cartaActualizada, ...prev])
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
      const now = new Date()
      const { numeroRegistro, tomo, folio, registro } = generarNumeroRegistro()
      const cartaConfirmada: CartaVentaGanado = {
        id: editingCarta?.id || Date.now().toString(),
        numeroRegistro: editingCarta?.numeroRegistro || numeroRegistro,
        tomo: editingCarta?.tomo || tomo,
        folio: editingCarta?.folio || folio,
        registro: editingCarta?.registro || registro,
        vendedorId: formData.vendedorId,
        compradorId: formData.compradorId,
        semovienteId: formData.semovienteId,
        precio: formData.precio,
        fechaSolicitud: formData.fechaSolicitud,
        fechaRegistro: format(now, "yyyy-MM-dd HH:mm:ss"),
        estado: "confirmado",
        observaciones: formData.observaciones,
        nombreAbogado: formData.nombreAbogado,
      }
      if (editingCarta) {
        setCartas((prev) =>
          prev.map((carta) => (carta.id === editingCarta.id ? cartaConfirmada : carta))
        )
      } else {
        setCartas((prev) => [cartaConfirmada, ...prev])
      }
      setSuccess("Carta confirmada correctamente")
      setEditingCarta(cartaConfirmada)
      setFormData((prev) => ({ ...prev, estado: "confirmado", fechaRegistro: cartaConfirmada.fechaRegistro }))
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

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta carta?")) {
      setCartas((prev) => prev.filter((carta) => carta.id !== id))
      setSuccess("Carta eliminada correctamente")
      if (editingCarta?.id === id) {
        resetForm()
      }
    }
  }

  const handlePrint = (carta: CartaVentaGanado) => {
    if (carta.estado !== "confirmado") {
      alert("Solo se pueden imprimir cartas confirmadas")
      return
    }
    alert(`Imprimiendo Carta de Venta #${carta.numeroRegistro}`)
    console.log("Imprimiendo carta confirmada:", carta)
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
      alert("Complete todos los campos antes de exportar");
      return;
    }
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    const logoPath = "/logo1.png";
    const selloPath = "/logo1.png";
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
            img.src = src;
        });
    };
    const addParagraph = (
        doc,
        text,
        x,
        y,
        maxWidth,
        lineHeight,
        highlightWords = []
    ) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
            let currentX = x;
            const words = line.split(" ");
            words.forEach((word) => {
                const cleanWord = word.replace(/[.,;:()\-]/g, "").toUpperCase();
                const isBold = highlightWords.some((hw) => {
                    const cleanHw = hw.replace(/[.,;:()\-]/g, "").toUpperCase();
                    return cleanWord === cleanHw;
                });
                if (isBold) {
                    doc.setFont("Montserrat-Bold", "normal");
                } else {
                    doc.setFont("Roboto-Light", "normal");
                }
                doc.text(word + " ", currentX, y);
                currentX += doc.getTextWidth(word + " ");
            });
            y += lineHeight;
        });
        return y;
    };

    Promise.all([loadImage(logoPath), loadImage(selloPath)])
        .then(([logoImg, selloImg]) => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 10;
            const contentWidth = pageWidth - margin * 2;
            let y = 20;
            const lineHeight = 5.8;
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            doc.rect(margin - 2, 8, contentWidth + 4, 270);
            doc.addImage(logoImg, "PNG", margin, 10, 25, 25);
            doc.addImage(selloImg, "PNG", pageWidth - margin - 25, 10, 25, 25);
            doc.setFont("Montserrat-Bold", "normal");
            doc.setFontSize(12);
            doc.text("Municipalidad de la Villa de San Antonio", pageWidth / 2, y, { align: "center" });
            y += 6;
            doc.setFontSize(11);
            doc.text("Departamento de Comayagua", pageWidth / 2, y, { align: "center" });
            y += 6;
            doc.text("Tel: 2784-1217", pageWidth / 2, y, { align: "center" });
            y += 12;
            doc.setFontSize(14);
            doc.text("CARTA DE VENTA", pageWidth / 2, y, { align: "center" });
            y += 10;
            doc.setFont("Roboto-Light", "normal");
            doc.setFontSize(10);
            const maxWidth = contentWidth - 10;
            const montoEnLetras = numeroALetras(formData.precio).toUpperCase().trim();
            const precioNumerico = Number(formData.precio).toFixed(2);
            const highlightWords = [
                ...selectedVendedor.nombre.split(" ").map(word => word.toUpperCase()),
                ...selectedVendedor.apellidos.split(" ").map(word => word.toUpperCase()),
                ...selectedComprador.nombre.split(" ").map(word => word.toUpperCase()),
                ...selectedComprador.apellidos.split(" ").map(word => word.toUpperCase()),
                selectedVendedor.DNI.replace(/[^0-9A-Z]/g, "").toUpperCase(),
                selectedComprador.DNI.replace(/[^0-9A-Z]/g, "").toUpperCase(),
                selectedVendedor.telefono.replace(/[^0-9]/g, "").toUpperCase(), 
                ...montoEnLetras.split(" "),
            ].filter(word => word !== "Y"); 
            const textoVendedor = `El señor(a) ${selectedVendedor.nombre} ${selectedVendedor.apellidos}, hondureño(a), mayor de edad, identificado(a) con DNI número ${selectedVendedor.DNI}, con domicilio en ${selectedVendedor.direccion} con teléfono ${selectedVendedor.telefono}, en pleno uso de sus facultades, declara la venta del semoviente descrito en este documento.`;
            const textoComprador = `El comprador(a) ${selectedComprador.nombre} ${selectedComprador.apellidos}, hondureño(a), mayor de edad, identificado(a) con DNI número ${selectedComprador.DNI}, acepta la adquisición del semoviente en las condiciones aquí establecidas.`;
            const textoPrecio = `El semoviente vendido es de color ${selectedSemoviente.color}, herrado y marcado con el fierro que se muestra en el reverso. Se entrega en buen estado, por un valor de ${montoEnLetras}, suma que el vendedor declara haber recibido a satisfacción.`;
            const textoFierro = `El animal es de raza criolla y se encuentra identificado con la marca de fierro registrada en el reverso del presente documento.`;
            const notaFinal = `Esta carta de venta es válida únicamente en su versión original. Cualquier alteración o modificación la invalida de inmediato.`;
            const fechaEsp = format(new Date(formData.fechaSolicitud), "d 'de' MMMM 'del' yyyy", {
                locale: es,
            });
            const textoFecha = `Firmado en la ciudad de la Villa de San Antonio, Comayagua, a los ${fechaEsp}.`;
            y = addParagraph(doc, textoVendedor, margin, y, maxWidth, lineHeight, highlightWords);
            y += 1;
            y = addParagraph(doc, textoComprador, margin, y, maxWidth, lineHeight, highlightWords);
            y += 1;
            y = addParagraph(doc, textoPrecio, margin, y, maxWidth, lineHeight, highlightWords);
            y += 1;
            doc.setFont("Montserrat-Bold", "normal");
            y = addParagraph(doc, textoFierro, margin, y, maxWidth, lineHeight, []);
            doc.setFont("Roboto-Light", "normal");
            doc.rect(pageWidth - 60, y - 6, 50, 20);
            y += lineHeight * 3;
            doc.setFontSize(9);
            y = addParagraph(doc, notaFinal, margin, y, maxWidth, lineHeight - 0.5);
            y += lineHeight * 2;
            doc.setFontSize(10);
            y = addParagraph(doc, textoFecha, margin, y, maxWidth, lineHeight);
            y += lineHeight * 2;
            const tableX = pageWidth - margin - 50;
            const tableY = y;
            const boxWidth = 25;
            const boxHeight = 8;
            doc.setFontSize(9);
            doc.setFont("Montserrat-Bold", "normal");
            doc.text("TOMO:", tableX - 20, tableY + 6);
            doc.text("FOLIO:", tableX - 20, tableY + boxHeight + 6);
            doc.text("REGISTRO:", tableX - 20, tableY + boxHeight * 2 + 6);
            doc.setFont("Roboto-Light", "normal");
            const tomo = new Date().getFullYear();
            const folio = new Date().getMonth() + 1;
            const registro = String(
                cartas.filter((c) => c.folio === folio && c.tomo === tomo).length + 1
            ).padStart(3, "0");
            doc.text(String(tomo), tableX + 7, tableY + 6);
            doc.text(String(folio), tableX + 7, tableY + boxHeight + 6);
            doc.text(registro, tableX + 7, tableY + boxHeight * 2 + 6);
            doc.rect(tableX, tableY, boxWidth, boxHeight);
            doc.rect(tableX, tableY + boxHeight, boxWidth, boxHeight);
            doc.rect(tableX, tableY + boxHeight * 2, boxWidth, boxHeight);
            y += boxHeight * 3 + 10;
            doc.setFont("Montserrat-Bold", "normal");
            doc.line(15, y, 90, y);
            y += 5;
            doc.text("FIRMA DEL VENDEDOR", 15, y);
            y += 15;
            doc.line(15, y, 90, y);
            y += 5;
            doc.text("SELLO Y FIRMA ABOG. " + formData.nombreAbogado.toUpperCase(), 15, y);
            y += 10;
            doc.text("DIRECTOR DE JUSTICIA MUNICIPAL", 15, y);
            const fileName = `CartaVenta_${editingCarta?.numeroRegistro || generarNumeroRegistro().numeroRegistro}.pdf`;
            doc.save(fileName);
        })
        .catch((err) => {
            alert("Error al cargar imágenes para el PDF: " + err.message);
            console.error(err);
        });
  }
  const handleReExportPDF = (carta: CartaVentaGanado) => {
    if (carta.estado !== "confirmado") {
      alert("Solo se pueden volver a exportar cartas confirmadas");
      return;
    }

    const vendedor = getClienteById(carta.vendedorId);
    const comprador = getClienteById(carta.compradorId);
    const semoviente = getSemovienteById(carta.semovienteId);

    if (!vendedor || !comprador || !semoviente) {
      alert("No se pudieron cargar los datos del documento para re-exportar.");
      return;
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    const logoPath = "/logo1.png";
    const selloPath = "/logo1.png";
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
            img.src = src;
        });
    };
    const addParagraph = (
        doc,
        text,
        x,
        y,
        maxWidth,
        lineHeight,
        highlightWords = []
    ) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
            let currentX = x;
            const words = line.split(" ");
            words.forEach((word) => {
                const cleanWord = word.replace(/[.,;:()\-]/g, "").toUpperCase();
                const isBold = highlightWords.some((hw) => {
                    const cleanHw = hw.replace(/[.,;:()\-]/g, "").toUpperCase();
                    return cleanWord === cleanHw;
                });
                if (isBold) {
                    doc.setFont("Montserrat-Bold", "normal");
                } else {
                    doc.setFont("Roboto-Light", "normal");
                }
                doc.text(word + " ", currentX, y);
                currentX += doc.getTextWidth(word + " ");
            });
            y += lineHeight;
        });
        return y;
    };

    Promise.all([loadImage(logoPath), loadImage(selloPath)])
        .then(([logoImg, selloImg]) => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 10;
            const contentWidth = pageWidth - margin * 2;
            let y = 20;
            const lineHeight = 5.8;
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            doc.rect(margin - 2, 8, contentWidth + 4, 270);
            doc.addImage(logoImg, "PNG", margin, 10, 25, 25);
            doc.addImage(selloImg, "PNG", pageWidth - margin - 25, 10, 25, 25);
            doc.setFont("Montserrat-Bold", "normal");
            doc.setFontSize(12);
            doc.text("Municipalidad de la Villa de San Antonio", pageWidth / 2, y, { align: "center" });
            y += 6;
            doc.setFontSize(11);
            doc.text("Departamento de Comayagua", pageWidth / 2, y, { align: "center" });
            y += 6;
            doc.text("Tel: 2784-1217", pageWidth / 2, y, { align: "center" });
            y += 12;
            doc.setFontSize(14);
            doc.text("CARTA DE VENTA", pageWidth / 2, y, { align: "center" });
            y += 10;
            doc.setFont("Roboto-Light", "normal");
            doc.setFontSize(10);
            const maxWidth = contentWidth - 10;
            const montoEnLetras = numeroALetras(carta.precio).toUpperCase().trim();
            const highlightWords = [
                ...vendedor.nombre.split(" ").map(word => word.toUpperCase()),
                ...vendedor.apellidos.split(" ").map(word => word.toUpperCase()),
                ...comprador.nombre.split(" ").map(word => word.toUpperCase()),
                ...comprador.apellidos.split(" ").map(word => word.toUpperCase()),
                vendedor.DNI.replace(/[^0-9A-Z]/g, "").toUpperCase(),
                comprador.DNI.replace(/[^0-9A-Z]/g, "").toUpperCase(),
                vendedor.telefono.replace(/[^0-9]/g, "").toUpperCase(),
                ...montoEnLetras.split(" "),
            ].filter(word => word !== "Y");

            const textoVendedor = `El señor(a) ${vendedor.nombre} ${vendedor.apellidos}, hondureño(a), mayor de edad, identificado(a) con DNI número ${vendedor.DNI}, con domicilio en ${vendedor.direccion} con teléfono ${vendedor.telefono}, en pleno uso de sus facultades, declara la venta del semoviente descrito en este documento.`;
            const textoComprador = `El comprador(a) ${comprador.nombre} ${comprador.apellidos}, hondureño(a), mayor de edad, identificado(a) con DNI número ${comprador.DNI}, acepta la adquisición del semoviente en las condiciones aquí establecidas.`;
            const textoPrecio = `El semoviente vendido es de color ${semoviente.color}, herrado y marcado con el fierro que se muestra en el reverso. Se entrega en buen estado, por un valor de ${montoEnLetras}, suma que el vendedor declara haber recibido a satisfacción.`;
            const textoFierro = `El animal es de raza criolla y se encuentra identificado con la marca de fierro registrada en el reverso del presente documento.`;
            const notaFinal = `Esta carta de venta es válida únicamente en su versión original. Cualquier alteración o modificación la invalida de inmediato.`;
            const fechaEsp = format(new Date(carta.fechaSolicitud), "d 'de' MMMM 'del' yyyy", {
                locale: es,
            });
            const textoFecha = `Firmado en la ciudad de la Villa de San Antonio, Comayagua, a los ${fechaEsp}.`;

            y = addParagraph(doc, textoVendedor, margin, y, maxWidth, lineHeight, highlightWords);
            y += 1;
            y = addParagraph(doc, textoComprador, margin, y, maxWidth, lineHeight, highlightWords);
            y += 1;
            y = addParagraph(doc, textoPrecio, margin, y, maxWidth, lineHeight, highlightWords);
            y += 1;
            doc.setFont("Montserrat-Bold", "normal");
            y = addParagraph(doc, textoFierro, margin, y, maxWidth, lineHeight, []);
            doc.setFont("Roboto-Light", "normal");
            doc.rect(pageWidth - 60, y - 6, 50, 20);
            y += lineHeight * 3;
            doc.setFontSize(9);
            y = addParagraph(doc, notaFinal, margin, y, maxWidth, lineHeight - 0.5);
            y += lineHeight * 2;
            doc.setFontSize(10);
            y = addParagraph(doc, textoFecha, margin, y, maxWidth, lineHeight);
            y += lineHeight * 2;
            const tableX = pageWidth - margin - 50;
            const tableY = y;
            const boxWidth = 25;
            const boxHeight = 8;
            doc.setFontSize(9);
            doc.setFont("Montserrat-Bold", "normal");
            doc.text("TOMO:", tableX - 20, tableY + 6);
            doc.text("FOLIO:", tableX - 20, tableY + boxHeight + 6);
            doc.text("REGISTRO:", tableX - 20, tableY + boxHeight * 2 + 6);
            doc.setFont("Roboto-Light", "normal");
            const tomo = carta.tomo;
            const folio = carta.folio;
            const registro = String(carta.registro).padStart(3, "0");
            doc.text(String(tomo), tableX + 7, tableY + 6);
            doc.text(String(folio), tableX + 7, tableY + boxHeight + 6);
            doc.text(registro, tableX + 7, tableY + boxHeight * 2 + 6);
            doc.rect(tableX, tableY, boxWidth, boxHeight);
            doc.rect(tableX, tableY + boxHeight, boxWidth, boxHeight);
            doc.rect(tableX, tableY + boxHeight * 2, boxWidth, boxHeight);
            y += boxHeight * 3 + 10;
            doc.setFont("Montserrat-Bold", "normal");
            doc.line(15, y, 90, y);
            y += 5;
            doc.text("FIRMA DEL VENDEDOR", 15, y);
            y += 15;
            doc.line(15, y, 90, y);
            y += 5;
            doc.text("SELLO Y FIRMA ABOG. " + carta.nombreAbogado.toUpperCase(), 15, y);
            y += 10;
            doc.text("DIRECTOR DE JUSTICIA MUNICIPAL", 15, y);

            const fileName = `CartaVenta_${carta.numeroRegistro}.pdf`;
            doc.save(fileName);
        })
        .catch((err) => {
            alert("Error al cargar imágenes para el PDF: " + err.message);
            console.error(err);
        });
  };

  const handleVerDocumento = (carta: CartaVentaGanado) => {
    handleReExportPDF(carta);
  };

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.DNI.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBack = () => {
    window.location.href = "/dashboard"
  }

  const getClienteById = (id: number | null): Cliente | null => {
    if (!id) return null
    return clientes.find((c) => c.id === id) || null
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
                            <FileText className="h-6 w-6 text-primary" />
                            <span>Carta de Ventas</span>
                          </h1>
                          <p className="parrafo text-muted-foreground">
                            Genere y gestione cartas de ventas
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => setShowForm(true)} disabled={showForm} className="nuevo-btn">
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
                      value={editingCarta ? editingCarta.numeroRegistro : generarNumeroRegistro().numeroRegistro}
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
                          {filteredClientes
                            .filter((c) => ["vendedor", "ambos"].includes(c.tipoCliente))
                            .map((cliente) => (
                              <div
                                key={cliente.id}
                                className={`p-3 cursor-pointer hover:bg-muted/50 ${
                                  selectedVendedor?.id === cliente.id ? "bg-accent" : ""
                                }`}
                                onClick={() => {
                                  setSelectedVendedor(cliente)
                                  setFormData((prev) => ({ ...prev, vendedorId: cliente.id }))
                                  setSearchTerm("")
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {cliente.nombre} {cliente.apellidos}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{cliente.DNI}</p>
                                  </div>
                                  <Badge variant="secondary">Vendedor</Badge>
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
                                {selectedVendedor.nombre} {selectedVendedor.apellidos}
                              </p>
                              <p className="text-sm text-muted-foreground">{selectedVendedor.DNI}</p>
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
                          {filteredClientes
                            .filter((c) => ["comprador", "ambos"].includes(c.tipoCliente))
                            .map((cliente) => (
                              <div
                                key={cliente.id}
                                className={`p-3 cursor-pointer hover:bg-muted/50 ${
                                  selectedComprador?.id === cliente.id ? "bg-accent" : ""
                                }`}
                                onClick={() => {
                                  setSelectedComprador(cliente)
                                  setFormData((prev) => ({ ...prev, compradorId: cliente.id }))
                                  setSearchTerm("")
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {cliente.nombre} {cliente.apellidos}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{cliente.DNI}</p>
                                  </div>
                                  <Badge variant="secondary">Comprador</Badge>
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
                                {selectedComprador.nombre} {selectedComprador.apellidos}
                              </p>
                              <p className="text-sm text-muted-foreground">{selectedComprador.DNI}</p>
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
                              {semoviente.nombre} - {semoviente.Tipo_de_semoviente} ({semoviente.color})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => handleInputChange("observaciones", e.target.value)}
                      placeholder="Notas adicionales sobre la transacción..."
                      rows={3}
                      disabled={editingCarta?.estado === "confirmado"}
                      className="card-content"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreAbogado">Nombre del Abogado (Director de Justicia)</Label>
                    <Input
                      id="nombreAbogado"
                      value={formData.nombreAbogado}
                      onChange={(e) => handleInputChange("nombreAbogado", e.target.value)}
                      placeholder="Carlos Suazo"
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
                                  {getClienteById(carta.vendedorId)?.nombre || "Vendedor"} →{" "}
                                  {getClienteById(carta.compradorId)?.nombre || "Comprador"}
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
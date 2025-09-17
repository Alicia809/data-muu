"use client"
import "./page.css"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MdPeople,
  MdDescription,
  MdAdd,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md"
import { PiCowDuotone } from "react-icons/pi"
import { TbHorseshoe } from "react-icons/tb"
import { BiDirections } from "react-icons/bi"
// Importamos Supabase y useRouter
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


const supabase = createClientComponentClient();

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userName, setUserName] = useState("")

  const router = useRouter()

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

  const handleLogout = async () => {
    // Cerrar sesión en Supabase
    await supabase.auth.signOut()
    // Redirigir a login
    router.push("/login")
  }

  const navigateToClients = () => {
    window.location.href = "/dashboard/clientes"
  }

  const navigateToDocuments = () => {
    window.location.href = "/dashboard/documentos"
  }

  const navigateToAnimals = () => {
    window.location.href = "/dashboard/animales"
  }

  const navigateToHorseshoes = () => {
    window.location.href = "/dashboard/herraduras"
  }

  interface Totales {
    contribuyentes: number | null
    semovientes: number | null
    fierros: number | null
    cartasVenta: number | null
  }
    
  interface Ultimos {
    ultimoCliente: { p_nombre: string; s_nombre: string; p_apellido: string; s_apellido: string } | null
    ultimoDocumento: { correlativo: number; fecha_transaccion: Date} | null
  }

  const [totales, setTotales] = useState<Totales>({
    contribuyentes: null,
    semovientes: null,
    fierros: null,
    cartasVenta: null
  })

  const [ultimos, setUltimos] = useState<Ultimos>({
    ultimoCliente: null,
    ultimoDocumento: null,
  })

  useEffect(() => {
    const fetchDatos = async () => {
      const res = await fetch('/api')
      const data = await res.json()
      console.log('API response:', data)

      setTotales({
        contribuyentes: data.contribuyentes,
        semovientes: data.semovientes,
        fierros: data.fierros,
        cartasVenta: data.cartasVenta
      })

      setUltimos({
        ultimoCliente: data.ultimoCliente ?? null,
        ultimoDocumento: data.ultimoDocumento ?? null
      })
    }

    fetchDatos()
  }, [])



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              {sidebarOpen ? <MdClose className="h-5 w-5" /> : <MdMenu className="h-5 w-5" />}
            </Button>
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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 sidebar`}
        >
          <div className="flex flex-col h-full pt-2 relative"> {/* pt-20 para separar del top */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Menú Principal
                  </h2>
                </div>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start bg-accent text-accent-foreground boton-panel parrafo">
                    <MdBarChart className="h-4 w-4 mr-3" />
                    Panel principal
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel parrafo" onClick={navigateToClients}>
                    <MdPeople className="h-4 w-4 mr-3" />
                    Gestión de Contribuyentes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel parrafo" onClick={navigateToAnimals}>
                    <PiCowDuotone className="h-4 w-4 mr-3" />
                    Registro de Semovientes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel parrafo" onClick={navigateToHorseshoes}>
                    <TbHorseshoe className="h-4 w-4 mr-3" />
                    Registro de Fierros
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel parrafo" onClick={navigateToDocuments}>
                    <MdDescription className="h-4 w-4 mr-3" />
                    Generar Cartas de Venta
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Herramientas
                </h2>
                <div className="space-y-1">
                  {/* <Button variant="ghost" className="w-full justify-start boton-panel parrafo">
                    <MdSettings className="h-4 w-4 mr-3" />
                    Configuración
                  </Button> */}
                  <Button variant="ghost" className="w-full justify-start boton-panel parrafo">
                    <BiDirections className="h-4 w-4 mr-3" />
                    Manual de uso
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </aside>


        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-white z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Encabezado del dashboard */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Panel de Control</h1>
              <p className="text-muted-foreground parrafo">
                Gestione la información de los contribuyentes, semovientes, fierros y genere documentos de manera eficiente para
                llevar un registro de las transacciones y respaldar sus operaciones.
              </p>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium parrafo2">Contribuyentes Registrados</CardTitle>
                  <MdPeople className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold parrafo2">
                    {totales?.contribuyentes != null
                      ? totales.contribuyentes.toLocaleString()
                      : <p className="text-muted-foreground parrafo">Cargando...</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium parrafo2">Semovientes Registrados</CardTitle>
                  <PiCowDuotone className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold parrafo2">
                    {totales.semovientes !== null ? totales.semovientes.toLocaleString() : <p className="text-muted-foreground parrafo">Cargando...</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium parrafo2">Fierros Registradas</CardTitle>
                  <TbHorseshoe className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold parrafo2">
                    {totales.fierros !== null ? totales.fierros.toLocaleString() : <p className="text-muted-foreground parrafo">Cargando...</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium parrafo2">Cartas de Venta Generadas</CardTitle>
                  <MdDescription className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold parrafo2">
                    {totales.cartasVenta !== null ? totales.cartasVenta.toLocaleString() : <p className="text-muted-foreground parrafo">Cargando...</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdPeople className="h-5 w-5 text-primary icono-dashboard" />
                    <span className="parrafo3">Gestión de Contribuyentes</span>
                  </CardTitle>
                  <CardDescription  className="parrafo">Registre nuevos clientes y gestione la información existente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToClients} className="w-full dashboard-btn parrafo">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Contribuyente
                    </Button>
                    <Button onClick={navigateToClients}  variant="outline" className="w-full bg-transparent dashboard-btn-1 parrafo">
                      <MdPeople className="h-4 w-4 mr-2" />
                      Ver Lista de Contribuyentes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PiCowDuotone className="h-5 w-5 text-primary icono-dashboard" />
                    <span className="parrafo3">Registro de Semovientes</span>
                  </CardTitle>
                  <CardDescription className="parrafo">Registre semovientes con imágenes y características detalladas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToAnimals} className="w-full dashboard-btn parrafo">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Semoviente
                    </Button>
                    <Button onClick={navigateToAnimals} variant="outline" className="w-full bg-transparent dashboard-btn-1 parrafo">
                      <PiCowDuotone className="h-4 w-4 mr-2" />
                      Ver Lista de Semovientes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TbHorseshoe className="h-5 w-5 text-primary icono-dashboard" />
                    <span className="parrafo3">Registro de Fierros</span>
                  </CardTitle>
                  <CardDescription className="parrafo3">Registre fierros con imágenes y datos del propietario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToHorseshoes} className="w-full dashboard-btn parrafo">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Fierro
                    </Button>
                    <Button onClick={navigateToHorseshoes} variant="outline" className="w-full bg-transparent dashboard-btn-1 parrafo">
                      <TbHorseshoe className="h-4 w-4 mr-2" />
                      Ver Lista de Fierros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdDescription className="h-5 w-5 text-primary icono-dashboard" />
                    <span className="parrafo3">Generación de Documentos</span>
                  </CardTitle>
                  <CardDescription className="parrafo3">Cree y genere cartas de venta para impresión</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToDocuments} className="w-full dashboard-btn parrafo">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Crear Nuevo Documento
                    </Button>
                    <Button onClick={navigateToDocuments} variant="outline" className="w-full bg-transparent dashboard-btn-1 parrafo">
                      <MdDescription className="h-4 w-4 mr-2" />
                      Ver Documentos Recientes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actividad reciente */}
            <Card className="card-principal">
              <CardHeader>
                <CardTitle className="titulo">Actividad Reciente</CardTitle>
                <CardDescription className="parrafo3">Últimas acciones realizadas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-[#FBC02D] rounded-full"></div>
                    <div className="text-sm font-medium">
                      <p className="parrafo3">
                        Último cliente registrado:{' '}
                        {ultimos.ultimoCliente
                          ? `${ultimos.ultimoCliente.p_nombre} ${ultimos.ultimoCliente.s_nombre ?? ''} ${ultimos.ultimoCliente.p_apellido} ${ultimos.ultimoCliente.s_apellido ?? ''}`.trim()
                          : 'Cargando...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-[#FBC02D] rounded-full"></div>
                    <div className="flex-1">
                      <p className="parrafo3">
                        Último documento generado:{' '}
                        {ultimos.ultimoDocumento
                          ? `#${ultimos.ultimoDocumento.correlativo}`
                          : 'Cargando...'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

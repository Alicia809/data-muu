"use client"
import "./page.css"
import { useState } from "react"
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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    // Aquí conectarías con tu API de logout
    console.log("Cerrando sesión...")
    window.location.href = "/login"
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
            <span className="text-sm text-muted-foreground hidden sm:block">Bienvenido, Usuario</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="logout-button">
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
          } fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 sidebar`}
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
                  <Button variant="ghost" className="w-full justify-start bg-accent text-accent-foreground boton-panel">
                    <MdBarChart className="h-4 w-4 mr-3" />
                    Panel principal
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel" onClick={navigateToClients}>
                    <MdPeople className="h-4 w-4 mr-3" />
                    Gestión de Contribuyentes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel" onClick={navigateToAnimals}>
                    <PiCowDuotone className="h-4 w-4 mr-3" />
                    Registro de Semovientes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel" onClick={navigateToHorseshoes}>
                    <TbHorseshoe className="h-4 w-4 mr-3" />
                    Registro de Fierros
                  </Button>
                  <Button variant="ghost" className="w-full justify-start boton-panel" onClick={navigateToDocuments}>
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
                  <Button variant="ghost" className="w-full justify-start boton-panel">
                    <MdSettings className="h-4 w-4 mr-3" />
                    Configuración
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </aside>


        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Encabezado del dashboard */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Panel de Control</h1>
              <p className="text-muted-foreground">
                Gestione la información de los contribuyentes, semovientes, fierros y genere documentos de manera eficiente para
                llevar un registro de las transacciones y respaldar sus operaciones.
              </p>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contribuyentes</CardTitle>
                  <MdPeople className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Semovientes Registrados</CardTitle>
                  <PiCowDuotone className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">567</div>
                  <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fierros Registradas</CardTitle>
                  <TbHorseshoe className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cartas de Venta Generadas</CardTitle>
                  <MdDescription className="h-4 w-4 text-muted-foreground icono-dashboard" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdPeople className="h-5 w-5 text-primary icono-dashboard" />
                    <span>Gestión de Contribuyentes</span>
                  </CardTitle>
                  <CardDescription>Registre nuevos clientes y gestione la información existente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToClients} className="w-full dashboard-btn">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Contribuyente
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent dashboard-btn-1">
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
                    <span>Registro de Semovientes</span>
                  </CardTitle>
                  <CardDescription>Registre semovientes con imágenes y características detalladas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToAnimals} className="w-full dashboard-btn">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Semoviente
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent dashboard-btn-1">
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
                    <span>Registro de Fierros</span>
                  </CardTitle>
                  <CardDescription>Registre fierros con imágenes y datos del propietario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToHorseshoes} className="w-full dashboard-btn">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Fierro
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent dashboard-btn-1">
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
                    <span>Generación de Documentos</span>
                  </CardTitle>
                  <CardDescription>Cree y genere cartas de venta para impresión</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToDocuments} className="w-full dashboard-btn">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Crear Nuevo Documento
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent dashboard-btn-1">
                      <MdDescription className="h-4 w-4 mr-2" />
                      Ver Documentos Recientes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actividad reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cliente registrado: Juan Pérez</p>
                      <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Documento generado: Contrato #1234</p>
                      <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cliente actualizado: María García</p>
                      <p className="text-xs text-muted-foreground">Hace 6 horas</p>
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

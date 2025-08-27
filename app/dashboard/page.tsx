"use client"

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
  MdBusiness,
  MdPersonAdd,
  MdCheckCircle,
  MdPets,
  MdBuild,
} from "react-icons/md"

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
              <MdBusiness className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-semibold">Sistema de Registro</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:block">Bienvenido, Usuario</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
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
          } fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Menú Principal
                </h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start bg-accent text-accent-foreground">
                    <MdBarChart className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={navigateToClients}>
                    <MdPeople className="h-4 w-4 mr-3" />
                    Gestión de Clientes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={navigateToAnimals}>
                    <MdPets className="h-4 w-4 mr-3" />
                    Registro de Animales
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={navigateToHorseshoes}>
                    <MdBuild className="h-4 w-4 mr-3" />
                    Registro de Herraduras
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={navigateToDocuments}>
                    <MdDescription className="h-4 w-4 mr-3" />
                    Generación de Documentos
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Herramientas
                </h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
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
                Gestione sus clientes, animales, herraduras y genere documentos de manera eficiente
              </p>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                  <MdPeople className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Animales Registrados</CardTitle>
                  <MdPets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">567</div>
                  <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Herraduras Registradas</CardTitle>
                  <MdBuild className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documentos Generados</CardTitle>
                  <MdDescription className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdPersonAdd className="h-5 w-5 text-primary" />
                    <span>Gestión de Clientes</span>
                  </CardTitle>
                  <CardDescription>Registre nuevos clientes y gestione la información existente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToClients} className="w-full">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Cliente
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MdPeople className="h-4 w-4 mr-2" />
                      Ver Lista de Clientes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdPets className="h-5 w-5 text-primary" />
                    <span>Registro de Animales</span>
                  </CardTitle>
                  <CardDescription>Registre animales con imágenes y características detalladas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToAnimals} className="w-full">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nuevo Animal
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MdPets className="h-4 w-4 mr-2" />
                      Ver Lista de Animales
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdBuild className="h-5 w-5 text-primary" />
                    <span>Registro de Herraduras</span>
                  </CardTitle>
                  <CardDescription>Registre herraduras con imágenes y datos del propietario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToHorseshoes} className="w-full">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Registrar Nueva Herradura
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MdBuild className="h-4 w-4 mr-2" />
                      Ver Lista de Herraduras
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MdCheckCircle className="h-5 w-5 text-primary" />
                    <span>Generación de Documentos</span>
                  </CardTitle>
                  <CardDescription>Cree y genere documentos personalizados para impresión</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={navigateToDocuments} className="w-full">
                      <MdAdd className="h-4 w-4 mr-2" />
                      Crear Nuevo Documento
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
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

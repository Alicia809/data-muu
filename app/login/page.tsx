"use client"

import "./login.css" 

import type React from "react"
import { useState } from "react"
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MdVisibility, MdVisibilityOff, MdLock, MdEmail, MdBusiness } from "react-icons/md"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Por favor, complete todos los campos")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Por favor, ingrese un email válido")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError("Error al iniciar sesión: Credenciales inválidas")
      } else {
        // Usuario autenticado correctamente
        router.push("/dashboard") // Redirige al dashboard
      }
    } catch (err) {
      console.error(err)
      setError("Error al iniciar sesión. Verifique sus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Imagen de fondo */}
        <div className="login-background"></div>
        <div className="login-overlay"></div>
        {/* Contenido principal */}
        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="inline-flex items-center justify-center">
                <img
                  src="/logo1.png"
                  alt="Logo"
                  className="w-40"
                />
              </div>
              <CardTitle className="text-xl text-center titulo">Iniciar Sesión</CardTitle>
              <CardDescription className="text-center parrafo">
                Ingrese sus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="parrafo">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-sm">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 parrafo"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold text-sm">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 parrafo"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <MdVisibilityOff className="h-4 w-4" /> : <MdVisibility className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" className="text-sm text-primary hover:underline parrafo">
                    ¿Olvidó su contraseña?
                  </button>
                </div>

                <Button type="submit" className="w-full parrafo custom-login-btn"  disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground parrafo">
                  ¿Necesita acceso al sistema?{" "}
                  <button className="text-primary hover:underline">Contacte al administrador</button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground parrafo">
            © 2025 Sistema DataMuu. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

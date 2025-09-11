// middleware.ts (raíz)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // si no hay sesión y se trata de /dashboard* -> redirige a /login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*',
    '/dashboard/clientes/:path*',
    '/dashboard/animales/:path*',
    '/dashboard/herraduras/:path*',
    '/dashboard/documentos/:path*',],
}

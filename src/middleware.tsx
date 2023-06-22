import { NextResponse } from 'next/server'

export function middleware(request, ev) {
    const token = request.cookies.get("auth-token")
    if (token) {
        if (request.url.includes("/login") && !request.redirect == "follow") return NextResponse.redirect(new URL('/', request.url))
    } else {
        if (!request.url.includes("/login")) return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
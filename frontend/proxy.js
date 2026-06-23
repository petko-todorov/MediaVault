import { NextResponse } from 'next/server';

const guestOnlyRoutes = ['/welcome'];
const privateRoutes = ['/', '/search'];

const LOGIN_REDIRECT_URL = '/';
const LOGOUT_REDIRECT_URL = '/welcome';

export function proxy(request) {
    const { pathname } = request.nextUrl;
    const hasToken = request.cookies.has('refresh_token');

    const isGuestRoute = guestOnlyRoutes.some((route) =>
        pathname.startsWith(route),
    );
    const isPrivateRoute = privateRoutes.some((route) =>
        route === '/' ? pathname === '/' : pathname.startsWith(route),
    );

    if (hasToken && isGuestRoute) {
        return NextResponse.redirect(new URL(LOGIN_REDIRECT_URL, request.url));
    }

    if (!hasToken && isPrivateRoute) {
        return NextResponse.redirect(new URL(LOGOUT_REDIRECT_URL, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};

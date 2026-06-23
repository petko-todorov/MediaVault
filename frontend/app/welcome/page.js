'use client';

import { useGoogleLogin } from '@react-oauth/google';

export default function WelcomePage() {
    const login = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:8000/api/auth/google/callback/',
    });

    return (
        <section>
            <h1>Welcome</h1>
            <p>Please login</p>
            <button onClick={() => login()}>Login with Google</button>
        </section>
    );
}

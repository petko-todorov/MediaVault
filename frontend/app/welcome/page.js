'use client';

import { useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';

export default function WelcomePage() {
    const login = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:8000/api/auth/google/callback/',
    });

    return (
        <section className="relative h-screen overflow-hidden">
            <Image
                src="/welcome-background.jpg"
                alt=""
                fill
                priority
                className="object-cover"
            />

            <div className="absolute inset-0 z-10 flex flex-col items-center pt-50">
                <h1 className="text-5xl font-bold text-white">Welcome</h1>

                <p className="mt-4 text-xl text-white">Please login</p>

                <button onClick={() => login()} className="mt-6">
                    <Image
                        src="/google-login.png"
                        alt="Login with Google"
                        width={200}
                        height={50}
                        className="cursor-pointer"
                    />
                </button>
            </div>
        </section>
    );
}

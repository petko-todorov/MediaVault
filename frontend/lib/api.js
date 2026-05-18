export async function loginWithGoogle(code) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback/?code=${code}`,
        {
            method: 'GET',
            credentials: 'include',
        },
    );

    if (!response.ok) throw new Error('Login failed');
    return response.json();
}

export async function logout() {
    await fetch('/api/auth/logout', {
        method: 'POST',
    });

    try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Backend logout failed:', error);
    }
}

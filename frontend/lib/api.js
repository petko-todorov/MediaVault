export async function loginWithGoogle(id_token) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id_token }),
        },
    );

    if (!response.ok) throw new Error('Login failed');
    return response.json();
}

export async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
    });
}

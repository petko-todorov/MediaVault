import axios from 'axios';

export async function loginWithGoogle(code) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback/`,
            {
                params: { code },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error(
            'Google login failed:',
            error.response?.data || error.message,
        );
        throw error;
    }
}

export async function logout() {
    try {
        await axios.post('/api/auth/logout');

        await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`,
            {},
            {
                withCredentials: true,
            },
        );
    } catch (error) {
        console.error(
            'Logout failed:',
            error.response?.data || error.message,
        );
    }
}

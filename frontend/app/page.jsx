'use client';

import { logout } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function Home() {
    const user = useStore((state) => state.user);
    const clearUser = useStore((state) => state.clearUser);
    console.log(user);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();

        router.push('/welcome');
        router.refresh();

        clearUser();
    };

    if (!user) return null;

    return (
        <>
            {user ? (
                <p>Logged in as {user.first_name}</p>
            ) : (
                <p>Not logged in</p>
            )}
            <h1 className="mb-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                fuga iusto natus iste neque quos libero ipsum aperiam quod, eos
                ex quia ratione, vero mollitia saepe deserunt consequatur
                delectus aliquam quis sed, dignissimos similique. Rem eaque quos
                corrupti soluta reprehenderit fugit ratione, hic ad quia
                quibusdam minima quis dolor aspernatur.
            </h1>
            <h1 className="mb-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                fuga iusto natus iste neque quos libero ipsum aperiam quod, eos
                ex quia ratione, vero mollitia saepe deserunt consequatur
                delectus aliquam quis sed, dignissimos similique. Rem eaque quos
                corrupti soluta reprehenderit fugit ratione, hic ad quia
                quibusdam minima quis dolor aspernatur.
            </h1>
            <h1 className="mb-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                fuga iusto natus iste neque quos libero ipsum aperiam quod, eos
                ex quia ratione, vero mollitia saepe deserunt consequatur
                delectus aliquam quis sed, dignissimos similique. Rem eaque quos
                corrupti soluta reprehenderit fugit ratione, hic ad quia
                quibusdam minima quis dolor aspernatur.
            </h1>
            <h1 className="mb-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                fuga iusto natus iste neque quos libero ipsum aperiam quod, eos
                ex quia ratione, vero mollitia saepe deserunt consequatur
                delectus aliquam quis sed, dignissimos similique. Rem eaque quos
                corrupti soluta reprehenderit fugit ratione, hic ad quia
                quibusdam minima quis dolor aspernatur.
            </h1>
            <h1 className="mb-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                fuga iusto natus iste neque quos libero ipsum aperiam quod, eos
                ex quia ratione, vero mollitia saepe deserunt consequatur
                delectus aliquam quis sed, dignissimos similique. Rem eaque quos
                corrupti soluta reprehenderit fugit ratione, hic ad quia
                quibusdam minima quis dolor aspernatur.
            </h1>
            
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}

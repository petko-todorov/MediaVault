import { logout } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { MdOutlineLogout } from "react-icons/md";

export default function Logout() {
    const clearUser = useStore((state) => state.clearUser);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();

        clearUser();

        router.push('/welcome');
        router.refresh();
    };

    return (
        <div className='flex justify-start items-center space-x-2'>
            <MdOutlineLogout size={25} className='text-blue-200'/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

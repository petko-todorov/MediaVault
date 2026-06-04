import { MdLibraryAdd } from "react-icons/md";

export default function AddToLibrary() {
    return (
        <button className="py-3 w-full flex justify-center items-center gap-1 bg-white/10 hover:bg-slate-800 text-gray-300 duration-200 backdrop-blur-md rounded-lg font-semibold">
            <MdLibraryAdd />
            Add to Library
        </button>
    );
}

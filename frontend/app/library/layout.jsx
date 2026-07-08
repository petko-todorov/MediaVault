import LibraryNav from '@/components/library/LibraryNav';

export default function LibraryLayout({ children }) {
    return (
        <section className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">My Library</h1>
            <LibraryNav />
            {children}
        </section>
    );
}

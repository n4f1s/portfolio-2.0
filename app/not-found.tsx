import Link from "next/link";


export const metadata = {
    title: "Page Not Found - Musfiqur Rahman",
    description: "The page you are looking for does not exist.",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oops! The page you are looking for does not exist.</p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#00F050] text-white text-xl font-semibold rounded hover:bg-green-600 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}

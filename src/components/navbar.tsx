import Link from "next/link";

export default async function Navbar(){
    return (
        <div className="fixed z-50 w-screen flex h-[15vh] items-center text-2xl font-semibold bg-blue-100 dark:bg-gray-700 border-b ">
            <Link href="/" className="border-x-2 h-full border-white w-1/3 flex items-center justify-center">
                Home
            </Link>
            <Link href="/problems/" className="border-x-2 h-full border-white w-1/3 flex items-center justify-center">
                Problems
            </Link>
            <Link href="/run-code/" className="border-x-2 h-full border-white w-1/3 flex items-center justify-center">
                Try Code
            </Link>
        </div>
    );
}
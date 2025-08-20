import { cookies } from "next/headers";
import Link from "next/link";

export default async function Navbar() {
    const cookieStore = cookies();
    const resp = await (await fetch(`${process.env.API_BASE_URL}/current-user`,
        {
            headers: {
                Cookie: cookieStore.toString(), // forward client cookies
            },
            cache: "no-store", // avoid caching user-specific data
        }
    )).json();
    console.log(resp);
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
            {
                resp.username ?

                    <div className="border-x-2 h-full border-white w-1/3 flex items-center justify-center">
                        {resp.username}
                    </div>

                    :
                    <>
                        <Link href="/login/" className="border-x-2 h-full border-white w-1/3 flex items-center justify-center">
                            Login
                        </Link>
                        <Link href="/register/" className="border-x-2 h-full border-white w-1/3 flex items-center justify-center">
                            Register
                        </Link>
                    </>
            }

        </div>
    );
}
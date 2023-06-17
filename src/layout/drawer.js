import Link from "next/link";
import { useRouter } from "next/router";

export default function Drawer(params) {
    const router = useRouter()
    if (router.pathname == "/login") return ""
    return <div className="bg-slate-500 w-96 overflow-y-scroll h-screen">
        <div className="flex justify-between z-10 sticky top-0">
            Userinfo
        </div>
        <Link href="/theatres" className="p-2 block">Theatres</Link>
        <Link href="/" className="p-2 block">Movies</Link>
    </div>
}
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { drawerOnclick, drawerState } from "../redux/drawerSlice";
import CloseIcon from '@mui/icons-material/Close';

export default function Drawer(params) {
    const router = useRouter()
    const drawerS = useSelector(drawerState)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(drawerOnclick())
    }, [router.pathname])

    if (router.pathname == "/login") return ""
    return <div className={`bg-slate-200 ${drawerS.open ? "w-screen" : "w-0"} md:w-96 overflow-y-scroll h-screen transition-all relative`}>
        <div className="flex justify-between z-10 sticky top-0">
            Userinfo
        </div>
        <Link href="/theatres" className="p-2 block">Theatres</Link>
        <Link href="/" className="p-2 block">Movies</Link>
        <Link href="/payment" className="p-2 block">Payment</Link>
        <div className="block md:hidden absolute top-0 right-0 p-4" onClick={() => dispatch(drawerOnclick())}><CloseIcon></CloseIcon></div>
    </div>
}
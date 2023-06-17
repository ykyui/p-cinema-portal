import { httpAuthResHelper } from "@/helper";
import { authState, login, logout } from "@/redux/authSlice";
import { Button } from "@mui/material";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



export default function NavBar(params) {
    const router = useRouter()
    if (router.pathname == "/login") return ""
    return <div className="flex justify-between z-10 sticky top-0">
        <div>
            <Link href="/"><Button>HOME</Button></Link>
        </div>
        <div className="flex items-center justify-center md:justify-end overflow-hidden">
            <Button onClick={() => {
                fetch("/api/logout").then(() => router.push("/login"))
            }}>logout</Button>
        </div>
    </div>
}
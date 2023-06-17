import { Button, TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";
import { useState } from "react";
import { useRouter } from "next/router";



export default function LoginPage(params) {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter()

    const doLogin = (e) => {
        e.preventDefault();
        setLoading(true)
        fetch(`api/admin/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
        }).then(async e => {
            if (e.status != 200)
                throw Error(await e.json())
            return e.json()
        }).then((e) => {
            setLoading(false)
            router.push("/")
        }).catch((e) => {
            setLoading(false)
        })
    }

    return <div className="h-screen">
        <div className="flex items-center justify-center h-full">
            <form className="w-60 text-center" onSubmit={doLogin}>
                Login
                <div className="p-2"></div>
                <TextField fullWidth label="Username" name="username" />
                <div className="p-2"></div>
                <TextField type="password" fullWidth label="Password" name="password" />
                <LoadingButton loading={loading} type="submit">Login</LoadingButton >
            </form>
        </div>
    </div>
}
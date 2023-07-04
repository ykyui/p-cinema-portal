import { useEffect, useState } from "react"
import { TicketsTransaction } from "../model/ticketsTransaction"
import { Button } from "@mui/material"


export default function Payment() {
    const [waiting, setWaiting] = useState<TicketsTransaction[]>([])
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const long = async () => {
            for (let i = 1; true; i++) {
                const res = await fetch(`/api/admin/waitingApprovePayment`, {
                    method: 'POST',
                    signal: signal,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "numOfAttempt": i
                    })
                })
                const jsonObj = await res.json()
                setWaiting(jsonObj ?? [])
                console.log(i)
            }
        }
        long()
        return () => {
            controller.abort()
        }
    }, [])

    const approve = (transactionId: number, action: boolean) => {
        fetch(`/api/admin/approvePayment`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transactionId,
                approve: action ? 1 : 0
            })
        })
    }
    return <div>
        {waiting.map((e, i) => {
            const a = "A".charCodeAt(0)
            return <div className={`p-4 grid grid-cols-4 ${i % 2 == 0 ? "" : "bg-gray-200"}`}>
                <div className="col-span-4">{e.transactionId}</div>
                <div className="col-span-1">adult: {e.adult}</div>
                <div className="col-span-1">child: {e.child}</div>
                <div className="col-span-1">student: {e.student}</div>
                <div className="col-span-1">disabled: {e.disabled}</div>
                <div className="col-span-4">bought seat: {e.boughtSeat.map((v, i) => `${v.displayY / 26 >= 1 ? String.fromCharCode(a + v.displayY / 26 - 1) : ""}${String.fromCharCode(a + v.displayY % 26)}${v.displayX}`).join(", ")}</div>
                <Button onClick={() => approve(e.transactionId, true)}>approve</Button>
                <Button onClick={() => approve(e.transactionId, false)}>reject</Button></div>
        })}
    </div>
}
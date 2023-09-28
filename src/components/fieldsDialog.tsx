import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import { Field } from "../model/field"
import { Movie } from "../model/movie"

type Props = {
    date: string,
    field?: Field | undefined,
    children: JSX.Element //| string | JSX.Element[] | (() => JSX.Element),
    callback: (date: string, selectedMoive: Movie) => void,
    callbackDelete?: () => void
}

export default function FieldsDialog({ date, field, children, callback, callbackDelete }: Props) {
    const [openDialog, setDialog] = useState(false)
    const [time, setTime] = useState(dayjs())
    const [availableMovies, setAvailableMovies] = useState([])
    const [selectedMoive, setSelectedMovie] = useState()
    useEffect(() => {
        if (openDialog && availableMovies.length == 0) {
            fetch(`/api/movies?date=${date}`).then((res) => res.json()).then((res) => setAvailableMovies(res))
            if (field != undefined)
                setTime(dayjs(`1970-01-01T${field.showTime}`))
        }
    }, [openDialog])

    useEffect(() => {
        if (field != undefined)
            availableMovies?.forEach((m) => {
                if (m.id == field.movie.id) {
                    setSelectedMovie(m)
                    return
                }
            })
    }, [availableMovies])


    return <>
        {React.cloneElement(children, {
            onClick: () => {
                setDialog(true)
            },
        })}
        <Dialog open={openDialog}>
            <DialogTitle>Add</DialogTitle>
            <DialogContent dividers>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                        label="Format without meridiem"
                        value={time}
                        onChange={(newValue) => setTime(newValue)}
                        format="HH:mm"
                    />
                </LocalizationProvider>
            </DialogContent>
            <div className="flex justify-center items-center">
                {availableMovies?.map((m, i) => <div key={i} className={`w-32 aspect-[12/16] bg-green-400 m-8 border-4 ${selectedMoive == m ? "border-red-500" : "border-black"}`} onClick={() => setSelectedMovie(m)}>
                    <img src={`/api/attachmentHandler/${m.cover}`}></img>
                    {m.name}
                </div>)}
            </div>
            <DialogActions>
                {field != undefined && callbackDelete != undefined ? <Button onClick={() => {
                    callbackDelete()
                    setDialog(false)
                }}>Delete</Button> : ""}
                <Button autoFocus onClick={() => setDialog(false)}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    callback(time.format("HH:mm"), selectedMoive)
                    setDialog(false)
                }}>Ok</Button>
            </DialogActions>
            {process.env.NEXT_PUBLIC_ENV == "DEV" ? <div>{JSON.stringify(availableMovies)}</div> : ""}
        </Dialog>
    </>
}
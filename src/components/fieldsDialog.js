import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

export default function FieldsDialog(props) {
    const [openDialog, setDialog] = useState(false)
    const [time, setTime] = useState(dayjs())
    const [availableMovies, setAvailableMovies] = useState([])
    const [selectedMoive, setSelectedMovie] = useState()
    useEffect(() => {
        if (openDialog && availableMovies.length == 0) {
            fetch(`/api/movies?date=${props.date}`).then((res) => res.json()).then((res) => setAvailableMovies(res))
            if (props.field != undefined)
                setTime(dayjs(`1970-01-01T${props.field.showTime}`))
        }
    }, [openDialog])

    useEffect(() => {
        if (props.field != undefined)
            availableMovies?.forEach((m) => {
                if (m.id == props.field.movie.id) {
                    setSelectedMovie(m)
                    return
                }
            })
    }, [availableMovies])


    return <>
        {React.cloneElement(props.children, {
            onClick: () => {
                setDialog(true)
            }
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
                {availableMovies?.map((m) => <div className={`w-32 aspect-[12/16] bg-green-400 m-8 border-4 ${selectedMoive == m ? "border-red-500" : "border-black"}`} onClick={() => setSelectedMovie(m)}>
                    <img src={`/api/attachmentHandler/${m.cover}`}></img>
                    {m.name}
                </div>)}
            </div>
            <DialogActions>
                {props.field != undefined && props.delete != undefined ? <Button onClick={() => {
                    props.delete()
                    setDialog(false)
                }}>Delete</Button> : ""}
                <Button autoFocus onClick={() => setDialog(false)}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    props.callback(time.format("HH:mm"), selectedMoive)
                    setDialog(false)
                }}>Ok</Button>
            </DialogActions>
            {process.env.NEXT_PUBLIC_ENV == "DEV" ? <div>{JSON.stringify(availableMovies)}</div> : ""}
        </Dialog>
    </>
}
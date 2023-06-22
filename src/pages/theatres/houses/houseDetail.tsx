import SeattingPlan from "../../../components/seattingPlan";
import { httpAuthResHelper } from "../../../helper";
import { Button, CircularProgress, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { House } from "../../../model/house";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement
    width: HTMLInputElement
    height: HTMLInputElement
}

interface SubmitFormElement extends HTMLFormElement {
    readonly elements: FormElements
}


export async function getServerSideProps(context) {
    return { props: { query: context?.query } };
}

export default function houseDetail({ query }) {
    const router = useRouter()
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [specialSeat, setSpecialSeat] = useState([])
    const [selectedSeat, setSelectedSeat] = useState([])
    const [house, setHouse] = useState({} as House)
    const [isLoading, setLoading] = useState(false)
    const { theatreId, houseId } = query

    useEffect(() => {
        if (theatreId == undefined) router.back()
        if (houseId != undefined) {
            setLoading(true)
            fetch(`/api/admin/houseDetail/${houseId}`).then(httpAuthResHelper).then(res => res.json()).then(res => {
                setHouse(res)
                setWidth(res.width)
                setHeight(res.height)
                setSpecialSeat(res.specialSeat ?? [])
                setLoading(false)
            })
        }
    }, [])

    const setType = (seatType) => {
        const remaining = specialSeat.filter((v) => selectedSeat.findIndex((e) => e.x == v.x && e.y == v.y) == -1)
        if (seatType == '')
            setSpecialSeat([...remaining])
        else
            setSpecialSeat([...remaining, ...selectedSeat.map((v) => {
                v.seatType = seatType
                return v
            })])
        setSelectedSeat([])
    }

    const submit = (e: React.FormEvent<SubmitFormElement>) => {
        e.preventDefault();
        fetch(`/api/admin/createOrUpdateHouse`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "houseId": parseInt(router.query.houseId as string),
                "theatreId": parseInt(router.query.theatreId as string),
                "name": e.currentTarget.elements.name.value,
                "width": parseInt(e.currentTarget.elements.width.value),
                "height": parseInt(e.currentTarget.elements.height.value),
                "specialSeat": specialSeat,
            })
        }).then(httpAuthResHelper).then(e => {
            if (e.status == 200) { router.back() }
        }).catch((e) => {
            console.log(e)
        })
    }

    if (isLoading) return <CircularProgress />
    return <form onSubmit={submit}>
        <div className="flex justify-between"><Button variant="outlined" onClick={() => router.back()}>back</Button> <Button variant="outlined" type="submit">Submit</Button></div>
        <TextField label="Name" id="name" defaultValue={house.name}></TextField>
        <TextField label="width" id="width" type="number" onChange={(e) => setWidth(parseInt(e.target.value))} value={width}></TextField>
        <TextField label="height" id="height" type="number" onChange={(e) => setHeight(parseInt(e.target.value))} value={height}></TextField>
        <SeattingPlan col={width} row={height} specialSeat={specialSeat} selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} adminMode={true}></SeattingPlan>
        <Button variant="outlined" onClick={() => setType('')}>Free Seat</Button>
        <Button variant="outlined" onClick={() => setType('space')}>Set Space</Button>
        <Button variant="outlined" onClick={() => setType('wheelchair')}>Set Wheelchair</Button>
        {/* <Button onClick={() => setType('occupied')}>Occupied</Button> */}
    </form>
}
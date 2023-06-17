import DragDropFile from "@/components/dragDropFile";
import { httpAuthResHelper } from "@/helper";
import { Button, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputAdornment, OutlinedInput, Switch, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
    return { props: { query: context?.query } };
}

export default function movieDetail({ query }) {
    const router = useRouter()
    const { movieId } = query
    const [filename, setFilename] = useState(null)
    const [movie, setMovie] = useState({})
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (movieId != undefined) {
            setLoading(true)
            fetch(`/api/admin/movieDetail/${movieId}`).then(httpAuthResHelper).then(res => res.json()).then((e) => {
                setMovie(e)
                setFilename(e.cover)
                setLoading(false)
            })
        }
    }, [])


    const submit = (e) => {
        e.preventDefault();
        fetch(`/api/admin/createOrUpdateMovie`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": parseInt(movieId ?? "0"),
                "name": e.target.name.value,
                "path": e.target.path.value,
                "startDate": e.target.startDate.value,
                "length": parseInt(e.target.length.value),
                "desc": e.target.desc.value,
                "avaliable": e.target.avaliable.checked ? 1 : 0,
                "promo": e.target.promo.checked ? 1 : 0,
                "cover": filename,
            })
        }).then(httpAuthResHelper).then(e => {
            if (e.status == 200) { router.back() }
        }).catch((e) => {
            console.log(e)
        })
    }
    if (isLoading) return <CircularProgress />
    return <div>
        <form onSubmit={submit}>
            <TextField label="Name" id="name" defaultValue={movie.name} />
            <TextField label="Path" id="path" defaultValue={movie.path} />
            <TextField label="Start Date" id="startDate" type="date" defaultValue={movie.startDate} />
            <TextField className="text-right" label="Length" id="length" type="number" defaultValue={movie.length}
                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
            <TextField label="Desc" id="desc" defaultValue={movie.desc} />
            <FormControlLabel control={<Switch id="avaliable" defaultChecked={movie.avaliable == 1} />} label="Avaliable" />
            <FormControlLabel control={<Switch id="promo" defaultChecked={movie.promo == 1} />} label="Promo" />
            <Button type="submit">Submit</Button>
        </form>
        <DragDropFile handleFiles={(e) => {
            setFilename(e.id)
        }} />
        {filename != null ? <img src={`/api/attachmentHandler/${filename}`}></img> : ""}
        {JSON.stringify(movie)}
    </div>
}
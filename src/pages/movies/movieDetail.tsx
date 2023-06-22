import DragDropFile from "../../components/dragDropFile";
import { httpAuthResHelper } from "../../helper";
import { Button, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputAdornment, OutlinedInput, Switch, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Movie } from "../../model/movie";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement
    path: HTMLInputElement
    startDate: HTMLInputElement
    movieLength: HTMLInputElement
    desc: HTMLInputElement
    avaliable: HTMLInputElement
    promo: HTMLInputElement
}

interface SubmitFormElement extends HTMLFormElement {
    readonly elements: FormElements
}

export async function getServerSideProps(context) {
    return { props: { query: context?.query } };
}

export default function movieDetail({ query }) {
    const router = useRouter()
    const { movieId } = query
    const [filename, setFilename] = useState(null)
    const [movie, setMovie] = useState({} as Movie)
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


    const submit = (e: React.FormEvent<SubmitFormElement>) => {
        e.preventDefault();
        fetch(`/api/admin/createOrUpdateMovie`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": parseInt(movieId ?? "0"),
                "name": e.currentTarget.elements.name.value,
                "path": e.currentTarget.elements.path.value,
                "startDate": e.currentTarget.elements.startDate.value,
                "length": parseInt(e.currentTarget.elements.movieLength.value),
                "desc": e.currentTarget.elements.desc.value,
                "avaliable": e.currentTarget.elements.avaliable.checked ? 1 : 0,
                "promo": e.currentTarget.elements.promo.checked ? 1 : 0,
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
            <TextField className="text-right" label="Length" id="movieLength" type="number" defaultValue={movie.length}
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
        {process.env.NEXT_PUBLIC_ENV == "DEV" ? <div>{JSON.stringify(movie)}</div> : ""}
    </div>
}
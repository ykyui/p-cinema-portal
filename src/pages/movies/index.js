import { httpAuthResHelper } from "@/helper"
import { Button, Chip, CircularProgress } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export async function getServerSideProps(context) {
    //     // const response = await fetch(`http://${context.req.headers.host}/api/movies`)
    //     // if (response.status == 401) {
    //     //     return {
    //     //         redirect: {
    //     //             destination: '/login',
    //     //             permanent: false,
    //     //         },
    //     //         props: {},
    //     //     }
    //     // }
    //     const data = {}; //await response.json()
    return { props: {} }
}

// export async function getServerSideProps(context) {
//     const response = await fetch(`http://${context.req.headers.host}/api/searchMovie?movieId=0&date=&theatreId=0`)
//     const data = await response.json()
//     return { props: { data } }
//   }


export default function MovieIndex() {
    let [data, setData] = useState({})
    let [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true)
        fetch(`/api/movies?date=`).then(httpAuthResHelper).then((res) => res.json()).then((res) => {
            setData(res)
            setLoading(false)
        })
    }, [])
    return <div>
        <div>
            <Link href="/movies/movieDetail"><Button>Create Movie</Button></Link>
        </div>
        {loading ? <CircularProgress /> : data.map(e => {
            return <Link href={{
                pathname: '/movies/movieDetail',
                query: { movieId: e.id },
            }}><Chip label={e.name}></Chip ></Link>
        })}
        {process.env.NEXT_PUBLIC_ENV == "DEV" ? <div>{JSON.stringify(data)}</div> : ""}
    </div>
}
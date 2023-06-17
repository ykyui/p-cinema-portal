import { Button, Chip } from "@mui/material"
import Link from "next/link"

export async function getServerSideProps(context) {
    const response = await fetch(`http://${context.req.headers.host}/api/theatres`)
    const data = await response.json()
    return { props: { data } }
}

export default function Theatres({ data }) {
    return <div>
        <div>
            <Link href="/theatres/theatreDetail"><Button>Create Theatre</Button></Link>
        </div>
        {data.map(e => {
            return <Link href={{
                pathname: '/theatres/theatreDetail',
                query: { theatreId: e.theatreId },
            }}><Chip label={e.name}></Chip ></Link>
        })}
        <div>{JSON.stringify(data)}</div>
    </div>
}
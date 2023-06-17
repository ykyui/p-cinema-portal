import { arrayGen, httpAuthResHelper } from "@/helper";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Chip, CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import FieldsDialog from "@/components/fieldsDialog";

export async function getServerSideProps(context) {
    return { props: { query: context?.query } };
}
export default function TheatreDetail({ query }) {
    const router = useRouter()
    const { theatreId } = query
    const [theatres, setTheatres] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [scheduleDate, setScheduleDate] = useState(dayjs())
    const [fieldList, setFieldList] = useState([])
    const [fieldListLoading, setFieldListLoading] = useState(false)

    useEffect(() => {
        setScheduleDate(dayjs())
        if (theatreId != undefined) {
            setLoading(true)
            fetch(`/api/admin/theatresDetail/${theatreId}`).then(httpAuthResHelper).then(res => res.json()).then((e) => {
                setTheatres(e)
                setLoading(false)
            })
        }
    }, [])

    useEffect(() => {
        setFieldListLoading(true)
        fetch(`/api/theatreField?theatreId=${theatreId}&date=${scheduleDate.format("YYYY-MM-DD")}`).then(httpAuthResHelper).then(res => res.json()).then((e) => {
            setFieldList(e ?? [])
            setFieldListLoading(false)
        })
    }, [scheduleDate])

    const addFields = (showTime, movie, houseId) => {
        setFieldList([...fieldList, { movie, showTime, house: { houseId } }])
    }

    const editField = (field, time, movie) => {
        field.showTime = time
        field.movie = movie
        setFieldList([...fieldList])
    }

    const deleteField = (field) => {
        setFieldList([...fieldList.filter((e) => e != field)])
    }

    const saveSchedule = () => {
        fetch("/api/admin/createOrUpdateField", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: scheduleDate.format("YYYY-MM-DD"),
                theatreId: parseInt(theatreId),
                fields: fieldList,
            })
        }).then(httpAuthResHelper).then((res) => {
            if (res.status == 200)
                setScheduleDate(dayjs(scheduleDate.format("YYYY-MM-DD")))
        })
        console.log(({
            date: scheduleDate.format("YYYY-MM-DD"),
            theatreId: parseInt(theatreId),
            fields: fieldList,
        }))
    }



    const submit = (e) => {
        e.preventDefault();
        fetch(`/api/admin/createOrUpdateTheatre`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "theatreId": parseInt(theatreId ?? "0"),
                "name": e.target.name.value,
            })
        }).then(httpAuthResHelper).then(e => {
            if (e.status == 200) { router.back() }
        }).catch((e) => {
            console.log(e)
        })
    }
    if (isLoading) return <CircularProgress />
    return <form onSubmit={submit}>
        <div className="flex justify-between">
            <Button onClick={() => router.back()}>back</Button>
            <Button type="submit">Submit</Button>
        </div>
        <TextField placeholder="Name" id="name" defaultValue={theatres.name}></TextField>
        {theatreId == undefined ? <></> :
            <>
                <div>
                    <Button onClick={() => {
                        router.push({ pathname: "/theatres/houses/houseDetail", query: router.query })
                    }}>Create House</Button>
                </div>
                <div>
                    {theatres.houses?.map(e => {
                        return <Link href={{
                            pathname: '/theatres/houses/houseDetail',
                            query: {
                                theatreId: e.theatreId,
                                houseId: e.houseId
                            },
                        }}><Chip label={e.name}></Chip ></Link>
                    })}
                </div>
                <div className="flex justify-between items-center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker value={scheduleDate} onChange={(v) => setScheduleDate(v)} format="YYYY-MM-DD" />
                    </LocalizationProvider>
                    <Button onClick={saveSchedule}>Save Schedule</Button>
                </div>

            </>
        }
        {fieldListLoading ? <CircularProgress /> :
            <div className="h-[1024px] relative cursor-pointer">
                <div className="bg-gray-200 flex flex-col pt-9 absolute top-0 w-full h-full -z-10">
                    {arrayGen(24).map((v, i) => <div className={`flex-1 ${i % 2 == 0 ? "bg-white" : ""}`}>{i}</div>)}
                </div>
                <div className="pl-8 flex h-full">
                    {theatres.houses?.map((e) => <div className="flex-1 flex flex-col border-2 border-l-gray-300 border-dotted">
                        <div className="h-9 sticky top-10 border-4 border-b-black">{e.name}</div>
                        <div className="relative flex flex-1 h-full w-full" >
                            <FieldsDialog date={scheduleDate.format("YYYY-MM-DD")} callback={(time, movie) => addFields(time, movie, e.houseId)} >
                                <div className="absolut top-0 left-0 w-full h-full"></div>
                            </FieldsDialog>
                            {fieldList.filter((f) => f.house.houseId == e.houseId).map((f) => {
                                const startTime = dayjs(`1970-01-01T${f.showTime}`)
                                const endTime = startTime.add(Math.floor(f.movie.length / 60), 'h').add(f.movie.length % 60, 'm')
                                return <FieldsDialog date={scheduleDate.format("YYYY-MM-DD")} field={f} callback={(time, movie) => editField(f, time, movie)} delete={() => deleteField(f)}>
                                    <div className="bg-orange-600 w-full absolute opacity-80" style={{
                                        height: `${f.movie.length / (60 * 24) * 100}%`,
                                        top: `${(startTime.hour() * 60 + startTime.minute()) / (60 * 24) * 100}%`
                                    }}>
                                        <div>
                                            {`${f.movie.name}`}
                                            <br></br>
                                            {`${startTime.hour()}:${startTime.minute()} - ${endTime.hour()}:${endTime.minute()} (${f.movie.length})`}
                                        </div>
                                    </div>
                                </FieldsDialog>
                            })}
                        </div>
                    </div>)}
                </div>
            </div>
        }
        <div>
            {JSON.stringify(theatres)}
        </div>

    </form>

}
import { Dispatch, SetStateAction } from "react"
import { arrayGen } from "../helper"
import { Seat } from "../model/seat"



const seatColor = {
    "": "bg-blue-200",
    "lock": "bg-gray-300",
    "payment": "bg-gray-400",
    "success": "bg-gray-500",
    "wheelchair": "bg-purple-400",
}

const cantSelectSeatType = {
    "space": "",
    "occupied": "",
    "lock": "",
    "payment": "",
    "success": "",
}

type Props = {
    col: number,
    row: number,
    specialSeat: Seat[],
    selectedSeat: Seat[],
    setSelectedSeat: Dispatch<SetStateAction<Seat[]>>,
    adminMode?: boolean
}

export default function SeattingPlan({ col, row, specialSeat, selectedSeat, setSelectedSeat, adminMode = false }: Props) {
    const rowA = arrayGen(row)
    const colA = arrayGen(col)

    const selectSeat = (seat: Seat) => {
        const index = selectedSeat.findIndex((v) => v.x == seat.x && v.y == seat.y)
        if (index == -1)
            setSelectedSeat([...selectedSeat, seat])
        else
            setSelectedSeat([...selectedSeat.filter((v) => !(v.x == seat.x && v.y == seat.y))])
    }

    const selectAisle = (y: number) => {
        const allY = selectedSeat.filter((v) => v.y == y).length < col
        setSelectedSeat([...selectedSeat.filter((v) => v.y != y)])
        if (allY) {
            let temp = []
            for (let index = 0; index < col; index++) {
                temp.push({ x: index, y: y })
            }
            setSelectedSeat([...selectedSeat, ...temp])
        }
    }

    const a = "A".charCodeAt(0)
    let skipY = 0
    return (
        <>
            {rowA.map((_, y) => {
                const specialX = specialSeat.filter((v) => v.y == y)
                const selectedX = selectedSeat.filter((v) => v.y == y)
                const aisle = specialX.filter((v) => v.seatType == 'space').length >= col
                if (aisle) skipY++
                const seatY = y - skipY
                let skipX = 0
                return <div style={{ maxWidth: `${col / row * 50}%` }}>
                    <div className="flex pb-0.5">
                        <div className="cursor-pointer flex-1 aspect-square ml-0.5 overflow-clip md:text-base text-xs text-center" onClick={() => { if (adminMode) selectAisle(y) }}>
                            {aisle ? "->" : `${seatY / 26 >= 1 ? String.fromCharCode(a + seatY / 26 - 1) : ""}${String.fromCharCode(a + seatY % 26)}`}
                        </div>
                        {colA.map((_, x) => {
                            const specialIndex = specialX.findIndex((v) => v.x == x)
                            const seatType = specialIndex == -1 ? "" : specialX[specialIndex].seatType
                            const isSelect = selectedX.findIndex((v) => v.x == x) > -1
                            if (seatType == "space") skipX++
                            const seatX = x - (skipX > 10 ? 0 : skipX) + 1
                            return <div className={`flex-1 aspect-square ml-0.5 overflow-hidden
                                ${seatType == "space" && !isSelect ? "opacity-0 " : ""}
                                ${isSelect ? "bg-green-400 " : seatColor[seatType] ?? "bg-yellow-200"}
                                ${cantSelectSeatType[seatType] == undefined || adminMode ? "cursor-pointer" : "cursor-not-allowed"}
                              `}
                                onClick={() => {
                                    if (cantSelectSeatType[seatType] == undefined || adminMode) selectSeat({ x, y, seatType: "", displayX: seatX, displayY: seatY % 26 })
                                }}>
                                {seatType != 'space' ? `${seatY / 26 >= 1 ? String.fromCharCode(a + seatY / 26 - 1) : ""}${String.fromCharCode(a + seatY % 26)}${seatX}` : ""} {specialIndex == -1 ? "" : seatType.substring(0, 1)}
                            </div>
                        })
                        }</div >
                </div>
            })}
        </>)

}

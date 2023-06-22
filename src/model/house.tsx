import { Seat } from "./seat"

export interface House {
    theatreId: number
    houseId: number
    name: string
    width: number
    height: number
    specialSeat: Seat[]
}
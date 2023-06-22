import { House } from "./house"
import { Movie } from "./movie"
import { Seat } from "./seat"
import { Theatre } from "./theatre"

export interface Field {
    theatre: Theatre
    house: House
    movie: Movie
    fieldId: number
    showDate: string
    showTime: string
    soldSeat: Seat[]
}
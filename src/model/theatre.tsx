import { House } from "./house"

export interface Theatre {
    theatreId: number
    name: string
    houses: House[]
}
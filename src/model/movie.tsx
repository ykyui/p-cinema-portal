import { Field } from "./field"


export interface Movie {
    id: number
    path: string
    name: string
    startDate: string
    cover: string
    trailer: string[]
    length: number
    ratings: number
    ratingsDesc: string
    desc: string
    genre: string[]
    director: string[]
    cast: string[]
    producers: string[]
    writers: string[]
    avaliable: number
    promo: number
    fields: Field[]
}
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import MovieIndex, { getServerSideProps as mGetServerSideProps } from "./movies";



export async function getServerSideProps(context) {
  return mGetServerSideProps(context)
}


export default MovieIndex

import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { createWrapper } from "next-redux-wrapper";

const store = () => configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
    },
})

export const wrapper = createWrapper(store);
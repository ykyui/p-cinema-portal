import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { createWrapper } from "next-redux-wrapper";
import { drawerSlice } from "./drawerSlice";

const store = () => configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [drawerSlice.name]: drawerSlice.reducer,
    },
})

export const wrapper = createWrapper(store);
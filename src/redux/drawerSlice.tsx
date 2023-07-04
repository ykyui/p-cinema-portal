import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export const drawerSlice = createSlice({
    name: "drawer",
    initialState: {
        open: false
    },
    reducers: {
        drawerOnclick(state, action: PayloadAction<undefined>) {
            state.open = !state.open
        },
    }
})

export const drawerState = (state) => state.drawer;

export const { drawerOnclick } = drawerSlice.actions;

import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        auth: false,
        token: "",
    },
    reducers: {
        login: (state, action) => {
            state.auth = true
            state.token = action.payload
            localStorage.setItem("token", state.token)
        },
        logout: state => {
            state.auth = false
            state.token = ""
        }
    }
})

export const authState = (state) => state.auth;

export const { login, logout } = authSlice.actions;

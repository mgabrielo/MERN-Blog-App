import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    errorMessage: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state, action) => {
            state.loading = true
            state.errorMessage = null
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.errorMessage = null;
            state.currentUser = action.payload
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.errorMessage = action.payload
            state.currentUser = null
        },
        updateStart: (state, action) => {
            state.loading = true
            state.errorMessage = null
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.errorMessage = null;
            state.currentUser = action.payload
        },
        updateFailure: (state, action) => {
            state.loading = false
            state.errorMessage = action.payload
        },
    }
});

export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure } = userSlice.actions

export default userSlice.reducer
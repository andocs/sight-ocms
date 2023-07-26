import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    transactions: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
})

export const { reset } = transactionSlice.actions
export default transactionSlice.reducer
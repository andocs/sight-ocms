import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import transactionSlice from '../features/transaction/transactionSlice'
import staffSlice from '../features/staff/staffSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionSlice,
    staff: staffSlice
  },
})
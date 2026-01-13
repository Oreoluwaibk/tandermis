import { configureStore } from '@reduxjs/toolkit'
import authReducer from "@/redux/reducer/auth/auth";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    //   faculty: facultyReducer
    }
  })
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // faculty: facultyReducer
  },
})

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'];
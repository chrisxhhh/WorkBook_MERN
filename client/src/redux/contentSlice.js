import {createSlice} from "@reduxjs/toolkit"

export const contentSlice = createSlice({
    name: "content",
    initialState: {
        content: 'home'
    },
    reducers: {
        setContent: (state, action) => {
            state.content = action.payload;
        }
    }
});

export const { setContent } = contentSlice.actions
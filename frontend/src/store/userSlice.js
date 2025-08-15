import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:{
        id:null,
        username:null,
        email:null,
        bio:null,
        date_of_birth:null,
        profile_picture:null
    }
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            const user=action.payload
            state.user={
                id:user.id,
                email:user.email,
                username:user.username,
                bio:user.bio,
                date_of_birth:user.date_of_birth,
                profile_picture:user.profile_picture
            }

        },
        clearUser:(state)=>{
            state.user={
                id:null,
                username:null,
                email:null,
                bio:null,
                date_of_birth:null,
                profile_picture:null
            }
        }
    }

})

export const {setUser,clearUser}=userSlice.actions;
export default userSlice.reducer
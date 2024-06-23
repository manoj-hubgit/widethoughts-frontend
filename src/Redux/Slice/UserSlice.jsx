import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentuser:null,
    error:null,
    loading:false
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signinStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        signInSuccess:(state,action)=>{
            state.currentuser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        updateStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
         updateSuccess:(state,action)=>{
            state.currentuser.rest=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signOutSuccess:(state)=>{
            state.currentuser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        deleteUserSuccess:(state)=>{
            state.currentuser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
    }
}
})

export const {signinStart,signInFailure,signInSuccess,updateStart,updateSuccess,updateFailure,signOutSuccess,deleteUserFailure,deleteUserSuccess,deleteUserStart}=userSlice.actions;
export default userSlice.reducer;
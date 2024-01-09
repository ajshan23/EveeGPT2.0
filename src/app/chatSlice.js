import { createSlice, } from "@reduxjs/toolkit";
//for previous chat history list

// this list will be like following

// listedChats={
//     email:email,
//     allChatHeading:[
//         {
//             chat:Heading,
//             date:date.now,
//         },
//         {
//             chat:Heading,
//             date:date.now,
//         }
//     ]
// }


//for chat history
//only load chat ,which is selected,


const initialState={
    accessToken:"",
    userEmail:"",
    // chats:[{}],//all previous chats title
    // chatHistory:[{}]//whole chat conversation
}

export const chatSlice=createSlice({
    name:"chats",
    initialState,
    reducers:{
        updateAccessToken:(state,action)=>{
            state.accessToken=action.payload
        },
        updateUser:(state,action)=>{
            state.userEmail=action.payload
        }
        ,
        

    }
})

export const {updateAccessToken,updateUser}=chatSlice.actions

export default chatSlice.reducer;
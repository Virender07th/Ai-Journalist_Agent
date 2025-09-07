import { combineReducers } from "@reduxjs/toolkit";
import AiReducer from "../Slice/AiSlice";

 
const rootReducer =combineReducers({
    ai:AiReducer, 
    

})

export default rootReducer;
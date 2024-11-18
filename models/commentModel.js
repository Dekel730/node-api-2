import mongoose from "mongoose";

const commentScheme = mongoose.Schema({
    message: {
        type:String,
        required:true
    },

    post:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    },
    
    user:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'user'
    },
});

export default mongoose.model("Comment", commentScheme)
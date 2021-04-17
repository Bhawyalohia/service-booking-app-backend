const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types; 
const buyerSchema=new mongoose.Schema({
   userName:String,
   email: String,
   password: String,
   role: {
       type:String,
       default:"buyer"
   },
   cart:{ 
       type:[{type: ObjectId}],
       default:[]
    },   
});
const buyerCollection=new mongoose.model("Buyer",buyerSchema);
module.exports = buyerCollection;
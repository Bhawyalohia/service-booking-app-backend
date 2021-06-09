const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types;
const orderSchema=new mongoose.Schema({
   userId:ObjectId,
   service:{
      _id:ObjectId,
      title:String
   },
   address:String,
   date:Date,
   ownerId:ObjectId,
   orderStatus:String,
   timerStartTime:Date
});
const orderCollection=new mongoose.model("Order",orderSchema);
module.exports = orderCollection;
const mongoose=require("mongoose");
const orderSchema=new mongoose.Schema({
   
});
const orderCollection=new mongoose.model("Order",orderSchema);
module.exports = orderCollection;
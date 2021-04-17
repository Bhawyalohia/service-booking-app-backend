const mongoose=require("mongoose");
const sellerSchema=new mongoose.Schema({
    userName:String,
    email: String,
    password: String,
    role:String,
    address:String,
    city:String,
    state:String,
    pincode:String,
    phoneNo:String,
   
});
const sellerCollection=new mongoose.model("Seller",sellerSchema);
module.exports = sellerCollection;

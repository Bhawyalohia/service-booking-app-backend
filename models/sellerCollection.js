const mongoose=require("mongoose");
const sellerSchema=new mongoose.Schema({
    userName:String,
    emailId: String,
    password: String,
    role:String,
    address:String,
    city:String,
    state:String,
    pincode:String,
    phoneNo:String,
    // shopPhoto:{
    //     type:Array,
    // }
});
const sellerCollection=new mongoose.model("Seller",sellerSchema);
module.exports = sellerCollection;

const mongoose=require("mongoose");
const buyerSchema=new mongoose.Schema({
   userName:String,
   emailId: String,
   password: String,
   role: {
       type:String,
       default:"buyer"
   },
//    cart:{
      
//    }
});
const buyerCollection=new mongoose.model("Buyer",buyerSchema);
module.exports = buyerCollection;
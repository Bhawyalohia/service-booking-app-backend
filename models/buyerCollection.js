const mongoose=require("mongoose");
const buyerSchema=new mongoose.Schema({
   userName:String,
   email: String,
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
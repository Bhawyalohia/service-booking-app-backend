const mongoose=require("mongoose");
const hallServiceSchema=new mongoose.Schema({
   title:String,
   description:String,
   price:String,
//    photos:{
//        type:Array,
//        default:[]
//    }
//    dateOfUnavailability:{
//        type:Array,
//        default:[]
//    }
});
const hallServiceCollection=new mongoose.model("Hallservice",hallServiceSchema);
module.exports = hallServiceCollection;
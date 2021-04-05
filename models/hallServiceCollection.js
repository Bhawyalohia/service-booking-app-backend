const mongoose=require("mongoose");
const hallServiceSchema=new mongoose.Schema({
   Title:String,
   description:String,
   pricePerDay:String,
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
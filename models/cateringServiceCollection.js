const mongoose=require("mongoose");
const cateringServiceSchema=new mongoose.Schema({
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
const cateringServiceCollection=new mongoose.model("Cateringservice",cateringServiceSchema);
module.exports = cateringServiceCollection;
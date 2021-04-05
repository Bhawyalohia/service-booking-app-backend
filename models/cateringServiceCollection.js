const mongoose=require("mongoose");
const cateringServiceSchema=new mongoose.Schema({
    packageName:String,
    description:String,
    pricePerPlate:String,
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
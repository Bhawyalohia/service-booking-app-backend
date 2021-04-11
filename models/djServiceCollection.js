const mongoose=require("mongoose");
const djServiceSchema=new mongoose.Schema({
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
const djServiceCollection=new mongoose.model("Djservice",djServiceSchema);
module.exports = djServiceCollection;
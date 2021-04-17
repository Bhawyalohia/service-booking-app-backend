const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types; 
const cateringServiceSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:String,
    dateOfUnavailability:{
        type:[{type:Date}],
        default:[]
    },
    by:{
       type:ObjectId,
       ref:'Seller'
    }
});
const cateringServiceCollection=new mongoose.model("Cateringservice",cateringServiceSchema);
module.exports = cateringServiceCollection;
const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types; 
const djServiceSchema=new mongoose.Schema({
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
    },
    images:{
        type:[{
            Key:String,
            Location:String,
            Bucket:String
        }],
        default:[]   
     },
     reviews:{
        type:[{
          _id:ObjectId,
          review:String,
          by:ObjectId   
        }],
        default:[]
     }
});
const djServiceCollection=new mongoose.model("Djservice",djServiceSchema);
module.exports = djServiceCollection;
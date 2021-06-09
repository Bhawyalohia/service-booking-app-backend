const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const mongoose = require("mongoose");
const buyerCollection=require("../models/buyerCollection");
const cateringServiceCollection=require("../models/cateringServiceCollection");
const djServiceCollection=require("../models/djServiceCollection");
const hallServiceCollection=require("../models/hallServiceCollection");
const {ObjectId} = mongoose.Types;

const authCheck=(req,res,next)=>
{
     console.log(req.headers.authtoken);
     admin.auth().verifyIdToken(req.headers.authtoken)
     .then((user) => {
          req.user=user;
          next();
     })
     .catch((error) => {
       console.log("error",error.message);
       res.send("404");
     });
}
const checkBuyer=(req,res,next)=>
{
     buyerCollection.findOne({email:req.user.email})
     .then((userInDb)=>
     {
          if(userInDb)
          {
             req.user=userInDb;
             next();
          }
          else {
              res.send("can't complete process. first login/register as a buyer");
        }
     })
     .catch((error)=>{console.log(error)})
}


const readHallServices=(req,res,next)=>
{
    hallServiceCollection.find({}).populate('by')
    .then((services)=>
    {
        console.log(services);
        res.json(services);
    })
    .catch((error)=>{console.log(error)});
};
const readDjServices=(req,res,next)=>
{
    djServiceCollection.find({}).populate('by')
    .then((services)=>
    {
        console.log(services);
        res.json(services);
    })
    .catch((error)=>{console.log(error)});
};
const readCateringServices=(req,res,next)=>
{
    cateringServiceCollection.find({}).populate('by')
    .then((services)=>
    {
        console.log(services);
        res.json(services);
    })
    .catch((error)=>{console.log(error)});
};
const readService = async (req,res,next)=>
{
try
{
   let service=null;
   let serviceId=req.params.slug;
   service=await hallServiceCollection.findOne({_id:serviceId}).populate('by');
   if(!service)
   service=await cateringServiceCollection.findOne({_id:serviceId}).populate('by');
   if(!service)
   service=await djServiceCollection.findOne({_id:serviceId}).populate('by');
   res.json(service);
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}
}
const addReview = async (req,res,next)=>
{
try
{
   let service=req.body.service;
   let comment=req.body.review;
   let serviceDocument=null;
   let user=req.user;
   if(service.by.role==="Banquet Hall")
   {
       serviceDocument=await hallServiceCollection.findOne({_id:service._id})
   }
   else if(service.by.role==="Caterer")
   {
       serviceDocument=await cateringServiceCollection.findOne({_id:service._id})
   }
   else if(service.by.role==="Dj")
   {
       serviceDocument=await djServiceCollection.findOne({_id:service._id})
   }
   if(serviceDocument)
   {
         let reviewId=new ObjectId();
         serviceDocument.reviews.push({
               _id:reviewId,
               review:comment,
               by:user._id
         });
         let response=await serviceDocument.save();
         res.json(response);
   }
   else res.json("service not found");
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}
}
const removeReview = async (req,res,next)=>
{
    try
    {
       let service=req.body.service;
       let review=req.body.review;
       let serviceDocument=null;
       let user=req.user;
       if(service.by.role==="Banquet Hall")
       {
           serviceDocument=await hallServiceCollection.findOne({_id:service._id})
       }
       else if(service.by.role==="Caterer")
       {
           serviceDocument=await cateringServiceCollection.findOne({_id:service._id})
       }
       else if(service.by.role==="Dj")
       {
           serviceDocument=await djServiceCollection.findOne({_id:service._id})
       }
       if(serviceDocument)
       {
             if(review.by==user._id)
             {
               let reviews=serviceDocument.reviews.filter((currentReview)=>
               {
                   if(currentReview._id!=review._id)
                   return currentReview;
               });
               serviceDocument.reviews=reviews;
               console.log(reviews);
               let response=await serviceDocument.save();
               res.json(response);
             }
             else res.json("cannot delete product");
       }
       else res.json("service not found");
    }
    catch(error)
    {
         console.log(error);
         res.send("cannot read products");
    }
}
router.get("/hallservices",readHallServices);
router.get("/djservices",readDjServices);
router.get("/cateringservices",readCateringServices);
router.get("/:slug",readService);
router.post("/addreview",authCheck,checkBuyer,addReview);
router.post("/removereview",authCheck,checkBuyer,removeReview);
module.exports=router;
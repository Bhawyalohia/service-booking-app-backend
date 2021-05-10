const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
const cateringServiceCollection=require("../models/cateringServiceCollection");
const djServiceCollection=require("../models/djServiceCollection");
const hallServiceCollection=require("../models/hallServiceCollection");
//const {ObjectId} = mongoose.Types;
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
router.get("/hallservices",readHallServices);
router.get("/djservices",readDjServices);
router.get("/cateringservices",readCateringServices);
router.get("/:slug",readService);
module.exports=router;
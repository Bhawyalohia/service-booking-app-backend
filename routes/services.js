const express=require("express");
const router=express.Router();
const cateringServiceCollection=require("../models/cateringServiceCollection");
const djServiceCollection=require("../models/djServiceCollection");
const hallServiceCollection=require("../models/hallServiceCollection");
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
router.get("/hallservices",readHallServices);
router.get("/djservices",readDjServices);
router.get("/cateringservices",readCateringServices);

module.exports=router;
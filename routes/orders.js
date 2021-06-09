const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const userCollection =require("../models/user.js");
const buyerCollection=require("../models/buyerCollection");
const sellerCollection=require("../models/sellerCollection");
const cateringServiceCollection=require("../models/cateringServiceCollection");
const djServiceCollection=require("../models/djServiceCollection");
const hallServiceCollection=require("../models/hallServiceCollection");
const orderCollection=require("../models/orderCollection");
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
          else res.send("can't complete process. first login/register as a buyer");
     })
     .catch((error)=>{console.log(error)})
}
const checkProfessional=(req,res,next)=>
{
     sellerCollection.findOne({email:req.user.email})
     .then((userInDb)=>
     {
          if(userInDb)
          {
             req.user=userInDb;
             next();
          }
          else res.send("can't add product.not registered as seller.");
     })
     .catch((error)=>{console.log(error)})
}
const getUserInfo=async (req,res,next)=>
{
     try{
     let user=null;
     user=await buyerCollection.findOne({email:req.user.email});
     if(!user)
     user=await sellerCollection.findOne({email:req.user.email});
     if(!user)
     res.json("user not found. Please register first");
     req.user=user;
     next();
     }
     catch(err){console.log(err);}
}
const readService = async (req,res,next)=>
{
try
{
   let service=null;
   let serviceId=req.body.serviceId;
   service=await hallServiceCollection.findOne({_id:serviceId}).populate('by');
   if(!service)
   service=await cateringServiceCollection.findOne({_id:serviceId}).populate('by');
   if(!service)
   service=await djServiceCollection.findOne({_id:serviceId}).populate('by');
   req.service=service;
   if(!service)
   res.json("cannot find this service");
   next();
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}
}
const createOrder=(req,res,next)=>
{
     const service=req.service;
     const order=req.body;
     const user=req.user;
     const newOrder=new orderCollection({...order,userId:user._id,orderStatus:"IN_QUEUE",ownerId:service.by._id,service:service});
     newOrder.save().then((savedOrder)=>{res.json(savedOrder)}).catch((err)=>{console.log(err)});
}
const updateOrderStatus=async (req,res,next)=>
{
   try{
         const {orderId,orderStatus}=req.body;
         const user=req.user;
         let orderInDb=await orderCollection.findOne({_id:orderId});
         console.log(orderInDb);
         console.log(user._id);
         orderInDb.orderStatus=orderStatus;
         let newOrder = await orderInDb.save();
         res.json(newOrder);
     //     if(orderInDb&&((orderInDb.userId==user._id)||(orderInDb.ownerId==user._id))){ } 
     //     else res.json("order not found");
   }
   catch(err){console.log(err);}
}
const readOrders=(req,res,next)=>
{
     const user=req.user;
     if(user.role==="seller")
     {
         orderCollection.find({ownerId:user._id})
         .then((orders)=>{res.json(orders)})
         .catch((error)=>{console.log(error)});
     }
     else if(user.role==="buyer")
     {
          orderCollection.find({userId:user._id})
          .then((orders)=>{res.json(orders)})
          .catch((error)=>{console.log(error)});
     }
     else res.json("user not found as buyer or seller");
}
const deleteOrder=(req,res,next)=>
{
   
}
router.post("/createorder",authCheck,checkBuyer,readService,createOrder);
router.post("/updateorderstatus",authCheck,getUserInfo,updateOrderStatus);
router.post("/readorders",authCheck,getUserInfo,readOrders);
module.exports = router;
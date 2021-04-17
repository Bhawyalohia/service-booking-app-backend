const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const userCollection =require("../models/user.js");
const buyerCollection=require("../models/buyerCollection");
const sellerCollection=require("../models/sellerCollection");
const cateringServiceCollection=require("../models/cateringServiceCollection");
const djServiceCollection=require("../models/djServiceCollection");
const hallServiceCollection=require("../models/hallServiceCollection");

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
const addToCart=(req,res,next)=>
{
    const product=req.body;
    //const productType=(product.by.role==="Caterer"?"Cateringservices":(product.by.role==="Dj"?"Djservices":"Hallservices"));
     buyerCollection.findOne({email:req.user.email})
     .then((buyerInDb)=>{
         if(buyerInDb)
         {
           if(buyerInDb.cart.indexOf(product._id)===-1)
           {
            buyerInDb.cart.push(product._id);
            buyerInDb.save()
            .then((savedBuyer)=>{console.log(savedBuyer)})
            .catch((error)=>{console.log(error)})
           }
           else res.send("already exists");
         }
         else res.json("please register as a buyer");
     })
     .catch((error)=>{console.log(error)})
    
}
const deleteFromCart=(req,res,next)=>
{
    const product=req.body;
    //const productType=(product.by.role==="Caterer"?"Cateringservices":(product.by.role==="Dj"?"Djservices":"Hallservices"));
     buyerCollection.findOne({email:req.user.email})
     .then((buyerInDb)=>{
         if(buyerInDb)
         {
            const elementIndex=buyerInDb.cart.indexOf(product._id);
           if(elementIndex!=-1)
           {
            buyerInDb.cart.splice(elementIndex,1);
            buyerInDb.save()
            .then((savedBuyer)=>{console.log(savedBuyer)})
            .catch((error)=>{console.log(error)})
           }
           else res.send("does not exist.");
         }
         else res.json("please register as a buyer");
     })
     .catch((error)=>{console.log(error)})
}
const readOrders=(req,res,next)=>
{
   
}
const deleteOrders=(req,res,next)=>
{

}
const readCart=(req,res,next)=>
{
    getServicesFromCart(req.user)
    .then((services)=>{
        console.log(services, typeof services);
        res.json(services);
    })
    .catch((error)=>{console.log(error)})
}

const getServicesFromCart=async(buyer)=>
{
    var services=[];
    for(var i=0;i<buyer.cart.length;i++)
    {
        var currService=null;
        currService=await hallServiceCollection.findOne({_id:buyer.cart[i]}).populate('by');
        if(!currService)
        currService=await djServiceCollection.findOne({_id:buyer.cart[i]}).populate('by');
        if(!currService)
        currService=await cateringServiceCollection.findOne({_id:buyer.cart[i]}).populate('by');
        if(!currService)
        {
            throw new Error("inconsistency!!");
        }
        services.push(currService);
    }
    
    return services;
}


router.post("/addtocart",authCheck,addToCart);
router.post("/cart",authCheck,checkBuyer,readCart);
router.post("/removefromcart",authCheck,deleteFromCart);

module.exports=router;


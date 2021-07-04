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
    if(req.headers&&req.headers.authtoken)
    {
    admin.auth().verifyIdToken(req.headers.authtoken)
    .then((user) => {
         req.user=user;
         next();
    })
    .catch((error) => {
      console.log("error",error.message);
      res.status(401).json({message:"user unauthorised"});
    });
   }
   else
   {
     res.status(400).json({message:"bad request"});
   }
}
const checkBuyer=(req,res,next)=>
{
    if(req.user&&req.user.email)
    {
     buyerCollection.findOne({email:req.user.email})
     .then((userInDb)=>
     {
          if(userInDb)
          {
             req.user=userInDb;
             next();
          }
          else res.staus(403).json({message:"register as a buyer."});
     })
     .catch((error)=>{console.log(error)})
    }
    else
    {
        res.status(500).json({message:"internal server error"});
    }
}
const addToCart=(req,res,next)=>
{
    if(req.body&&req.user&&req.user.email)
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
            .then((savedBuyer)=>{console.log(savedBuyer);
                res.json("success");
            })
            .catch((error)=>{console.log(error);
               res.status(500).json({message:"internal server error"});
            })
           }
           else res.json("already exists");
         }
         else res.status(403).json({message:"register as a buyer"});
     })
     .catch((error)=>{console.log(error);
        res.status(500).json({message:"internal server error"});
    });
    }
    else res.status(400).json({message:"bad request"});
}
const deleteFromCart=(req,res,next)=>
{
    if(req.body&&req.user&&req.user.email)
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
            .then((savedBuyer)=>{console.log(savedBuyer);
                res.json("success");
            })
            .catch((error)=>{console.log(error);
                res.status(500).json({message:"internal server error"});
            })
           }
           else res.json("does not exist.");
         }
         else res.status(403).json("please register as a buyer");
     })
     .catch((error)=>{console.log(error);
        res.status(500).json({message:"internal server error"});
    });
    }
    else res.status(400).json({message:"bad request"});
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
    .catch((error)=>{console.log(error);
        res.status(400).json({message:"bad request"});
    })
}

const getServicesFromCart=async(buyer)=>
{
    if(buyer&&buyer.cart)
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
        if(currService)
        services.push(currService);
    }
   }
   else throw new Error("bad request");
   return services;
}


router.post("/addtocart",authCheck,checkBuyer,addToCart);
router.post("/cart",authCheck,checkBuyer,readCart);
router.post("/removefromcart",authCheck,deleteFromCart);

module.exports=router;


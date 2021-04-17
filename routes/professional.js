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
const createProduct=(req,res,next)=>
{
    const currentUser=req.user;
    const product=req.body;
    product.by=currentUser._id;
    if(currentUser.role=="Banquet Hall")
    {
         const newProduct= new hallServiceCollection(product);
         newProduct.save();
    }
    else if(currentUser.role=="Caterer")
    {
     const newProduct= new cateringServiceCollection(product);
     newProduct.save();
    }
    else if(currentUser.role=="Dj")
    {
     const newProduct= new djServiceCollection(product);
     newProduct.save();
    }
     res.send("added successfully");
}
const updateProduct=(req,res,next)=>
{
    
}
const deleteProduct=async (req,res,next)=>
{
try
{
   let deletedService;
   const currentUser=req.user;
   const service=req.body;
   if(currentUser.role=="Banquet Hall")
   {
     deletedService=await hallServiceCollection.deleteOne({_id:service._id});
   }
   else if(currentUser.role=="Caterer")
   {
     deletedService=await cateringServiceCollection.deleteOne({_id:service._id});
   }
   else if(currentUser.role=="Dj")
   {
     deletedService=await djServiceCollection.deleteOne({_id:service._id});
   }
   res.json(deletedService);
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}

}
const readProducts=async (req,res,next)=>
{
try
{
   let services=[];
   const currentUser=req.user;
   if(currentUser.role=="Banquet Hall")
   {
       services=await hallServiceCollection.find({by:currentUser._id});
   }
   else if(currentUser.role=="Caterer")
   {
     services=await cateringServiceCollection.find({by:currentUser._id});
   }
   else if(currentUser.role=="Dj")
   {
     services=await djServiceCollection.find({by:currentUser._id});
   }
   res.json(services);
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}
}



router.post("/createproduct",authCheck,checkProfessional,createProduct);
router.post("/ownedproducts",authCheck,checkProfessional,readProducts);
router.post("/deleteproduct",authCheck,checkProfessional,deleteProduct);

module.exports=router;
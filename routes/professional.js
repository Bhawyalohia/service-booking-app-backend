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
    if(currentUser.role=="Banquet Hall")
    {
         const newProduct= new hallServiceCollection(req.body);
         newProduct.save();
    }
    else if(currentUser.role=="Caterer")
    {
     const newProduct= new cateringServiceCollection(req.body);
     newProduct.save();
    }
    else if(currentUser.role=="Dj")
    {
     const newProduct= new djServiceCollection(req.body);
     newProduct.save();
    }
     res.send("added successfully");
}
const updateProduct=(req,res,next)=>
{
    
}
const deleteProduct=(req,res,next)=>
{
   
}
const readProducts=(req,res,next)=>
{

}



router.post("/createproduct",authCheck,checkProfessional,createProduct);

module.exports=router;
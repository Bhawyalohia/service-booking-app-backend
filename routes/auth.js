const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const buyerCollection=require("../models/buyerCollection.js");
const sellerCollection=require("../models/sellerCollection.js");
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
const createBuyer=(req,res,next)=>
{
  console.log("reached createorupdateuser");
  const user=req.body;
  buyerCollection.findOne({email:user.email})
  .then((userInDb)=>{
   if(userInDb){res.send("user already exists");}
   else
   { const newUser= new buyerCollection(req.body);
     newUser.save()
     .then((savedUser)=>{res.json(savedUser)})
     .catch((err)=>{console.log(error)})
    }
   })
   .catch((error)=>{console.log(error.message);});
}

const updateBuyer=(req,res,next)=>
{

}

const createProfessional=(req,res,next)=>
{
  console.log("reached createorupdateuser");
  const user=req.body;
  sellerCollection.findOne({email:user.email})
  .then((userInDb)=>{
   if(userInDb)
   {
     res.send("user already exists");
   }
   else
   {
      const newUser= new sellerCollection(req.body);
      newUser.save();  
   }
   res.send("get done");
   })
   .catch((error)=>
   {
      console.log(error.message);
   });
}

const updateProfessional=(req,res,next)=>
{
     
}

const readUser=(req,res,next)=>
{
     buyerCollection.findOne({email:req.user.email})
     .then((userInDb)=>{
         if(userInDb)
         {
          res.json(userInDb);
         }
         else {
            sellerCollection.findOne({email:req.user.email})
             .then((userInDb)=>{
                if(userInDb)
                res.json(userInDb);
                else {res.send("please register first")} 
              })
              .catch((error)=>{console.log(error)});
          } 
    })
    .catch((error)=>{console.log(error)});
};



router.post("/create-buyer",authCheck,createBuyer);
router.post("/create-professional",authCheck,createProfessional);
router.post("/update-buyer",authCheck,updateBuyer);
router.post("/update-professional",authCheck,updateProfessional);
router.post("/read-user",authCheck,readUser);
module.exports=router;
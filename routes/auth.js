const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const userCollection =require("../models/user.js");
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
const createOrUpdateUser=(req,res,next)=>
{
  console.log("reached createorupdateuser");
  const {name,email,picture}=req.user;
  userCollection.findOneAndUpdate({email},{name,picture},{new:true})
  .then((userInDb)=>{
   if(userInDb)
   {
     res.json(userInDb);
   }
   else
   {
      const newUser= new userCollection({
           email,
           name,
           picture
      });
      newUser.save();  
   }
   res.send("get done");
   })
   .catch((error)=>
   {
      console.log(error.message);
   });
}
const currentUser=(req,res,next)=>
{
    userCollection.findOne({email:req.user.email})
    .then((userInDb)=>{
         if(userInDb)
         res.json(userInDb);
         else res.json(null); 
    })
    .catch((error)=>{console.log(error)});
};
router.post("/create-or-update-user",authCheck,createOrUpdateUser);

router.post("/current-user",authCheck,currentUser);
module.exports=router;
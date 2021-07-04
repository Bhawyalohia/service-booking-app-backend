const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const buyerCollection=require("../models/buyerCollection.js");
const sellerCollection=require("../models/sellerCollection.js");


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


const createBuyer=(req,res,next)=>
{
  console.log("reached createorupdateuser");
  const user=req.body;
  if(user)
  {
  buyerCollection.findOne({email:user.email})
  .then((userInDb)=>{
   if(userInDb){res.json("user already exists");}
   else
   { const newUser= new buyerCollection(req.body);
     newUser.save()
     .then((savedUser)=>{res.json("success")})
     .catch((error)=>{
       console.log("buyer could not be saved to database:",error.message);
       res.status(500).json({message:"internal server error. please try again."});
    })
    }
   })
   .catch((error)=>{
    console.log("error in finding buyer in database:",error.message);
    res.status(500).json({message:"internal server error. please try again."});
  });
  }
  else
  {
    res.status(500).json({message:"internal server error"});
  }
}

const updateBuyer=(req,res,next)=>
{

}

const createProfessional=(req,res,next)=>
{
  console.log("reached createorupdateuser");
  const user=req.body;
  if(user&&user.email)
  {
  sellerCollection.findOne({email:user.email})
  .then((userInDb)=>{
   if(userInDb)
   {
     res.json("user already exists");
   }
   else
   {
      const newUser= new sellerCollection(req.body);
      newUser.save().then((savedUser)=>{res.json("success")})
      .catch((error)=>{console.log("error in saving user:",error); 
      res.status(500).json({message:"internal server error. please try again."});
    });  
   }
   })
   .catch((error)=>
   {
    console.log("error in finding buyer in database:",error.message);
    res.status(500).json({message:"internal server error. please try again."});
   });
  }
  else
  {
    res.status(500).json({message:"internal server error"});
  }
}

const updateProfessional=(req,res,next)=>
{
     
}

const readUser=(req,res,next)=>
{
     if(req.user&&req.user.email)
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
                    else {res.status(404).json({message:"user not found"})} 
                  })
                  .catch((error)=>{console.log(error);
                    res.status(500).json({message:"internal server error. please try again."});
                  });
              } 
        })
        .catch((error)=>{console.log(error);
          res.status(500).json({message:"internal server error. please try again."});
        });
    }
    else
    {
      res.status(500).json({message:"internal server error"});
    }
};



router.post("/create-buyer",authCheck,createBuyer);
router.post("/create-professional",authCheck,createProfessional);
router.post("/update-buyer",authCheck,updateBuyer);
router.post("/update-professional",authCheck,updateProfessional);
router.post("/read-user",authCheck,readUser);
module.exports=router;
const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const stripe=require("stripe")(process.env.STRIPE_SECRET);
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
const createPaymentIntent = async (req,res,next)=>
{
    try{
    const paymentIntent= await stripe.paymentIntents.create(
        {
            amount:100,
            currency:"inr"
        }
    )
    res.send({clientSecret:paymentIntent.client_secret})
    }
    catch(error)
    {
        console.log(error);
    }
}
router.post("/create-payment-intent",authCheck,createPaymentIntent);
module.exports=router;
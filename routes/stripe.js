const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const stripe=require("stripe")(process.env.STRIPE_SECRET);
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
const createPaymentIntent = async (req,res,next)=>
{
    try{
    const paymentIntent= await stripe.paymentIntents.create(
        {
            amount:100,
            currency:"inr"
        }
    )
     const order= await orderCollection.findOne({_id:req.body.orderId});
     order.paymentIntentId=paymentIntent.id;
     order.save().catch((err)=>{console.log(err)})
    res.send({clientSecret:paymentIntent.client_secret})
    }
    catch(error)
    {
        console.log(error);
    }
}
const readOrderOnTimeout= async (req,res,next)=>
{
try{
        const {orderId}= req.body;
        let order=await orderCollection.findOne({_id:orderId});
        let neworder=order;
        if(order.orderStatus==="ACCEPTED_BY_SELLER")
        {
          const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
          if(paymentIntent&&paymentIntent.status==="succeeded")
           paymentDone=true;
          else paymentDone=false;
          order.orderStatus="TIMEOUT";
        }
        console.log(neworder);
        res.json(neworder);
}
catch(error)
{
     console.log(error);
}
}
router.post("/create-payment-intent",authCheck,createPaymentIntent);
router.post("/check-payment-status-on-timeout",readOrderOnTimeout);
module.exports=router;
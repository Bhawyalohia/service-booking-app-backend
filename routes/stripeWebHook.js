const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const stripe=require("stripe")(process.env.STRIPE_SECRET);
const orderCollection=require("../models/orderCollection");
const withinTime=(timeOfAcceptance,timeOfPayment,range)=>
{
   const timeOfAcceptanceInSeconds=Number(timeOfAcceptance.hh)*3600+Number(timeOfAcceptance.mm)*60+Number(timeOfAcceptance.ss);
   const timeOfPaymentInSeconds=Number(timeOfPayment.hh)*3600+Number(timeOfPayment.mm)*60+Number(timeOfPayment.ss);
   console.log((timeOfPaymentInSeconds-timeOfAcceptanceInSeconds))
   if(timeOfAcceptanceInSeconds+range*60>=timeOfPaymentInSeconds)
   return true;
   return false;
}
const addToDatabase= async (clientSecret)=>
{
  const order= await orderCollection.findOne({clientSecret:clientSecret});
  const date=new Date();
  const currentTime={hh:date.getHours(), mm:date.getMinutes(), ss:date.getSeconds()};
  if(withinTime(order.timeOfAcceptance,currentTime,10))
  {
     order.orderStatus="CONFIRMED";
  }
  else order.orderStatus="TIME_OUT";
  order.timeOfPayment=currentTime;
  order.save();
  return order;
}
const handleEvents= async (req,res,next)=>
{
    try{
        const event = req.body;
        switch (event.type) {
            case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            addToDatabase(paymentIntent.client_secret);
            break;
            default:
            console.log(`Unhandled event type ${event.type}.`);
        }
        res.status(200).send();
    }
    catch(error)
    {
        console.log("error in stripe event:",error);
    }

}
router.post("/webhook",handleEvents);
module.exports=router;
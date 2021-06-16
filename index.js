const express=require("express");
const bodyParser=require("body-parser");
const morgan=require("morgan");
require("dotenv").config();
const cors=require("cors");
const mongoose=require("mongoose");
const authRouter=require("./routes/auth.js");
const professionalRouter=require("./routes/professional.js");
const servicesRouter=require("./routes/services.js");
const buyerRouter=require("./routes/buyer.js");
const ordersRouter=require("./routes/orders.js");
const paymentRouter=require("./routes/stripe.js");
const webHookRouter=require("./routes/stripeWebHook");
const app=express();

mongoose.connect(process.env.DATABASE,{
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: true
})
.then(()=>
{
    console.log("connected to database");
})
.catch((err)=>
{
   console.log(err  );
})

app.use(morgan("dev"));
app.use(bodyParser.json({limit:'50mb'}));
app.use(cors());


app.use("/api",authRouter);
app.use("/professional",professionalRouter);
app.use("/services",servicesRouter);
app.use("/buyer",buyerRouter);
app.use("/orders",ordersRouter);
app.use("/payment",paymentRouter);
app.use("/",webHookRouter);
const port=process.env.PORT||4242;



app.listen(port,(err)=>
{
if(!err)
{
  console.log("listening on port 8000");
}
});

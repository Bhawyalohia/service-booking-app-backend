const express=require("express");
const bodyParser=require("body-parser");
const morgan=require("morgan");
require("dotenv").config();
const cors=require("cors");
const mongoose=require("mongoose");
const authRouter=require("./routes/auth.js");
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
app.use(bodyParser.json());
app.use(cors());


app.use("/api",authRouter);
const port=process.env.PORT||8000;



app.listen(port,(err)=>
{
if(!err)
{
  console.log("listening on port 8000");
}
});

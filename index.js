const express=require("express");
const bodyParser=require("body-parser");
const app=express();
app.get("/",(req,res)=>
{
   res.send("hello");
});
app.listen("8000",(err)=>
{
if(!err)
{
  console.log("listening on port 8000");
}
})

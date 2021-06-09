const express=require("express");
const router=express.Router();
const admin=require("../firebase/index.js");
const userCollection =require("../models/user.js");
const buyerCollection=require("../models/buyerCollection");
const sellerCollection=require("../models/sellerCollection");
const cateringServiceCollection=require("../models/cateringServiceCollection");
const djServiceCollection=require("../models/djServiceCollection");
const hallServiceCollection=require("../models/hallServiceCollection");
const { v4: uuidv4 } = require('uuid');
// require("dotenv").config();
const AWS=require("aws-sdk");
const s3=new AWS.S3(
     {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        region:process.env.REGION 
     }
);
const uploadToS3=async (images)=>
{
     let savedImagesInS3=[];
     for(let i=0;i<images.length;i++)
     {
          console.log(images[i].Key)
          const params1={Bucket:"services-images-bhawya",
                         Key:images[i].Key}
          try
         {
         const headObject=await s3.headObject(params1).promise();
         savedImagesInS3.push(images[i]);
         console.log("found");
         }
         catch(error)
         {
             if(error.code==="NotFound"){
               console.log("notfound");
              const uri=images[i].Location.replace(/^data:image\/\w+;base64,/,"");
              const base64Data= new Buffer.from(uri,'base64');
              const type=images[i].Location.split(";")[0].split("/")[1];
              const params={
                   Bucket:"services-images-bhawya",
                   Key:`product/${uuidv4()}.${type}`,
                   Body:base64Data,
                   ACL:"public-read",
                   ContentEncoding:"base64",
                   ContentType:`image/${type}`
             }
              let data=await s3.upload(params).promise();
              savedImagesInS3.push({Key:data.Key,Location:data.Location,Bucket:data.Bucket});
             }
            else {console.log("Error");
                 throw error;}
        }
     }
     return savedImagesInS3;
}
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
const createProduct=async(req,res,next)=>
{
  try
   {
    const currentUser=req.user;
    const product=req.body;
    product.by=currentUser._id;
   
    let images=await uploadToS3(product.images);  
    product.images=images;
    console.log(product.images)
    if(currentUser.role=="Banquet Hall")
    {
         const newProduct= new hallServiceCollection(product);
         newProduct.save();
    }
    else if(currentUser.role=="Caterer")
    {
     const newProduct= new cateringServiceCollection(product);
     newProduct.save();
    }
    else if(currentUser.role=="Dj")
    {
     const newProduct= new djServiceCollection(product);
     newProduct.save();
    }
     res.send("added successfully");
    }
    catch(error)
    {
         console.log(error);
    }
}
const updateProduct= async (req,res,next)=>
{
     try
     {  let serviceDocument=null;
        const currentUser=req.user;
        const service=req.body;
        let images=await uploadToS3(service.images);  
        service.images=images;
        console.log(service.images)
        if(currentUser.role=="Banquet Hall")
        {
          serviceDocument=await hallServiceCollection.findOne({_id:service._id});
        }
        else if(currentUser.role=="Caterer")
        {
          serviceDocument=await cateringServiceCollection.findOne({_id:service._id});
        }
        else if(currentUser.role=="Dj")
        {
          serviceDocument=await djServiceCollection.findOne({_id:service._id});
        }
        let updatedService=null;
        if(serviceDocument)
        {
            serviceDocument.title=service.title;
            serviceDocument.description=service.description;
            serviceDocument.price=service.price;
            serviceDocument.images=service.images;
            updatedService= await serviceDocument.save();
        }
        else throw new Error("inconsistency!!");
        res.json(updatedService);
     }
     catch(error)
     {
          console.log(error);
          res.send("cannot read products");
     }
}
const deleteProduct=async (req,res,next)=>
{
try
{
   let deletedService;
   const currentUser=req.user;
   const service=req.body;
   if(currentUser.role=="Banquet Hall")
   {
     deletedService=await hallServiceCollection.deleteOne({_id:service._id});
   }
   else if(currentUser.role=="Caterer")
   {
     deletedService=await cateringServiceCollection.deleteOne({_id:service._id});
   }
   else if(currentUser.role=="Dj")
   {
     deletedService=await djServiceCollection.deleteOne({_id:service._id});
   }
   res.json(deletedService);
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}

}
const readProducts=async (req,res,next)=>
{
try
{
   let services=[];
   const currentUser=req.user;
   if(currentUser.role=="Banquet Hall")
   {
       services=await hallServiceCollection.find({by:currentUser._id});
   }
   else if(currentUser.role=="Caterer")
   {
     services=await cateringServiceCollection.find({by:currentUser._id});
   }
   else if(currentUser.role=="Dj")
   {
     services=await djServiceCollection.find({by:currentUser._id});
   }
   res.json(services);
}
catch(error)
{
     console.log(error);
     res.send("cannot read products");
}
}



router.post("/createproduct",authCheck,checkProfessional,createProduct);
router.post("/ownedproducts",authCheck,checkProfessional,readProducts);
router.post("/deleteproduct",authCheck,checkProfessional,deleteProduct);
router.post("/updateproduct",authCheck,checkProfessional,updateProduct);



module.exports=router;
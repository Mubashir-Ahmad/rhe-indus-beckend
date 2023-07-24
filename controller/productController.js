import productModel from "../model/productsModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import ApiFeacture from "../utils/apifeacture.js";
import cloudinary from "cloudinary";
import categoryModel from "../model/categoryModel.js";
const DATABASE_URL="mongodb+srv://mubbashirahmad:ahmad1122@the-indus.d06tuep.mongodb.net/the-indus?retryWrites=true&w=majority";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import Grid from "gridfs-stream";
import mongoose from 'mongoose'
class productController {
  // create product Admin
  static createproduct = async (req, res, next) => {
    try {
      console.log("category", req.body.category);
      const avatar = req.files.avatar;
      const { name, description, price, active, createdAt, discount_price } =
        req.body;
      const existingCategory = await categoryModel.findOne({
        Category_name: req.body.category,
      });
      // Upload the avatar image to MongoDB using GridFSBucket
      const uri = DATABASE_URL;
      const client = new MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();

      const database = client.db("TheIndus");
      const bucket = new GridFSBucket(database);

      // Read the avatar image file
      const imageBuffer = avatar.data;

      // Create a writable stream to upload the image
      const uploadStream = bucket.openUploadStream(avatar.name);

      // Write the image data to the stream
      uploadStream.write(imageBuffer);
      uploadStream.end();

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      console.log("Avatar uploaded successfully!");
      console.log("existing", existingCategory);
      const doc = new productModel({
        name: name,
        description: description,
        price: price,
        images:`${DATABASE_URL}/the-indus/${uploadStream.id}`,
        active: active,
        user: req.user._id,
        discount_price: discount_price,
        createdAt: createdAt,
        category: existingCategory,
      });
      const result = await doc.save();
      // console.log(result)
      console.log("result",result);
      res.status(201).json({
        success: true,
        message: "Product successfully save in dataBase Avatar uploaded successfully!",
        result,
      });
    } catch (err) {
      console.log("rrrerr", err);
      if (
        err.errors &&
        err.errors["avatar.url"] &&
        err.errors["avatar.public_id"]
      ) {
        // Handle validation errors for avatar.url and avatar.public_id fields
        return res.status(400).json({
          success: false,
          message: "Avatar URL and public ID are required.",
        });
      }
      res.status(400).json({ success: false, message: `Duplicate` });
    }
  };
  // Update product
  static updateproduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        stock,
        createdAt,
        discount_price,
        category,
      } = req.body;

      const existingCategory = await categoryModel.findOne({ name: category });

      if (!existingCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      let product = await productModel.findById(id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      product.name = name;
      product.description = description;
      product.price = price;
      product.stock = stock;
      product.createdAt = createdAt;
      product.discount_price = discount_price;
      product.category = existingCategory;
      (product.user = req.user._id), (product = await product.save());

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Get All Product
  // static getallproduct=async(req,res,next)=>{
  //     try{
  //         // console.log('ddd',req.query)
  //         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //         const resultperpage = 6;
  //         const productCount = await productModel.countDocuments()
  //         const apifeacture = new ApiFeacture(productModel.find(),req.query).search().filter();
  //         let data = await apifeacture.query
  //         let filteredproductcount = data.length
  //        apifeacture.pagination(resultperpage)
  //         // console.log('dataaa',data)
  //         res.status(200).json({message:"Route is working",data,productCount,resultperpage,filteredproductcount})
  //     }catch(error){
  //         // console.log(error)
  //     }
  // }

  static getallproduct = async (req, res, next) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      const resultperpage = 6;
     
      const apifeacture = new ApiFeacture(
        productModel.find().populate("category"),
        req.query
      )
        .search()
        .filter();
        let data = await apifeacture.query;
      console.log(data)
       // Create a new MongoDB connection
       const uri = DATABASE_URL;
       const client = new MongoClient(uri, { useUnifiedTopology: true });
       await client.connect();
       const database = client.db("TheIndus");
       const bucket = new GridFSBucket(database)
       const productImages = await Promise.all(
        data.map(async (product) => {
          const fileId = new ObjectId(product.images.split("/").pop());
          const downloadStream = bucket.openDownloadStream(fileId);
  
          // Create a buffer to store the image data
          let imageBuffer = Buffer.from([]);
  
          downloadStream.on("data", (chunk) => {
            imageBuffer = Buffer.concat([imageBuffer, chunk]);
          });
  
          const imagePromise = new Promise((resolve, reject) => {
            downloadStream.on("end", () => {
              const imageData = imageBuffer.toString("base64");
              const imageUrl = `data:image/jpeg;base64,${imageData}`;
              resolve(imageUrl);
            });
  
            downloadStream.on("error", (error) => {
              console.log("Error:", error);
              reject(error);
            });
          });
  
          const imageUrl = await imagePromise;
            // console.log(imageUrl)
          return { ...product.toObject(), imageUrl };
        })
      );
      
// Group products by category with category name included
const groupedProducts = productImages.reduce((acc, product) => {
  const { category } = product;
  const categoryName = category?.Category_name; // Use optional chaining (?.) to access the property safely
  if (categoryName) {
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
  }
  return acc;
}, {});

console.log(groupedProducts)
// Convert groupedProducts object to an array
const categories = Object.entries(groupedProducts).map(
  ([categoryName, products]) => ({
    categoryName,
    products,
  })
);
  console.log('cate',categories)
      res.status(200).json({
        message: "Route is working",
        data: categories,
        // categories,
        productCount: categories.length,
        resultperpage,
        // filteredproductcount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static getProductsByCategory = async (req, res, next) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  
      // Retrieve all products and populate the "category" field with the name
      const products = await productModel
        .find()
        .populate("category", "Category_name");
  
      // Create a new MongoDB connection
      const uri = DATABASE_URL;
      const client = new MongoClient(uri, { useUnifiedTopology: true });
      await client.connect();
      const database = client.db("TheIndus");
      const bucket = new GridFSBucket(database);
  
      // Retrieve images for each product and generate URLs
      const productImages = await Promise.all(
        products.map(async (product) => {
          const fileId = new ObjectId(product.images.split("/").pop());
          const downloadStream = bucket.openDownloadStream(fileId);
  
          // Create a buffer to store the image data
          let imageBuffer = Buffer.from([]);
  
          downloadStream.on("data", (chunk) => {
            imageBuffer = Buffer.concat([imageBuffer, chunk]);
          });
  
          const imagePromise = new Promise((resolve, reject) => {
            downloadStream.on("end", () => {
              const imageData = imageBuffer.toString("base64");
              const imageUrl = `data:image/jpeg;base64,${imageData}`;
              resolve(imageUrl);
            });
  
            downloadStream.on("error", (error) => {
              console.log("Error:", error);
              reject(error);
            });
          });
  
          const imageUrl = await imagePromise;
  
          return { ...product.toObject(), imageUrl };
        })
      );
  
      const resultPerPage = 6;
      const productCount = await productModel.countDocuments();
  
      // Group products by category with category name included
      const groupedProducts = productImages.reduce((acc, product) => {
        const { category } = product;
        const categoryName = category?.Category_name; // Use optional chaining (?.) to access the property safely
        if (categoryName) {
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(product);
        }
        return acc;
      }, {});
  
      // Convert groupedProducts object to an array
      const categories = Object.entries(groupedProducts).map(
        ([categoryName, products]) => ({
          categoryName,
          products,
        })
      );
  
      res.status(200).json({
        message: "Route is working",
        data: categories,
        productCount,
        resultPerPage,
      });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  static getsingleproduct = async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    console.log(req);
    let product = await productModel.findById(req.params.id);
    try {
      if (!product) {
        return next(new ErrorHandler("product not found", 404));
      }
      console.log(product)
      // res.status(200).json({
      //   success: true,
      //   product,
      // });
      //  Retrieve the avatar file from GridFS
       const uri = DATABASE_URL;
       const client = new MongoClient(uri, { useUnifiedTopology: true });
 
       await client.connect();
       const database = client.db("TheIndus");
       const bucket = new GridFSBucket(database);
       // console.log(user)
       const fileId = new ObjectId(product.images.split("/").pop());
       const downloadStream = bucket.openDownloadStream(fileId);
 
       // Create a buffer to store the image data
       let imageBuffer = Buffer.from([]);
 
       downloadStream.on("data", (chunk) => {
         imageBuffer = Buffer.concat([imageBuffer, chunk]);
       });
 
       downloadStream.on("end", () => {
         const avatarData = imageBuffer.toString("base64");
         const avatarUrl = `data:image/jpeg;base64,${avatarData}`;
 
         // Send the user details and avatar URL in the response
         res
           .status(200)
           .json({ success: true, product: { ...product._doc, avatar: avatarUrl } });
       });
        console.log(product)
       downloadStream.on("error", (error) => {
         console.log("Error:", error);
         res
           .status(500)
           .json({ success: false, message: "Internal Server Error" });
       });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: Error.errors.name.message });
    }
  };

  static deleteproduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await productModel.findById(productId);
      
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      
      // Delete the associated files from fs.files and fs.chunks collections
      const imageFiles = product.images.map((image) => image.filename);
      
      await database.collection('fs.files').deleteMany({ filename: { $in: imageFiles } });
      await database.collection('fs.chunks').deleteMany({ files_id: { $in: imageFiles } });
      
      // Delete the product from the product table
      await product.deleteOne();
      
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  static getAdminProducts = async (req, res, next) => {
    const products = await productModel.find();

    res.status(200).json({
      success: true,
      products,
    });
  };
}

export default productController;

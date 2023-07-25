import mongoose from 'mongoose'

const connectDb = async(DATABASE_URL)=>{
    try{
        const DB_OPTION={
            dbName:'TheIndus'
        }
        mongoose.set('strictQuery',true);
        await mongoose.connect(DATABASE_URL,DB_OPTION);
        console.log("Connected")
    }
    catch(err){
            console.log(err)
    }
}


export default connectDb
// import mongoose from "mongoose"

// const connectDb = async (DATABASE_URL) => {
//     try {
//       const DB_OPTION = {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         dbName: 'TheIndus',
//         serverSelectionTimeoutMS: 5000, // Optional, adjust as needed
//       };
  
//       await mongoose.connect(DATABASE_URL, DB_OPTION);
//       mongoose.connection.setMaxListeners(0); // Set maximum event listeners to unlimited
//       console.log('Connected to MongoDB Atlas');
//     } catch (err) {
//       console.error('Error connecting to MongoDB:', err);
//     }
//   };
  

// export default connectDb

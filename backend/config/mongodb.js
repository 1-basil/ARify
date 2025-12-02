import mongoose from "mongoose";

const connectDB = async () => {    
        await mongoose.connect(`${process.env.MONGODB_URI}/authentication`);
        console.log("MongoDB connected successfully");  
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);            
        } );
    }

export default connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    mongoose.connection.on("connected", () => console.log("✅ Database connected"));
    
    await Promise.race([
      mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 2,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout (8s)')), 8000)
      )
    ]);
  } catch (error) {
    console.error('⚠️ MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;

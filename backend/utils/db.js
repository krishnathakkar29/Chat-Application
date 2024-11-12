import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Connected to database successfully ${connection.connection.host}`
    );
  } catch (error) {
    console.log(`Error while connecting to DB!!`, err);
    throw error;
  }
}

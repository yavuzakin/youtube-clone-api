import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("DB connection is successfull");
  } catch (err) {
    console.log("💥 DB connection failed! 💥");
  }
};

export default connectToDb;

// import mongoose from "mongoose";

// type ConnectionObject={
//   isConnected?:number
// }

// const connection:ConnectionObject={}
//   async function dbConnect():Promise<void>{
//     if(connection.isConnected){
//       console.log("Already Conncted to the Database");
//       return;
// }
// try {
//   const db=await mongoose.connect(process.env.MONGO_URI || "");
//   connection.isConnected=db.connections[0].readyState

//   console.log("DB Connected Successfully")
// } catch (error) {
//   console.log("Database Connection is Failed ",error)
//   process.exit(1);
// }
//   }


import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {

  if (connection.isConnected) {
    console.log("Already Connected to the Database");
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    const db = await mongoose.connect(process.env.MONGO_URI);

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");

  } catch (error) {
    console.log("Database Connection Failed:", error);
    throw error;
  }
}

export default dbConnect;
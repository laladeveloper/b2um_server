import mongoose from "mongoose";
export const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      dbName: "b2umServer",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host} `))
    .catch((e) => console.log(e));
};

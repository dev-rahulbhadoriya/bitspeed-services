import dotenv from "dotenv"
import  app  from "./app.js";
import { connectDB } from './db/index.js';
const port = process.env.PORT || 3000
dotenv.config({
  path: "./.env",
});

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const startServer = () => {
  app.listen(port, () => {
    console.log("Server is running on port: " + process.env.PORT);
  });
};

if (majorNodeVersion >= 14) {
  try {
    await connectDB();
    startServer();
  } catch (err) {
    console.log("db connect error: ", err);
  }
} else {
  connectDB()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      console.log("db connect error: ", err);
    });
}

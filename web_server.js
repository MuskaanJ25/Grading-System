import db from "./routes/connections.js";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import productRoutes from "./routes/index.js";
import auth_token from "./controller/functions.js";
const app = express();

try {
    await db.authenticate();
    console.log("Database connected");
}   catch (error) {
    console.error("Connection error:", error);
}

app.use(cors());
app.use(express.json());
app.use("/courses/", auth_token);
app.use("/user/", auth_token);
app.use("/student/", auth_token);
app.use("/", productRoutes);

const port = 3000;

app.listen(port, () => {
    console.log('Running on PORT '+ port);
});

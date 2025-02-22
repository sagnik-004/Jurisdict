import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ConnectDB } from "./src/lib/db.js";
import detaineeRoutes from "./src/routes/detainee.route.js";
import lawyerRoutes from "./src/routes/lawyer.route.js";
import judgeRoutes from "./src/routes/judge.route.js";
import authRoutes from "./src/routes/auth.route.js";
import caseRoutes from "./src/routes/case.route.js"

const app = express();

app.use(
  cors({
    origin: "https://themisynctest.pages.dev",  
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], 
  })
);

app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT;

app.use("/lawyer", lawyerRoutes);
app.use("/judge", judgeRoutes);
app.use("/detainee", detaineeRoutes);
app.use("/case", caseRoutes);
app.use("/auth", authRoutes);  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  ConnectDB();
});

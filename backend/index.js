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
    origin: ["http://localhost:5173", "https://jurisdict-482c.onrender.com"], 
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

dotenv.config();

const PORT = process.env.PORT;

app.use("/auth", authRoutes);  
app.use("/case", caseRoutes);
app.use("/judge", judgeRoutes);
app.use("/lawyer", lawyerRoutes);
app.use("/detainee", detaineeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  ConnectDB();
});
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./modules/auth/routes/admin.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import patientsRoutes from "./modules/patients/routes/patients.routes.js";
import doctorsRoutes from './modules/doctors/routes/doctor.routes.js'

dotenv.config();
const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

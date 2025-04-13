import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./modules/auth/routes/admin.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import patientsRoutes from "./modules/patients/routes/patients.routes.js";
import medicinesRoutes from "./modules/medicines/routes/medicines.routes.js";
import prescriptionsRoutes from "./modules/medicines/routes/prescription.router.js";
import analyticsRoutes from "./modules/analytics/routes/analytics.routes.js";

dotenv.config();
const app = express();

console.log("✅ Allowed Origin:", process.env.WHITE_URL);

const allowedOrigins = [process.env.WHITE_URL, "https://www.patientpulse.tech"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/medicines", medicinesRoutes);
app.use("/api/prescriptions", prescriptionsRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
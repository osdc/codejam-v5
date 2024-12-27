import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import trackerRoutes from "./routes/trackerRoutes.js";
import db from "./db.js";
import Expense from "./models/trackerModel.js";
import schedule from "node-schedule";
import sgMail from "@sendgrid/mail";
import { sendDailyNotifications } from "./utils/sendNotifications.js";
const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://expense-tracker-apps.onrender.com", // frontend URL
  })
);

app.use("/auth", authRoutes);
app.use("/api", trackerRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Express app!");
});

sendDailyNotifications();//run at anytime for showcasing purpose
// schedule.scheduleJob("0 0 * * *", sendDailyNotifications);//0th minute, 0th hr which is 12 am, any day,any month,any week

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

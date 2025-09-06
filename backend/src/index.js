import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js"; 
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

// Cấu hình biến môi trường
dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 4000;

// Tạo server HTTP và khởi tạo Socket.IO
const httpServer = createServer(app);
initializeSocket(httpServer);

// Cấu hình CORS cho phép truy cập từ frontend
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

// Middleware để xử lý JSON trong request body
app.use(express.json()); 

// Middleware xác thực từ Clerk
app.use(clerkMiddleware()); 

// Cấu hình upload file
app.use(
    fileUpload({
        useTempFiles: true, // Sử dụng thư mục tạm thời
        tempFileDir: path.join(__dirname, "tmp"),
        createParentPath: true,
        limits: {
            fileSize: 10 * 1024 * 1024, // Giới hạn kích thước file 10MB
        },
    })
);

// Cron job chạy mỗi giờ để dọn dẹp thư mục tạm
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tempDir)) {
        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.log("error", err);
                return;
            }
            for (const file of files) {
                fs.unlink(path.join(tempDir, file), (err) => {});
            }
        });
    }
});

// Định nghĩa các routes API
app.use("/api/users", userRoutes);     // Route xử lý user
app.use("/api/admin", adminRoutes);    // Route xử lý admin
app.use("/api/auth", authRoutes);      // Route xử lý authentication
app.use("/api/songs", songRoutes);     // Route xử lý bài hát  
app.use("/api/albums", albumRoutes);   // Route xử lý album
app.use("/api/stats", statRoutes);     // Route xử lý thống kê

// Cấu hình cho production
if (process.env.NODE_ENV === "production") {
    // Serve static files từ thư mục build của frontend
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    // Route mặc định trả về index.html
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error('Error:', err); // Thêm log để debug
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

// Khởi động server và kết nối database
httpServer.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});

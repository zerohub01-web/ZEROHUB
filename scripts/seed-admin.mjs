import mongoose from "mongoose";
import { AdminModel } from "../apps/api/src/models/Admin.js";
import { env } from "../apps/api/src/config/env.js";

async function createAdmin() {
    try {
        await mongoose.connect("mongodb://localhost:27017/zero-os"); // Local DB path from .env

        const existing = await AdminModel.findOne({ adminId: "karthi@zeroops.in" });
        if (existing) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        await AdminModel.create({
            adminId: "karthi@zeroops.in",
            password: "admin123", // This will be hashed by the model pre-save hook
            role: "SUPER_ADMIN"
        });

        console.log("Admin 'karthi@zeroops.in' created successfully with password 'admin123'");
        process.exit(0);
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
}

createAdmin();

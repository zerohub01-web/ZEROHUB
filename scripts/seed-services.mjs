import mongoose from "mongoose";

// Simple Schema definition for the script
const serviceSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    isActive: { type: Boolean, default: true }
});

const Service = mongoose.model("Service", serviceSchema);

async function seedServices() {
    const uri = "mongodb+srv://areencholayil:areencholayil123@cluster0.nwh3j.mongodb.net/zero-os?retryWrites=true&w=majority&appName=Cluster0";

    try {
        console.log("Connecting to Atlas...");
        await mongoose.connect(uri);
        console.log("Connected.");

        const services = [
            { title: "Digital Storefront build", price: 15000, description: "Premium digital presence for brands." },
            { title: "Business Automation pipeline", price: 25000, description: "Streamlined operational workflows." },
            { title: "Digital Fortress & AI system", price: 45000, description: "Enterprise-grade security and AI." },
            { title: "Maintenance MRR plan", price: 5000, description: "Monthly support and updates." }
        ];

        for (const s of services) {
            await Service.findOneAndUpdate(
                { title: s.title },
                s,
                { upsert: true, new: true }
            );
            console.log(`Seeded: ${s.title}`);
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedServices();

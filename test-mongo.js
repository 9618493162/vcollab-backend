require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS for resolving MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log("Testing MongoDB connection...");
console.log("URI:", process.env.MONGO_URI.replace(/:[^:]*@/, ":****@"));
console.log("Using Google DNS (8.8.8.8) for resolution...");

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4
})
.then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    process.exit(0);
})
.catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log("Error:", err.message);
    process.exit(1);
});

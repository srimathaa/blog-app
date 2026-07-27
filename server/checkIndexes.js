require("dotenv").config();
const mongoose = require("mongoose");

async function checkIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const indexes = await mongoose.connection.db
            .collection("posts")
            .indexes();

        console.log("Indexes:");
        console.log(indexes);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkIndexes();
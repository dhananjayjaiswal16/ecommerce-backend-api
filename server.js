const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("database connected...")
    })
    .catch((err) => {
        console.log(err);
    })





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});
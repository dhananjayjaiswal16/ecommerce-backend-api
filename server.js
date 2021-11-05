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

//express json
app.use(express.json({ extended: false }));


//Routes
app.use('/api/user', require('./routes/users'))





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});
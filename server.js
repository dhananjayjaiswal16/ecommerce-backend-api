const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

mongoose.connect("mongodb+srv://dhananjay16:Digvijay18@cluster0.dx0so.mongodb.net/ecommerce?retryWrites=true&w=majority")
  .then(() => {
    console.log("database connected...")
  })
  .catch((err) => {
    console.log(err);
  })

//express json
app.use(express.json({ extended: false }));

app.use(cors());
//Routes
app.use('/api/user', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/product', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/order', require('./routes/order'));
app.use('/api/checkout', require('./routes/payment'));


app.get('/', (req, res) => {
  res.send('HI I am DJ');
})


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});
const express = require("express");
const app = express();
require('./dbConnect');
// const userRoutes = require('./routes/users')
const port = process.env.port || 5000;

app.use(express.json());

// importing routes
const customerRoutes = require('./routes/customer/index')
app.use('/api/customer', customerRoutes);


app.listen(port, ()=>{
console.log(`Server is running at ${port}`)
})
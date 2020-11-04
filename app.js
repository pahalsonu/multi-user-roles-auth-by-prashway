const express = require("express");
const app = express();
require('./dbConnect');
// const userRoutes = require('./routes/users')
const port = process.env.port || 5000;

app.use(express.json());
// import auth router

 
// importing routes
//customer route
const customerRoutes = require('./routes/customer/index')
app.use('/api/customer', customerRoutes);

//admin route
const adminRoutes = require('./routes/admin/index')
app.use('/api/admin', adminRoutes);

// auth router
const authROuter = require('./routes/auth')
app.use('/api/auth', authROuter);

//customer profile
const customerProfile = require('./routes/customer/profile')
app.use('/api/customer/profile', customerProfile);
app.listen(port, ()=>{
console.log(`Server is running at ${port}`)
})
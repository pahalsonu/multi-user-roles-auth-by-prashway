const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { route } = require("../admin");


/*
route : /api/customer/register
to register new customer
public route

*/

router.post('/register', [
    body("name", "Please Enter Valid Name").notEmpty().isString(),
    body("email", "Please Enter Valid EMail").isEmail(),
    body("role", "Role is neccessary").notEmpty(),
    body("password", "Password is neccessary").isLength({ min: 6 })
    
], 
async(req, res) =>{
    try{

    }catch(err){
        console.error(err);
        res.status(500).json({'Error' : 'Servor Error'})
    }
})


module.exports = router;
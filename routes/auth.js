const express = require("express");
const router = express.Router();
const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index.json");
const { body, validationResult } = require('express-validator');
const { AES } = require("crypto-js");

//Import Models
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

/*
Route : /api/auth  POST
Login User
Public Route
*/

router.post('/', [
    body("email", "Please Enter Valid EMail").isEmail(),
    body("password", "Password is Required").notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log('yes')
        const { email, password } = req.body;
      
        const customer = await Customer.findOne({ email });
        const admin = await Admin.findOne({ email });

        if (customer) {
            const isMatch = await compare(password, customer.password);
            if (!isMatch) {
                return res.status(401).json({ Error: "Invalid Password" });
            }
            //Prepare the Payload for access token
            const payload = {
                customer: customer._id,
                role: customer.role
            }
            //Create jwt access token
            const token = await jwt.sign(payload, config.SECRET_KEY, { expiresIn: 1500 });
            const cypherToken = AES.encrypt(token, config.CRYPTO_KEY).toString();
            return res.status(200).json({ token: cypherToken });
        } else if (admin) {
            const isMatch = await compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ Error: "Invalid Password" });
            }
            //Prepare the Payload for access token
            const payload = {
                admin: admin._id,
                role: admin.role
            }
            //Create jwt access token
            const token = await jwt.sign(payload, config.SECRET_KEY, { expiresIn: 1500 });
            const cypherToken = AES.encrypt(token, config.CRYPTO_KEY).toString();
            return res.status(200).json({ token: cypherToken });
        } else {
            return res.status(401).json({ Error: "Invalid Email Address" });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": "Server Error" });
    }
});


module.exports = router;
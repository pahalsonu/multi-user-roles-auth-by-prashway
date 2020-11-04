const express = require("express");
const router = express.Router();
const pug = require("pug");

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const { body, validationResult } = require('express-validator');
const { route } = require("../admin");
const { AES } = require("crypto-js");
const Mailer = require("../../controllers/mailController");
const config = require('../../config/index.json')
//Importing DB Models
const Customer = require("../../models/Customer");
const Admin = require("../../models/Admin");

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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let { name, email, role} = req.body;
            let customer = await Customer.findOne({ email });
            let admin = await Admin.findOne({ email });
            if (customer) {
                return res.status(500).json({ Error: `${email} is already registered as a Customer` });
            }
            if (admin) {
                return res.status(500).json({ Error: `${email} is already registered as an Admin` });
            }
            //hashing pass
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            let password = await bcrypt.hash(req.body.password, salt);
            const emailtoken = randomstring.generate();

            customer = new Customer({ name, email, role, emailtoken, password })
            await customer.save();
            const verifyURL = `localhost:5000/api/customer/verify/${emailtoken}`;
            const subject = 'New Product Email Verification';
            const html = pug.renderFile(__dirname + '/email.pug');
            Mailer(email, subject, html);
            //Prepare the Payload for access token 
            const payload = {
                customer: customer._id,
                role: customer.role
            };//Create jwt access token
            const token = await jwt.sign(payload, config.SECRET_KEY, { expiresIn: 50000 });
            const cypherToken = AES.encrypt(token, config.CRYPTO_KEY).toString();
            res.status(200).json({ token: cypherToken });






        } catch (err) {

            console.error(err);
            res.status(500).json({ 'Error': 'Servor Error' })
        }
    })


module.exports = router;
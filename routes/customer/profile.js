const { Router } = require("express");
const { body, validationResult } = require('express-validator');

const authMiddleware = require("../../controllers/authMiddleware");
const CustomerProfile = require("../../models/customerProfile");
// const Customer = require("../../models/Customer");
const router = Router();

/*
Route : /api/customer/profile  POST
Add Customer Profile
Private Route
*/
/*
Route : /api/customer/profile  POST
Add Customer Profile
Private Route
*/
router.post("/", [authMiddleware, [
    body("address", "Address Contains Only 150 Characters").isString().isLength({ max: 150 }),
    body("website", "Enter Valid Website").isString(),
    body("location", "Enter Valid City Name").isString(),
    body("phone", "Enter Valid Phone Number").isString()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        
        const { address, website, location, phone } = req.body;
        const newCustomer = new CustomerProfile({
            customer: req.customer.customer,
            address,
            website,
            location,
            phone
        });
        
        await newCustomer.save();
        res.status(200).json({ newCustomer });

    } catch (error) {
        console.error(err);
        res.status(500).json({ "Error": "Server Error" });
    }
})

/*
Route : /api/customer/profile  GET
Add Customer Profile
Private Route
*/
router.get("/", authMiddleware, async (req, res) => {
    try {
        const customerProfile = await CustomerProfile.findOne({
            customer: req.customer.customer
        }).populate('customer','name email -_id');
        res.status(200).json({ customerProfile });
    } catch (error) {
        console.error(err);
        res.status(500).json({ "Error": "Server Error" });
    }
})



module.exports = router;
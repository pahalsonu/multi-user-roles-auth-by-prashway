const { Router } = require("express");
const { body, validationResult } = require('express-validator');

const authMiddleware = require("../../controllers/authMiddleware");
const CustomerProfile = require("../../models/customerProfile");
const Customer = require("../../models/Customer");
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
router.post("/", authMiddleware, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const customerData = await Customer.findById(req.customer.customer);
        console.log(customerData)
        if (!customerData.active) {
            return res.status(200).json({ Message: "Email Is Not Verified. Please Verify" });
        }
        const {
            address,
            website,
            location,
            phone,
            isOpen,
            skills,
            bio,
            youtube,
            facebook,
            linkedin,
            instagram,
            twitter
        } = req.body;
        //Create a Profile Object
        const profileFields = {};
        profileFields.customer = req.customer.customer;
        if (address) profileFields.address = address;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (phone) profileFields.phone = phone;
        if (isOpen) profileFields.isOpen = isOpen;
        if (bio) profileFields.bio = bio;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;
        if (twitter) profileFields.social.twitter = twitter;

        let customerProfile = await CustomerProfile.findOne({ customer: req.customer.customer });
        if (customerProfile) {
            //Update the existing records
            customerProfile = await CustomerProfile.findOneAndUpdate(
                {
                    customer: req.customer.customer
                },
                {
                    $set: profileFields
                },
                {
                    new: true
                }
            );
            return res.status(200).json({ customerProfile });
        }
        //Create a New Profile
        customerProfile = new CustomerProfile(profileFields);
        await customerProfile.save();
        return res.status(200).json({ customerProfile });




    } catch (err) {
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
        }).populate('customer', 'name email -_id');
        res.status(200).json({ customerProfile });
    } catch (error) {
        console.error(err);
        res.status(500).json({ "Error": "Server Error" });
    }
});

/*
Route : /api/customer/profile/all  GET
Fetch All the Customer Profiles
Public Route
*/
router.get('/all', async (req, res, next) => {
    try {
        const customerProfiles = await CustomerProfile.find().populate("customer", "name email -_id");
        res.status(200).json({ customerProfiles });

    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": "Server Error" });
    }
});

/*
Route : /api/customer/profile/experience  PUT
Fetch All the Customer Profiles
Private  Route
*/
router.put("/experience", [authMiddleware, [
    body("title", "Title is Required").notEmpty(),
    body("company", "Company is Required").notEmpty(),
    body("from", "From Date is Required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        //Build Experience Object 
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        const customerProfile = await CustomerProfile.findOne({ customer: req.customer.customer });
        customerProfile.experience.unshift(newExp);
        await customerProfile.save();
        res.status(200).json({ customerProfile });


    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": "Server Error" });
    }
})


module.exports = router;
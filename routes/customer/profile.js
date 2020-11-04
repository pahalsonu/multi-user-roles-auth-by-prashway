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
                }
            );
            return res.status(200).json({ Success: "Profile Updated" });
        }
        //Create a New Profile
        customerProfile = new CustomerProfile(profileFields);
        await customerProfile.save();
        return res.status(200).json({ Success: "New Profile Created" });
        
        
       

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
})



module.exports = router;
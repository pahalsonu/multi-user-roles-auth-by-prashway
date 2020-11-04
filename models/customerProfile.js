const { Schema, model } = require("mongoose");


const customerProfileSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    address: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    phone: {
        type: String
    }

});

module.exports = model('CustomerProfile', customerProfileSchema, "customer-profiles");

/*
title,
company,
location,
from,
to,
current,(Boolean)
description
*/
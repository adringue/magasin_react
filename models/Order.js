const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema:
const OrderSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String
    },
    orderDetails: [
        {
            _id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            desiredQuantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            description: {
                type: String
            },
            total: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            qtySold: {
                type: Number,
                required: true
            },
            
            image: {
                type: String
            },
            itemID: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = Order = mongoose.model("orders", OrderSchema);
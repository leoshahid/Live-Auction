const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    currentBid: {
        type: Number,
        required: true,
        min: 0
    },
    currentBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentBidderName: {
        type: String,
        trim: true
    },
    bidIncrement: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'ended', 'cancelled'],
        default: 'pending'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number, // in milliseconds
        default: 300000 // 5 minutes
    },
    extensionTime: {
        type: Number, // in milliseconds
        default: 30000 // 30 seconds
    },
    maxBids: [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bidderName: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    bidHistory: [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bidderName: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['bid', 'max_bid'],
            default: 'bid'
        }
    }],
    winner: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: {
            type: String,
            trim: true
        },
        finalBid: {
            type: Number,
            min: 0
        },
        timestamp: {
            type: Date
        }
    },
    reservePrice: {
        type: Number,
        min: 0
    },
    reserveMet: {
        type: Boolean,
        default: false
    },
    adminNotes: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
auctionSchema.index({ status: 1, isActive: 1 });
auctionSchema.index({ vehicle: 1 });
auctionSchema.index({ startTime: 1, endTime: 1 });

// Virtual for time remaining
auctionSchema.virtual('timeRemaining').get(function () {
    if (this.status !== 'active' || !this.endTime) {
        return 0;
    }
    const remaining = this.endTime.getTime() - Date.now();
    return Math.max(0, remaining);
});

// Virtual for next bid amount
auctionSchema.virtual('nextBidAmount').get(function () {
    return this.currentBid + this.bidIncrement;
});

// Method to add bid
auctionSchema.methods.addBid = function (bidder, bidderName, amount, type = 'bid') {
    this.bidHistory.push({
        bidder,
        bidderName,
        amount,
        type,
        timestamp: new Date()
    });

    this.currentBid = amount;
    this.currentBidder = bidder;
    this.currentBidderName = bidderName;

    // Check if reserve is met
    if (this.reservePrice && amount >= this.reservePrice) {
        this.reserveMet = true;
    }

    return this.save();
};

// Method to add max bid
auctionSchema.methods.addMaxBid = function (bidder, bidderName, amount) {
    // Remove existing max bid from this user
    this.maxBids = this.maxBids.filter(bid => bid.bidder.toString() !== bidder.toString());

    // Add new max bid
    this.maxBids.push({
        bidder,
        bidderName,
        amount,
        timestamp: new Date()
    });

    // Sort max bids by amount (highest first)
    this.maxBids.sort((a, b) => b.amount - a.amount);

    return this.save();
};

// Method to process max bids
auctionSchema.methods.processMaxBids = function () {
    if (this.maxBids.length === 0) return;

    const highestMaxBid = this.maxBids[0];
    const nextBidAmount = this.currentBid + this.bidIncrement;

    if (highestMaxBid.amount >= nextBidAmount) {
        // Auto-bid up to the max bid amount
        const actualBidAmount = Math.min(highestMaxBid.amount, nextBidAmount);
        this.addBid(highestMaxBid.bidder, highestMaxBid.bidderName, actualBidAmount, 'max_bid');

        // If max bid is fully used, remove it
        if (actualBidAmount >= highestMaxBid.amount) {
            this.maxBids.shift();
        } else {
            // Update the max bid amount
            highestMaxBid.amount = actualBidAmount;
        }
    }

    return this.save();
};

module.exports = mongoose.model('Auction', auctionSchema); 
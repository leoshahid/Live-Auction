const express = require('express');
const { body } = require('express-validator');
const {
    getCurrentAuction,
    startAuction,
    placeBid,
    setMaxBid,
    endAuction,
    getAuctionHistory
} = require('../controllers/auctionController');
const { auth, adminAuth, userAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/auctions/current
// @desc    Get current active auction
// @access  Public
router.get('/current', getCurrentAuction);

// @route   POST /api/auctions/start
// @desc    Start auction (Admin only)
// @access  Private (Admin)
router.post('/start', [
    body('vehicleId')
        .notEmpty()
        .withMessage('Vehicle ID is required'),
    body('duration')
        .optional()
        .isInt({ min: 60000, max: 1800000 }) // 1 minute to 30 minutes
        .withMessage('Duration must be between 1 and 30 minutes')
], adminAuth, startAuction);

// @route   POST /api/auctions/bid
// @desc    Place bid
// @access  Private
router.post('/bid', [
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Bid amount must be a positive number')
], userAuth, placeBid);

// @route   POST /api/auctions/max-bid
// @desc    Set max bid
// @access  Private
router.post('/max-bid', [
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Max bid amount must be a positive number')
], userAuth, setMaxBid);

// @route   POST /api/auctions/end
// @desc    End auction (Admin only)
// @access  Private (Admin)
router.post('/end', adminAuth, endAuction);

// @route   GET /api/auctions/history
// @desc    Get auction history
// @access  Private
router.get('/history', auth, getAuctionHistory);

module.exports = router; 
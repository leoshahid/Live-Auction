# Auction System Backend

A real-time auction system backend built with Node.js, Express, MongoDB, and Socket.IO. This system provides live bidding functionality with authentication, real-time updates, and admin controls.

## Features

### 🔐 **Authentication & Authorization**

- JWT-based authentication
- User and Admin roles
- Secure password hashing with bcrypt
- Token-based session management

### 🚗 **Vehicle Management**

- Vehicle CRUD operations
- Vehicle status tracking (available, in_auction, sold, no_sale)
- Vehicle details with images, specifications, and pricing

### 🏆 **Live Auction System**

- Real-time bidding with Socket.IO
- Automatic auction timers
- Maximum bid functionality
- Bid history tracking
- Reserve price management
- Winner determination

### 👨‍💼 **Admin Controls**

- Start/end auctions
- Monitor live bidding
- View auction statistics
- Manage vehicles and users

### 📊 **Real-time Features**

- Live bid updates
- Countdown timers
- Auction status changes
- User notifications

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **CORS**: Cross-origin resource sharing

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── auctionController.js # Auction management
│   └── vehicleController.js # Vehicle management
├── middleware/
│   └── auth.js             # JWT authentication
├── models/
│   ├── User.js             # User schema
│   ├── Vehicle.js          # Vehicle schema
│   └── Auction.js          # Auction schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── auctions.js         # Auction routes
│   └── vehicles.js         # Vehicle routes
├── utils/
│   ├── generateToken.js    # JWT token generation
│   └── seedData.js         # Database seeding
└── server.js               # Main server file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup

1. **Clone and install dependencies:**

```bash
cd auction-backend
npm install
```

2. **Configure environment variables:**

```bash
# Copy and edit the config file
cp config.env .env
```

3. **Update the configuration:**

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/auction_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3002

# Auction Configuration
AUCTION_DURATION=300000
BID_EXTENSION_TIME=30000
```

4. **Seed the database:**

```bash
node src/utils/seedData.js
```

5. **Start the server:**

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

### Vehicles

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle (Admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin only)

### Auctions

- `GET /api/auctions/current` - Get current active auction
- `POST /api/auctions/start` - Start auction (Admin only)
- `POST /api/auctions/bid` - Place bid (User only)
- `POST /api/auctions/max-bid` - Set maximum bid (User only)
- `POST /api/auctions/end` - End auction (Admin only)
- `GET /api/auctions/history` - Get auction history (Protected)

## Socket.IO Events

### Client to Server

- `authenticate` - Authenticate user with JWT token
- `join_auction` - Join auction room
- `place_bid` - Place a bid
- `set_max_bid` - Set maximum bid
- `start_auction` - Start auction (Admin only)
- `end_auction` - End auction (Admin only)

### Server to Client

- `authenticated` - Authentication successful
- `auth_error` - Authentication failed
- `bid_update` - Real-time bid update
- `max_bid_update` - Maximum bid update
- `auction_started` - Auction started
- `auction_ended` - Auction ended
- `time_update` - Countdown timer update
- `bid_error` - Bid error
- `max_bid_error` - Max bid error
- `auction_error` - Auction error

## Demo Users

The seed script creates the following users:

### Admin

- **Email**: admin@auction.com
- **Password**: admin123
- **Role**: admin

### Regular Users

- **John Doe**: john@example.com / password123
- **Jane Smith**: jane@example.com / password123
- **Bob Wilson**: bob@example.com / password123
- **Alice Brown**: alice@example.com / password123

## Demo Vehicles

The system includes 6 sample vehicles:

1. **2021 Honda Civic EX** - Starting bid: $15,000
2. **2018 Toyota Camry SE** - Starting bid: $18,000
3. **2013 Volkswagen Jetta S** - Starting bid: $8,500
4. **2012 Toyota Corolla LE** - Starting bid: $6,500
5. **2015 Hyundai Sonata Sport** - Starting bid: $12,000
6. **2006 Chevrolet Impala LT** - Starting bid: $3,500

## Usage Flow

### Admin Flow

1. Login as admin
2. Select a vehicle to auction
3. Start the auction with desired duration
4. Monitor live bidding in real-time
5. End auction manually or let it expire
6. View auction results and winner

### User Flow

1. Register/login as user
2. View current active auction
3. Place bids or set maximum bids
4. Receive real-time updates
5. View auction history

## Real-time Features

### Live Bidding

- Real-time bid updates across all connected clients
- Automatic bid validation
- Maximum bid processing
- Bid history tracking

### Auction Timer

- Automatic countdown timer
- Time extension on new bids
- Automatic auction ending
- Real-time timer updates

### Admin Controls

- Start auctions with custom duration
- Monitor all bidding activity
- End auctions manually
- View detailed auction statistics

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with express-validator
- CORS protection
- Role-based access control
- Secure HTTP headers

## Error Handling

- Comprehensive error handling
- Validation error responses
- Authentication error handling
- Database error management
- Socket.IO error handling

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `node src/utils/seedData.js` - Seed database with sample data

### Environment Variables

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT token expiration
- `CORS_ORIGIN` - Allowed CORS origin
- `AUCTION_DURATION` - Default auction duration
- `BID_EXTENSION_TIME` - Bid extension time

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use environment variables for sensitive data
6. Set up SSL/TLS certificates
7. Configure proper logging

## API Documentation

For detailed API documentation, refer to the individual route files or use tools like Postman to test the endpoints.

## Support

For issues and questions:

- Check the console logs for error messages
- Verify MongoDB connection
- Ensure all environment variables are set
- Check CORS configuration for frontend integration

---

**Note**: This is a demo system. For production use, implement additional security measures, proper logging, monitoring, and error handling.

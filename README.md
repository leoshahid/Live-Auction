# Live Auction System - MERN Stack

A complete real-time auction system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring live bidding, WebSocket communication, and admin controls.

## 🎯 **Project Overview**

This is a modern auction system that replicates the functionality of traditional auction houses in a digital format. The system supports:

- **Real-time bidding** with WebSocket communication
- **Admin and User portals** with role-based access
- **Live auction management** with countdown timers
- **Maximum bid functionality** for automated bidding
- **Vehicle management** with detailed specifications
- **JWT authentication** for secure access

## 🏗️ **Architecture**

```
├── auction-simulcast/     # React Frontend (Port 3002)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API and WebSocket services
│   │   └── App.tsx        # Main application
│   └── package.json
│
├── auction-backend/       # Node.js Backend (Port 3001)
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Authentication
│   │   └── server.js      # Main server
│   └── package.json
│
└── README.md
```

## 🚀 **Quick Start**

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd auction-backend

# Install dependencies
npm install

# Configure environment (edit config.env)
cp config.env .env

# Seed the database with sample data
node src/utils/seedData.js

# Start the development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd auction-simulcast

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3002`

## 🔐 **Demo Credentials**

### Admin User

- **Email**: admin@auction.com
- **Password**: admin123
- **Role**: Admin (can start/end auctions)

### Regular Users

- **John Doe**: john@example.com / password123
- **Jane Smith**: jane@example.com / password123
- **Bob Wilson**: bob@example.com / password123
- **Alice Brown**: alice@example.com / password123

## 🚗 **Demo Vehicles**

The system includes 6 sample vehicles:

1. **2021 Honda Civic EX** - Starting bid: $15,000
2. **2018 Toyota Camry SE** - Starting bid: $18,000
3. **2013 Volkswagen Jetta S** - Starting bid: $8,500
4. **2012 Toyota Corolla LE** - Starting bid: $6,500
5. **2015 Hyundai Sonata Sport** - Starting bid: $12,000
6. **2006 Chevrolet Impala LT** - Starting bid: $3,500

## 🎮 **How to Demo**

### Admin Flow

1. **Login as admin** using admin@auction.com / admin123
2. **View available vehicles** in the grid
3. **Start an auction** by clicking "Start Auction" button
4. **Select a vehicle** and set auction duration (1-15 minutes)
5. **Monitor live bidding** in real-time
6. **End auction** manually or let it expire automatically

### User Flow

1. **Login as a regular user** (e.g., john@example.com / password123)
2. **View current auction** if one is active
3. **Place bids** using the "Bid" button
4. **Set maximum bids** for automated bidding
5. **Watch real-time updates** of current bid and time remaining

### Multi-User Demo

1. **Open multiple browser tabs/windows**
2. **Login with different users** (admin + 2-3 regular users)
3. **Start an auction** as admin
4. **Have users bid against each other** in real-time
5. **Observe live updates** across all connected clients

## 🔧 **Key Features**

### Real-time Communication

- **Socket.IO** for live bid updates
- **Automatic countdown timers**
- **Real-time auction status changes**
- **Live bidder notifications**

### Authentication & Security

- **JWT token-based authentication**
- **Role-based access control** (Admin/User)
- **Password hashing** with bcrypt
- **Secure API endpoints**

### Auction Management

- **Single auction at a time** (as per requirements)
- **Automatic auction ending** with timer
- **Maximum bid processing**
- **Bid history tracking**
- **Winner determination**

### User Interface

- **Material-UI** components for modern design
- **Responsive grid layout**
- **Real-time status indicators**
- **Interactive bidding interface**

## 📡 **API Endpoints**

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Vehicles

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)

### Auctions

- `GET /api/auctions/current` - Get current active auction
- `POST /api/auctions/start` - Start auction (Admin)
- `POST /api/auctions/bid` - Place bid (User)
- `POST /api/auctions/max-bid` - Set maximum bid (User)
- `POST /api/auctions/end` - End auction (Admin)
- `GET /api/auctions/history` - Get auction history

## 🔌 **WebSocket Events**

### Client to Server

- `authenticate` - Authenticate user with JWT token
- `join_auction` - Join auction room
- `place_bid` - Place a bid
- `set_max_bid` - Set maximum bid
- `start_auction` - Start auction (Admin)
- `end_auction` - End auction (Admin)

### Server to Client

- `authenticated` - Authentication successful
- `bid_update` - Real-time bid update
- `max_bid_update` - Maximum bid update
- `auction_started` - Auction started
- `auction_ended` - Auction ended
- `time_update` - Countdown timer update

## 🛠️ **Technology Stack**

### Frontend

- **React 18** with TypeScript
- **Material-UI** for UI components
- **Socket.IO Client** for real-time communication
- **React Hooks** for state management

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for WebSocket server
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation

### Database

- **MongoDB** for data persistence
- **Mongoose** for schema management
- **Indexes** for performance optimization

## 📁 **Project Structure**

### Frontend Structure

```
auction-simulcast/
├── src/
│   ├── components/
│   │   ├── Login.tsx           # Authentication component
│   │   ├── TopNavbar.tsx       # Navigation bar
│   │   ├── SimulcastGrid.tsx   # Main grid layout
│   │   └── SimulcastTile.tsx   # Individual auction tile
│   ├── services/
│   │   ├── ApiService.ts       # HTTP API client
│   │   └── WebSocketService.ts # WebSocket client
│   ├── App.tsx                 # Main application
│   └── App.css                 # Global styles
└── package.json
```

### Backend Structure

```
auction-backend/
├── src/
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Vehicle.js          # Vehicle schema
│   │   └── Auction.js          # Auction schema
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── auctionController.js # Auction management
│   │   └── vehicleController.js # Vehicle management
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── auctions.js         # Auction routes
│   │   └── vehicles.js         # Vehicle routes
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── utils/
│   │   ├── generateToken.js    # JWT token generation
│   │   └── seedData.js         # Database seeding
│   └── server.js               # Main server
└── package.json
```

## 🔧 **Configuration**

### Environment Variables (Backend)

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

## 🚀 **Deployment**

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use environment variables for sensitive data

### Frontend Deployment

1. Update API_BASE_URL in ApiService.ts
2. Update WebSocket URL in WebSocketService.ts
3. Build the application: `npm run build`
4. Deploy to your preferred hosting service

## 🐛 **Troubleshooting**

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check MONGODB_URI in config.env
   - Verify network connectivity

2. **WebSocket Connection Error**

   - Check if backend server is running
   - Verify CORS configuration
   - Check firewall settings

3. **Authentication Issues**

   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user credentials

4. **Port Conflicts**
   - Ensure ports 3002 and 3001 are available
   - Check for other running services

## 📝 **Development Notes**

### Database Seeding

The system includes a seed script that creates:

- 1 admin user
- 4 regular users
- 6 sample vehicles

Run `node src/utils/seedData.js` to populate the database.

### Real-time Features

- Bids are processed in real-time
- Countdown timers update every second
- Auction status changes are broadcast immediately
- Maximum bids are processed automatically

### Security Considerations

- JWT tokens are stored in localStorage
- Passwords are hashed with bcrypt
- API endpoints are protected with middleware
- Input validation is implemented

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is for demonstration purposes. Please ensure you have proper licensing for production use.

---

**Note**: This is a demo system built for client presentation. For production use, implement additional security measures, proper logging, monitoring, and error handling.

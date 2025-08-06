import { io, Socket } from "socket.io-client";

export interface BidUpdate {
  vehicleId: string;
  currentBid: number;
  bidIncrement: number;
  status: "not_started" | "bidding" | "sold" | "no_sale";
  timeRemaining?: number;
  bidder?: string;
}

export interface VehicleUpdate {
  id: string;
  runNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  mileageType: string;
  color: string;
  seller: string;
  currentBid: number;
  bidIncrement: number;
  status: "not_started" | "bidding" | "sold" | "no_sale";
  timeRemaining?: number;
  images: string[];
}

export interface ChatMessage {
  vehicleId: string;
  message: string;
  sender: string;
  timestamp: Date;
}

export interface AuctionStats {
  totalBids: number;
  uniqueBidders: number;
  averageBidAmount: number;
  highestBid: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
}

export interface Auction {
  _id: string;
  vehicle: VehicleUpdate;
  currentBid: number;
  currentBidder?: string;
  currentBidderName?: string;
  bidIncrement: number;
  status: "pending" | "active" | "ended" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  timeRemaining?: number;
  winner?: {
    user: string;
    userName: string;
    finalBid: number;
    timestamp: Date;
  };
  reservePrice?: number;
  reserveMet: boolean;
  bidHistory: Array<{
    bidder: string;
    bidderName: string;
    amount: number;
    timestamp: Date;
    type: "bid" | "max_bid";
  }>;
}

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Event callbacks
  private onBidUpdateCallbacks: ((data: any) => void)[] = [];
  private onMaxBidUpdateCallbacks: ((data: any) => void)[] = [];
  private onAuctionStartedCallbacks: ((data: any) => void)[] = [];
  private onAuctionEndedCallbacks: ((data: any) => void)[] = [];
  private onTimeUpdateCallbacks: ((timeRemaining: number) => void)[] = [];
  private onErrorCallbacks: ((error: string) => void)[] = [];
  private onAuthenticatedCallbacks: ((user: User) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const socketUrl = process.env.REACT_APP_WS_URL || "http://localhost:3001";
      this.socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to auction server");
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Authenticate if we have a token (either in memory or localStorage)
      const token = this.token || this.getStoredToken();
      if (token) {
        console.log("Auto-authenticating with stored token");
        this.authenticate(token);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from auction server");
      this.isConnected = false;
    });

    this.socket.on("authenticated", (data: { user: User }) => {
      console.log("Authenticated:", data.user);
      this.onAuthenticatedCallbacks.forEach((callback) => callback(data.user));
    });

    this.socket.on("auth_error", (data: { message: string }) => {
      console.error("Authentication error:", data.message);
      this.onErrorCallbacks.forEach((callback) => callback(data.message));
    });

    this.socket.on("bid_update", (data: any) => {
      console.log("WebSocket: Bid update received:", data);
      console.log(
        "WebSocket: Number of callbacks:",
        this.onBidUpdateCallbacks.length
      );
      this.onBidUpdateCallbacks.forEach((callback) => callback(data));
    });

    this.socket.on("max_bid_update", (data: any) => {
      console.log("Max bid update received:", data);
      this.onMaxBidUpdateCallbacks.forEach((callback) => callback(data));
    });

    this.socket.on("auction_started", (data: any) => {
      console.log("=== WEBSOCKET: AUCTION STARTED EVENT RECEIVED ===");
      console.log("WebSocket: Auction started data:", data);
      console.log(
        "WebSocket: Number of auction started callbacks:",
        this.onAuctionStartedCallbacks.length
      );
      this.onAuctionStartedCallbacks.forEach((callback, index) => {
        console.log(`WebSocket: Calling auction started callback ${index}`);
        callback(data);
      });
      console.log("=== END WEBSOCKET: AUCTION STARTED EVENT ===");
    });

    this.socket.on("auction_ended", (data: any) => {
      console.log("Auction ended:", data);
      this.onAuctionEndedCallbacks.forEach((callback) => callback(data));
    });

    this.socket.on("time_update", (data: { timeRemaining: number }) => {
      this.onTimeUpdateCallbacks.forEach((callback) =>
        callback(data.timeRemaining)
      );
    });

    this.socket.on("bid_error", (data: { message: string }) => {
      console.error("Bid error:", data.message);
      this.onErrorCallbacks.forEach((callback) => callback(data.message));
    });

    this.socket.on("max_bid_error", (data: { message: string }) => {
      console.error("Max bid error:", data.message);
      this.onErrorCallbacks.forEach((callback) => callback(data.message));
    });

    this.socket.on("auction_error", (data: { message: string }) => {
      console.error("Auction error:", data.message);
      this.onErrorCallbacks.forEach((callback) => callback(data.message));
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.onErrorCallbacks.forEach((callback) =>
          callback("Failed to connect to auction server")
        );
      }
    });
  }

  // Authentication
  authenticate(token: string) {
    this.token = token;
    // Store token in localStorage for persistence (use same key as API service)
    localStorage.setItem("authToken", token);

    if (this.socket && this.isConnected) {
      console.log("Authenticating with token:", token);
      console.log("Token type:", typeof token);
      console.log("Token length:", token.length);
      this.socket.emit("authenticate", token);
    } else {
      console.log("Socket not connected, will authenticate when connected");
    }
  }

  // Get stored token from localStorage
  getStoredToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Clear stored token
  clearStoredToken() {
    localStorage.removeItem("authToken");
    this.token = null;
  }

  // Join auction room
  joinAuction() {
    if (this.socket && this.isConnected) {
      this.socket.emit("join_auction");
    }
  }

  // Place bid
  placeBid(amount: number) {
    console.log("WebSocket: Emitting place_bid event with amount:", amount);
    console.log("WebSocket: Socket connected:", this.isConnected);
    if (this.socket && this.isConnected) {
      this.socket.emit("place_bid", { amount });
      console.log("WebSocket: place_bid event emitted");
    } else {
      console.log("WebSocket: Not connected, cannot emit place_bid");
      this.onErrorCallbacks.forEach((callback) =>
        callback("Not connected to auction server")
      );
    }
  }

  // Set max bid
  setMaxBid(amount: number) {
    console.log("WebSocket: Emitting set_max_bid event with amount:", amount);
    console.log("WebSocket: Socket connected:", this.isConnected);
    if (this.socket && this.isConnected) {
      this.socket.emit("set_max_bid", { amount });
      console.log("WebSocket: set_max_bid event emitted");
    } else {
      console.log("WebSocket: Not connected, cannot emit set_max_bid");
      this.onErrorCallbacks.forEach((callback) =>
        callback("Not connected to auction server")
      );
    }
  }

  // Admin: Start auction
  startAuction(vehicleId: string, duration: number = 300000) {
    console.log("WebSocket: Emitting start_auction event:", {
      vehicleId,
      duration,
    });
    console.log("WebSocket: Socket connected:", this.isConnected);
    if (this.socket && this.isConnected) {
      this.socket.emit("start_auction", { vehicleId, duration });
      console.log("WebSocket: start_auction event emitted");
    } else {
      console.log("WebSocket: Not connected, cannot emit start_auction");
      this.onErrorCallbacks.forEach((callback) =>
        callback("Not connected to auction server")
      );
    }
  }

  // Admin: End auction
  endAuction() {
    console.log("WebSocket: Emitting end_auction event");
    console.log("WebSocket: Socket connected:", this.isConnected);
    if (this.socket && this.isConnected) {
      this.socket.emit("end_auction");
      console.log("WebSocket: end_auction event emitted");
    } else {
      console.log("WebSocket: Not connected, cannot emit end_auction");
      this.onErrorCallbacks.forEach((callback) =>
        callback("Not connected to auction server")
      );
    }
  }

  // Event listeners
  onBidUpdate(callback: (data: any) => void) {
    this.onBidUpdateCallbacks.push(callback);
  }

  onMaxBidUpdate(callback: (data: any) => void) {
    this.onMaxBidUpdateCallbacks.push(callback);
  }

  onAuctionStarted(callback: (data: any) => void) {
    this.onAuctionStartedCallbacks.push(callback);
  }

  onAuctionEnded(callback: (data: any) => void) {
    this.onAuctionEndedCallbacks.push(callback);
  }

  onTimeUpdate(callback: (timeRemaining: number) => void) {
    this.onTimeUpdateCallbacks.push(callback);
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallbacks.push(callback);
  }

  onAuthenticated(callback: (user: User) => void) {
    this.onAuthenticatedCallbacks.push(callback);
  }

  // Remove event listeners
  removeBidUpdateListener(callback: (data: any) => void) {
    this.onBidUpdateCallbacks = this.onBidUpdateCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  removeMaxBidUpdateListener(callback: (data: any) => void) {
    this.onMaxBidUpdateCallbacks = this.onMaxBidUpdateCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  removeAuctionStartedListener(callback: (data: any) => void) {
    this.onAuctionStartedCallbacks = this.onAuctionStartedCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  removeAuctionEndedListener(callback: (data: any) => void) {
    this.onAuctionEndedCallbacks = this.onAuctionEndedCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  removeTimeUpdateListener(callback: (timeRemaining: number) => void) {
    this.onTimeUpdateCallbacks = this.onTimeUpdateCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  removeErrorListener(callback: (error: string) => void) {
    this.onErrorCallbacks = this.onErrorCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  removeAuthenticatedListener(callback: (user: User) => void) {
    this.onAuthenticatedCallbacks = this.onAuthenticatedCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.token = null;
  }

  // Get connection status
  isSocketConnected(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;

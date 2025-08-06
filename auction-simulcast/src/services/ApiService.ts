const API_BASE_URL = "http://localhost:3001/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "user" | "admin";
}

export interface LoginResponse {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  token: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
}

export interface Vehicle {
  _id: string;
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
  description: string;
  images: string[];
  startingBid: number;
  bidIncrement: number;
  reservePrice?: number;
  status: "available" | "in_auction" | "sold" | "no_sale";
  condition: "excellent" | "good" | "fair" | "poor";
  features: string[];
  isActive: boolean;
}

export interface Auction {
  _id: string;
  vehicle: Vehicle;
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

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("authToken");
      console.log("Retrieved token from localStorage:", !!this.token);
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("Token found and added to headers, length:", token.length);
    } else {
      console.log("No token found in headers");
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log(`Making API request to: ${url}`);
    console.log("Request headers:", config.headers);

    try {
      const response = await fetch(url, config);
      console.log(`Response status: ${response.status} for ${endpoint}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;

        console.log(`API error for ${endpoint}:`, errorMessage);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        // If it's an authentication error, clear the token
        if (response.status === 401 || response.status === 403) {
          console.log("Authentication error, clearing token");
          this.clearToken();
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`API success for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return this.request<Vehicle[]>("/vehicles");
  }

  async getVehicle(id: string): Promise<Vehicle> {
    return this.request<Vehicle>(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.request<Vehicle>("/vehicles", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(
    id: string,
    vehicleData: Partial<Vehicle>
  ): Promise<Vehicle> {
    return this.request<Vehicle>(`/vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/vehicles/${id}`, {
      method: "DELETE",
    });
  }

  // Auctions
  async getCurrentAuction(): Promise<Auction> {
    return this.request<Auction>("/auctions/current");
  }

  async startAuction(vehicleId: string, duration?: number): Promise<Auction> {
    console.log(
      "Starting auction for vehicle:",
      vehicleId,
      "with duration:",
      duration
    );
    console.log("Current token:", this.getToken());
    return this.request<Auction>("/auctions/start", {
      method: "POST",
      body: JSON.stringify({ vehicleId, duration }),
    });
  }

  async placeBid(amount: number): Promise<Auction> {
    return this.request<Auction>("/auctions/bid", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  }

  async setMaxBid(amount: number): Promise<Auction> {
    return this.request<Auction>("/auctions/max-bid", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  }

  async endAuction(): Promise<Auction> {
    return this.request<Auction>("/auctions/end", {
      method: "POST",
    });
  }

  async getAuctionHistory(): Promise<Auction[]> {
    return this.request<Auction[]>("/auctions/history");
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/health");
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;

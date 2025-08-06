import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Alert, Snackbar } from "@mui/material";
import TopNavbar from "./components/TopNavbar";
import SimulcastGrid from "./components/SimulcastGrid";
import Login from "./components/Login";
import apiService from "./services/ApiService";
import webSocketService from "./services/WebSocketService";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7FB5E2",
    },
    secondary: {
      main: "#ED7115",
    },
    background: {
      default: "#141958",
      paper: "#2C376F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B3B3B3",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAuction, setCurrentAuction] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");

  // Debug effect to log currentAuction changes
  useEffect(() => {
    console.log("Current auction state changed:", currentAuction);
  }, [currentAuction]);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiService.getToken();
    console.log("Initial auth check - Token found:", !!token);
    if (token) {
      console.log("Token exists, checking auth status...");
      checkAuthStatus();
    } else {
      console.log("No token found, showing login screen");
      setLoading(false);
    }
  }, []);

  // Add retry mechanism for network errors
  useEffect(() => {
    const handleOnline = () => {
      console.log("Network is back online, retrying authentication...");
      const token = apiService.getToken();
      if (token && !user) {
        checkAuthStatus();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log("Setting up WebSocket listeners for user:", user.username);

      // Set up WebSocket listeners
      const onAuthenticated = (user: any) => {
        console.log("WebSocket authenticated:", user);
      };

      const onBidUpdate = (data: any) => {
        console.log("Bid update received:", data);
        console.log("Current auction before update:", currentAuction);
        setCurrentAuction(data.auction);
        console.log("Current auction after update:", data.auction);
      };

      const onMaxBidUpdate = (data: any) => {
        console.log("Max bid update:", data);
        setCurrentAuction(data.auction);
      };

      const onAuctionStarted = (data: any) => {
        console.log("=== AUCTION STARTED EVENT RECEIVED ===");
        console.log("Auction started data:", data);
        console.log("Current auction before update:", currentAuction);
        console.log("Setting current auction to:", data.auction);

        setCurrentAuction(data.auction);
        setError("Auction started!");

        // Refresh vehicles list to update status
        console.log("Refreshing vehicles list...");
        loadInitialData();

        console.log("=== END AUCTION STARTED EVENT ===");
      };

      const onAuctionEnded = (data: any) => {
        console.log("Auction ended:", data);
        setCurrentAuction(data.auction);
        setError(
          `Auction ended! Winner: ${
            data.auction.winner?.userName || "No winner"
          }`
        );
      };

      const onTimeUpdate = (timeRemaining: number) => {
        console.log("Time update:", timeRemaining);
        if (currentAuction) {
          setCurrentAuction((prev: any) => ({
            ...prev,
            timeRemaining,
          }));
        }
      };

      const onError = (error: string) => {
        console.log("WebSocket error:", error);
        setError(error);
      };

      // Register listeners
      webSocketService.onAuthenticated(onAuthenticated);
      webSocketService.onBidUpdate(onBidUpdate);
      webSocketService.onMaxBidUpdate(onMaxBidUpdate);
      webSocketService.onAuctionStarted(onAuctionStarted);
      webSocketService.onAuctionEnded(onAuctionEnded);
      webSocketService.onTimeUpdate(onTimeUpdate);
      webSocketService.onError(onError);

      // Join auction room
      console.log("Joining auction room...");
      webSocketService.joinAuction();

      // Test WebSocket connection
      console.log("WebSocket connected:", webSocketService.isSocketConnected());

      // Load initial data
      loadInitialData();

      return () => {
        console.log("Cleaning up WebSocket listeners");
        // Clean up WebSocket listeners
        webSocketService.removeBidUpdateListener(onBidUpdate);
        webSocketService.removeMaxBidUpdateListener(onMaxBidUpdate);
        webSocketService.removeAuctionStartedListener(onAuctionStarted);
        webSocketService.removeAuctionEndedListener(onAuctionEnded);
        webSocketService.removeTimeUpdateListener(onTimeUpdate);
        webSocketService.removeErrorListener(onError);
        webSocketService.removeAuthenticatedListener(onAuthenticated);
      };
    }
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      console.log("Starting auth check...");
      const user = await apiService.getCurrentUser();
      console.log("Auth check successful, user:", user);
      setUser(user);

      // Authenticate WebSocket with the same token
      const token = apiService.getToken();
      if (token) {
        console.log("Authenticating WebSocket...");
        webSocketService.authenticate(token);
      }

      console.log("Authentication successful for user:", user.username);
    } catch (error: any) {
      console.error("Auth check failed:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Only clear token if it's an authentication error (401, 403)
      if (
        error.message &&
        (error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("Unauthorized"))
      ) {
        console.log("Token is invalid, clearing...");
        apiService.clearToken();
        webSocketService.clearStoredToken();
      } else {
        console.log("Network error, keeping token for retry");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // Load vehicles
      const vehiclesData = await apiService.getVehicles();
      setVehicles(vehiclesData);

      // Load current auction only if not already set
      if (!currentAuction) {
        try {
          const auction = await apiService.getCurrentAuction();
          setCurrentAuction(auction);
        } catch (error) {
          // No active auction
          console.log("No active auction");
        }
      }
    } catch (error) {
      console.error("Failed to load initial data:", error);
      setError("Failed to load data");
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setError(null);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentAuction(null);
    setVehicles([]);
    apiService.clearToken();
    webSocketService.clearStoredToken();
    webSocketService.disconnect();
  };

  const handleBid = async (vehicleId: string, amount: number) => {
    try {
      console.log("Placing bid via WebSocket:", amount);
      webSocketService.placeBid(amount);
    } catch (error: any) {
      setError(error.message || "Failed to place bid");
    }
  };

  const handleSetMaxBid = async (vehicleId: string, amount: number) => {
    try {
      console.log("Setting max bid via WebSocket:", amount);
      webSocketService.setMaxBid(amount);
    } catch (error: any) {
      setError(error.message || "Failed to set max bid");
    }
  };

  const handleStartAuction = async (
    vehicleId: string,
    duration: number = 300000
  ) => {
    try {
      console.log("Starting auction via WebSocket:", vehicleId, duration);
      webSocketService.startAuction(vehicleId, duration);
      setError("Starting auction...");
    } catch (error: any) {
      setError(error.message || "Failed to start auction");
    }
  };

  const handleEndAuction = async () => {
    try {
      console.log("Ending auction via WebSocket");
      webSocketService.endAuction();
      setError("Ending auction...");
    } catch (error: any) {
      setError(error.message || "Failed to end auction");
    }
  };

  const handleWatch = (vehicleId: string) => {
    // Implement watch functionality
    console.log("Watching vehicle:", vehicleId);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #141958 0%, #2C376F 100%)",
          }}
        >
          Loading...
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <TopNavbar
          auctionName="Live Auction System"
          userName={`${user.firstName} ${user.lastName}`}
          userRole={user.role}
          onLogout={handleLogout}
          currentAuction={currentAuction}
          onStartAuction={handleStartAuction}
          onEndAuction={handleEndAuction}
          vehicles={vehicles}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <SimulcastGrid
          vehicles={vehicles}
          currentAuction={currentAuction}
          user={user}
          onBid={handleBid}
          onSetMaxBid={handleSetMaxBid}
          onStartAuction={handleStartAuction}
          onWatch={handleWatch}
          viewMode={viewMode}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setError(null)}
            severity={error?.includes("successfully") ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;

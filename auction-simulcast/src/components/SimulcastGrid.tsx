import React, { useState, useEffect } from "react";
import { Box, Alert, Snackbar } from "@mui/material";
import SimulcastTile from "./SimulcastTile";
import DetailedSimulcastTile from "./DetailedSimulcastTile";
import AuctionView from "./AuctionView";

interface Vehicle {
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

interface Auction {
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

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
}

interface SimulcastGridProps {
  vehicles: Vehicle[];
  currentAuction?: Auction;
  user: User;
  onBid: (vehicleId: string, amount: number) => void;
  onSetMaxBid: (vehicleId: string, amount: number) => void;
  onStartAuction: (vehicleId: string, duration?: number) => void;
  onWatch: (vehicleId: string) => void;
  viewMode?: "compact" | "detailed";
}

const SimulcastGrid: React.FC<SimulcastGridProps> = ({
  vehicles,
  currentAuction,
  user,
  onBid,
  onSetMaxBid,
  onStartAuction,
  onWatch,
  viewMode = "compact",
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleBid = (vehicleId: string, amount: number) => {
    try {
      onBid(vehicleId, amount);
    } catch (error: any) {
      setError(error.message || "Failed to place bid");
    }
  };

  const handleSetMaxBid = (vehicleId: string, amount: number) => {
    try {
      onSetMaxBid(vehicleId, amount);
    } catch (error: any) {
      setError(error.message || "Failed to set max bid");
    }
  };

  const handleWatch = (vehicleId: string) => {
    try {
      onWatch(vehicleId);
    } catch (error: any) {
      setError(error.message || "Failed to watch vehicle");
    }
  };

  // Filter vehicles based on current auction
  const displayVehicles = currentAuction
    ? [currentAuction.vehicle] // Show only the auction vehicle
    : vehicles.filter((v) => v.status === "available"); // Show available vehicles

  return (
    <>
      {/* Show AuctionView when there's an active auction */}
      {currentAuction && currentAuction.status === "active" ? (
        <AuctionView
          auction={currentAuction}
          user={user}
          onBid={handleBid}
          onSetMaxBid={handleSetMaxBid}
        />
      ) : (
        /* Show regular grid for available vehicles */
        <Box
          className={`simulcast-grid ${
            viewMode === "detailed" ? "detailed-view" : "compact-view"
          }`}
        >
          {displayVehicles.map((vehicle) => {
            // Check if this vehicle is currently being auctioned
            const isAuctionVehicle =
              currentAuction?.vehicle._id === vehicle._id;
            const auctionData = isAuctionVehicle ? currentAuction : null;

            return (
              <Box key={vehicle._id}>
                {viewMode === "detailed" ? (
                  <DetailedSimulcastTile
                    vehicle={vehicle}
                    auction={auctionData}
                    user={user}
                    onBid={handleBid}
                    onSetMaxBid={handleSetMaxBid}
                    onStartAuction={onStartAuction}
                    onWatch={handleWatch}
                  />
                ) : (
                  <SimulcastTile
                    vehicle={vehicle}
                    auction={auctionData}
                    user={user}
                    onBid={handleBid}
                    onSetMaxBid={handleSetMaxBid}
                    onStartAuction={onStartAuction}
                    onWatch={handleWatch}
                  />
                )}
              </Box>
            );
          })}

          {displayVehicles.length === 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
              }}
            >
              {currentAuction
                ? "No active auction found"
                : "No vehicles available for auction"}
            </Box>
          )}
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SimulcastGrid;

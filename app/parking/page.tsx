"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Car, Square, Wifi, WifiOff } from "lucide-react";

const ParkingStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastData, setLastData] = useState<{
    output: number;
    client_id?: string;
  } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    console.log("Attempting to connect to server...");
    const socket = io("http://127.0.0.1:5000", { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to server successfully");
      setIsConnected(true);
      setLastError(null);
    });

    socket.on("connect_error", (error: { message: any }) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
      setLastError(`WebSocket error: ${error.message}`);
    });

    socket.on("update_data", (data: { output: number }) => {
      console.log("Received data:", data);
      setLastData(data);
      if (data) {
        updateParkingSlots(data.output);
      }
    });

    socket.on("disconnect", (reason: any) => {
      console.log("Disconnected from server:", reason);
      setIsConnected(false);
      setLastError(`Disconnected: ${reason}`);
    });

    return () => {
      console.log("Cleaning up socket connection");
      socket.disconnect();
    };
  }, []);

  const updateParkingSlots = (availableSlots: number) => {
    const slots = Array(5).fill(false);
    for (let i = 0; i < Math.min(availableSlots, 5); i++) {
      slots[i] = true;
    }
    setParkingSlots(slots);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Parking Status</h1>
          <div className="flex items-center">
            {isConnected ? (
              <Wifi className="mr-2 text-green-300" />
            ) : (
              <WifiOff className="mr-2 text-red-300" />
            )}
            <span className="text-lg">
              {isConnected ? "Connected to server" : "Disconnected from server"}
            </span>
          </div>
          {lastError && (
            <p className="text-sm text-red-300 mt-2 animate-pulse">
              {lastError}
            </p>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-800">
            Parking Slots
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {parkingSlots.map((isAvailable, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                  isAvailable
                    ? "bg-gradient-to-br from-green-400 to-green-600"
                    : "bg-gradient-to-br from-red-400 to-red-600"
                }`}
              >
                <span className="text-2xl mb-2">Slot {index + 1}</span>
                {isAvailable ? (
                  <Square size={40} className="animate-pulse" />
                ) : (
                  <Car size={40} className="animate-bounce" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 mr-3"></div>
              <span className="text-lg text-gray-700">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 mr-3"></div>
              <span className="text-lg text-gray-700">Occupied</span>
            </div>
          </div>
        </div>

        {lastData && (
          <div className="bg-gray-100 p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
              Last Received Data
            </h2>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-lg mb-2">
                <span className="font-semibold text-indigo-600">
                  Client ID:
                </span>{" "}
                {lastData.client_id}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold text-indigo-600">
                  Available Slots:
                </span>{" "}
                {lastData.output}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-indigo-600">
                  Last Updated:
                </span>{" "}
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingStatus;

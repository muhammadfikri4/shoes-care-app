/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. ENHANCED useAblyConnection.ts with detailed frontend debugging
import * as Ably from "ably";
import { useEffect, useRef, useCallback, useState } from "react";
import { CONFIG_APP } from "../../../core/configs/app";
import { storage } from "../helper/storage";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { PayloadToken } from "../../../core/model/auth";

interface CatchError {
    message: string
}

interface FriendStatusUpdate {
  userId: string;
  name: string;
  avatar?: string;
  status: "online" | "offline";
  isOnline: boolean;
  lastSeen: string;
  timestamp: string;
}

export const useAblyConnection = () => {
  const queryClient = useQueryClient();
  const ablyRef = useRef<Ably.Realtime | null>(null);
  const channelsRef = useRef<{ presence: any; friend: any }>({ presence: null, friend: null });
  
  const [debugInfo, setDebugInfo] = useState({
    connectionState: "disconnected",
    subscribed: false,
    eventsReceived: 0,
    lastEvent: null as any,
    channelState: "detached",
    errors: [] as string[]
  });
  
  const token = storage.get(CONFIG_APP.TOKEN_KEY);
  const userId = token ? (jwtDecode(token) as PayloadToken).userId : "";

  // Enhanced update handler
  const handleFriendStatusUpdate = useCallback((update: FriendStatusUpdate) => {
    console.log("🎉 FRONTEND: Friend status update received!", {
      update,
      timestamp: new Date().toISOString()
    });
    
    setDebugInfo(prev => ({
      ...prev,
      eventsReceived: prev.eventsReceived + 1,
      lastEvent: update
    }));

    try {
      // Log current cache state
      const currentCache = queryClient.getQueryData(["friends"]);
      console.log("📦 Current friends cache before update:", currentCache);

      // Update cache
      queryClient.setQueryData(["friends"], (oldData: any) => {
        if (!oldData) {
          console.log("⚠️ No friends cache found, cannot update");
          return oldData;
        }

        const updatedData = oldData.map((friend: any) => {
          // Check multiple possible friend ID locations
          const friendUserId = friend.userId || friend.id || (friend.user && friend.user.id);
          
          if (friendUserId === update.userId) {
            console.log(`✏️ UPDATING friend ${update.name}:`, {
              oldStatus: friend.isOnline,
              newStatus: update.isOnline,
              friend: friend
            });

            const updated = {
              ...friend,
              isOnline: update.isOnline,
              lastSeen: update.lastSeen,
              // Handle nested user object
              user: friend.user ? {
                ...friend.user,
                isOnline: update.isOnline,
                lastSeen: update.lastSeen
              } : undefined
            };

            console.log("✅ Updated friend object:", updated);
            return updated;
          }
          return friend;
        });

        console.log("📦 Updated friends cache:", updatedData);
        return updatedData;
      });

      // Force component re-render by invalidating after update
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["friends"] });
        console.log("🔄 Forced cache invalidation");
      }, 100);

    } catch (error: unknown) {
      console.error("❌ Error updating cache:", error);
      const err = error as CatchError
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors.slice(-4), `Cache update error: ${err.message}`]
      }));
    }

  }, [queryClient]);

  useEffect(() => {
    if (!token || !userId) {
      console.log("❌ Missing token or userId:", { token: !!token, userId });
      return;
    }

    console.log("🚀 FRONTEND: Starting Ably connection for user:", userId);
    console.log("🔗 Auth URL:", `${CONFIG_APP.BASE_URL}/ably/auth`);

    // Create Ably instance
    const ably = new Ably.Realtime({
      authUrl: `${CONFIG_APP.BASE_URL}/ably/auth`,
      authHeaders: {
        Authorization: `Bearer ${token}`,
      },
      autoConnect: true,
      disconnectedRetryTimeout: 15000,
      suspendedRetryTimeout: 30000,
      // Add more debugging
      logLevel: 4, // Verbose logging
    });

    ablyRef.current = ably;

    // Enhanced connection state monitoring
    ably.connection.on((stateChange) => {
      console.log(`🔗 Connection state change: ${stateChange.previous} → ${stateChange.current}`);
      
      setDebugInfo(prev => ({
        ...prev,
        connectionState: stateChange.current
      }));

      if (stateChange.current === 'connected') {
        console.log('✅ FRONTEND: Ably connected successfully!');
        console.log('🔑 Connection key:', ably.connection.key);
        console.log('🆔 Connection id:', ably.connection.id);
      } else if (stateChange.current === 'failed') {
        console.error('❌ FRONTEND: Ably connection failed:', stateChange.reason);
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors.slice(-4), `Connection failed: ${stateChange.reason?.message}`]
        }));
      }
    });

    // Wait for connection before setting up channels
    ably.connection.once('connected', () => {
      console.log("🎯 Connection established, setting up channels...");
      setupChannels();
    });

    const setupChannels = () => {
      // Create channels
      const presenceChannel = ably.channels.get("presence:users");
      const friendChannelName = `friend:status:${userId}`;
      const friendChannel = ably.channels.get(friendChannelName);
      
      channelsRef.current = { presence: presenceChannel, friend: friendChannel };
      
      console.log("📡 FRONTEND: Channels created:", {
        presence: "presence:users",
        friend: friendChannelName
      });

      // Monitor friend channel state
      friendChannel.on((stateChange: any) => {
        console.log(`📺 Friend channel state: ${stateChange.previous} → ${stateChange.current}`);
        setDebugInfo(prev => ({
          ...prev,
          channelState: stateChange.current
        }));
      });

      // Enter presence
      console.log("👋 Entering presence...");
      presenceChannel.presence.enter({ userId, name: "User" + userId.slice(-4) })
        .then(() => {
          console.log('✅ FRONTEND: Entered presence successfully');
        })
        .catch((error) => {
          console.error('❌ FRONTEND: Failed to enter presence:', error);
          setDebugInfo(prev => ({
            ...prev,
            errors: [...prev.errors.slice(-4), `Presence error: ${error.message}`]
          }));
        });

      // Subscribe to friend status changes
      console.log(`👂 FRONTEND: Subscribing to ${friendChannelName}...`);
      
      try {
        friendChannel.subscribe("status-change", (msg: any) => {
          console.log("📨 RAW EVENT RECEIVED:", {
            name: msg.name,
            data: msg.data,
            clientId: msg.clientId,
            timestamp: msg.timestamp,
            id: msg.id,
            channel: msg.channel
          });
          
          const update = msg.data as FriendStatusUpdate;
          handleFriendStatusUpdate(update);
        });

        setDebugInfo(prev => ({
          ...prev,
          subscribed: true
        }));

        console.log("✅ FRONTEND: Successfully subscribed to friend status changes");

        // Test the subscription after 3 seconds
        // setTimeout(() => {
        //   console.log("🧪 FRONTEND: Testing subscription...", {
        //     channelState: friendChannel.state,
        //     isSubscribed: (prev) => prev.subscribed,
        //     connectionState: ably.connection.state
        //   });
        // }, 3000);

      } catch (error: unknown) {
        console.error("❌ FRONTEND: Failed to subscribe:", error);
        const err = error as CatchError
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors.slice(-4), `Subscribe error: ${err.message}`]
        }));
      }
    };

    // If already connected, setup channels immediately
    if (ably.connection.state === 'connected') {
      setupChannels();
    }

    // Browser events
    const handleBeforeUnload = () => {
      const endpoint = `${CONFIG_APP.BASE_URL}/api/user/offline`;
      const data = JSON.stringify({ userId });
      
      if (navigator.sendBeacon) {
        console.log("📱 FRONTEND: Sending offline beacon");
        navigator.sendBeacon(endpoint, new Blob([data], { type: 'application/json' }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      console.log("🧹 FRONTEND: Cleaning up Ably connection");
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('pagehide', handleBeforeUnload);
      
      if (channelsRef.current.presence) {
        channelsRef.current.presence.presence.leave()
          .then(() => console.log('👋 FRONTEND: Left presence'))
          .catch((error: any) => console.error('❌ Error leaving presence:', error));
      }

      if (channelsRef.current.friend) {
        channelsRef.current.friend.unsubscribe("status-change");
        console.log("🔇 FRONTEND: Unsubscribed from friend channel");
      }
      
      if (ablyRef.current) {
        ablyRef.current.close();
        ablyRef.current = null;
        console.log("🔌 FRONTEND: Closed Ably connection");
      }
    };
  }, [token, userId, handleFriendStatusUpdate]);

  return {
    isConnected: debugInfo.connectionState === 'connected',
    debugInfo, // Expose debug info
    userId
  };
};
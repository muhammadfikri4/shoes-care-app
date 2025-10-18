import { useQueryClient } from "@tanstack/react-query";
import { BiGroup } from "react-icons/bi";
import { GrChat } from "react-icons/gr";
import { TbSmartHome } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { Outlet } from "react-router-dom";
import { useFriend } from "../../friends/hooks/useFriend";
import { useProfile } from "../../profile/hooks/useProfile";
import { Sidebar } from "../components/Sidebar";
import { useAblyConnection } from "../hooks/useAbblyConnection";
import { useSocket } from "../hooks/useSocket";

export const RootViews = () => {
  const socket = useSocket();
  socket?.id;
  const { data: profile } = useProfile();
  // const token = storage.get(CONFIG_APP.TOKEN_KEY);
  // if (!token) {
  //   return <Navigate to={"/login"} />;
  // }
  return (
    <>
      <Sidebar
        menus={[
          {
            icon: <TbSmartHome className="text-2xl" />,
            name: "Home",
            to: "/",
          },
          {
            icon: <GrChat className="text-xl" />,
            name: "Chats",
            to: "/chats",
          },
          {
            icon: <BiGroup className="text-2xl" />,
            name: "Friends",
            to: "/friends",
          },
          {
            icon: <VscSettings className="text-xl" />,
            name: "Profile",
            to: "/profile",
          },
        ]}
        name={profile?.data?.name ?? ""}
      />
      <div className="pl-20">
        <Outlet />
        {/* <AblyDebugPanel /> */}
      </div>
    </>
  );
};

// 2. ENHANCED DEBUG PANEL
export const AblyDebugPanel = () => {
  const { isConnected, debugInfo, userId } = useAblyConnection();
  const queryClient = useQueryClient();

  const testManualUpdate = () => {
    // Simulate receiving an event
    const testUpdate = {
      userId: "test-friend-id",
      name: "Test Friend",
      status: "online" as const,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };

    console.log("🧪 Testing manual cache update:", testUpdate);

    queryClient.setQueryData(["friends"], (oldData) => {
      console.log("📦 Manual test - current cache:", oldData);
      return oldData; // Just log, don't change
    });
  };

  const inspectCache = () => {
    const cache = queryClient.getQueryData(["friends"]);
    console.log("🔍 Current friends cache:", cache);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "white",
        padding: 15,
        border: "2px solid #007bff",
        borderRadius: 8,
        fontSize: 11,
        maxWidth: 350,
        maxHeight: 500,
        overflow: "auto",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 9999,
      }}
    >
      <h4 style={{ margin: "0 0 10px 0", color: "#007bff" }}>
        🔧 Ably Frontend Debug
      </h4>

      <div style={{ marginBottom: 10 }}>
        <strong>User ID:</strong> <code>{userId?.slice(-8)}...</code>
        <br />
        <strong>Connected:</strong> {isConnected ? "✅ Yes" : "❌ No"}
        <br />
        <strong>State:</strong> <code>{debugInfo.connectionState}</code>
        <br />
        <strong>Channel:</strong> <code>{debugInfo.channelState}</code>
        <br />
        <strong>Subscribed:</strong> {debugInfo.subscribed ? "✅ Yes" : "❌ No"}
        <br />
        <strong>Events:</strong> {debugInfo.eventsReceived}
      </div>

      {debugInfo.lastEvent && (
        <div
          style={{
            marginBottom: 10,
            padding: 8,
            background: "#e8f5e8",
            borderRadius: 4,
          }}
        >
          <strong>Last Event:</strong>
          <br />
          <small>
            {debugInfo.lastEvent.name} → {debugInfo.lastEvent.status}
            <br />
            {new Date(debugInfo.lastEvent.timestamp).toLocaleTimeString()}
          </small>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <button
          onClick={testManualUpdate}
          style={{ fontSize: 10, marginRight: 5, padding: "4px 8px" }}
        >
          Test Cache Update
        </button>
        <button
          onClick={inspectCache}
          style={{ fontSize: 10, padding: "4px 8px" }}
        >
          Inspect Cache
        </button>
      </div>

      {debugInfo.errors.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong style={{ color: "red" }}>Errors:</strong>
          {debugInfo.errors.map((error, i) => (
            <div key={i} style={{ fontSize: 10, color: "red", marginTop: 2 }}>
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===================================================================
// 3. TEST COMPONENT - Add this to test real-time updates
export const FriendsListTest = () => {
  const { data: friends, isLoading, error } = useFriend();

  const { isConnected } = useAblyConnection();

  console.log("🏠 FriendsListTest render:", {
    friends,
    isLoading,
    error,
    isConnected,
    timestamp: new Date().toISOString(),
  });

  if (isLoading) return <div>Loading friends...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Friends List (Real-time Test)</h3>
      <p>Ably Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      {friends?.data?.map((friend) => {
        return (
          <div
            key={friend.id}
            style={{
              padding: 10,
              margin: 5,
              border: "1px solid #ddd",
              borderRadius: 4,
              backgroundColor: friend.isOnline ? "#e8f5e8" : "#f5f5f5",
            }}
          >
            <strong>{friend.name}</strong>
            <br />
            <span style={{ color: friend.isOnline ? "green" : "gray" }}>
              {friend.isOnline ? "🟢 Online" : "⚫ Offline"}
            </span>
            {friend.lastSeen && (
              <div style={{ fontSize: 12, color: "#666" }}>
                Last seen: {new Date(friend.lastSeen).toLocaleString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

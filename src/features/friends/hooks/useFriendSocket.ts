import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FriendDTO } from "../../../core/model/friend";
import { socket } from "../../_global/hooks/useSocket";

export function useFriendSocket(data: FriendDTO[]) {
  const queryClient = useQueryClient();
  const [friends, setFriends] = useState(data || []);

  useEffect(() => {
    setFriends(data);
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    socket.on("user-status", (friend: FriendDTO) => {
      setFriends((prev) =>
        prev.map((f) =>
          f.id === friend.id ? { ...f, isOnline: friend.isOnline, lastSeen: friend.lastSeen } : f
        )
      );
    });

    return () => {
      socket?.off("user-status");
    };
  }, [queryClient]);

  return {
    friends,
    setFriends,
  };
}

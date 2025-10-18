export interface AddFriendDTO {
  code: string;
}

export interface FriendDTO {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  lastSeen?: Date
  isOnline: boolean
}

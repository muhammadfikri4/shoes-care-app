export type RackStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface RackModel {
  id: string;
  code: string;
  name?: string | null;
  location?: string | null;
  status: RackStatus;
  createdAt?: string;
  updatedAt?: string;
}


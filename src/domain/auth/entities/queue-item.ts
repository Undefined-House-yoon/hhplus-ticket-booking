export interface QueueItem {
  id: number;
  userId: number;
  processed: boolean;
  createdAt: Date;
}

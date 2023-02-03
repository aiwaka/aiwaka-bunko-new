import type { Timestamp } from "@firebase/firestore";

export interface UserRecord {
  uid: string;
  name: string;
  belongs: string;
  createdAt: Timestamp;
}

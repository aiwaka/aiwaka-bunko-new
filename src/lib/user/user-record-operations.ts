import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db, getCurrentUser } from "@/lib/firebase";

/////////////
// create
/////////////
export const createUserRecord = async (uid: string, name: string, belongs: string) => {
  const newUserRef = doc(db, "users", uid);
  const currentDate = Timestamp.now();
  const newUserData = {
    name,
    belongs,
    createdAt: currentDate,
  };
  await setDoc(newUserRef, newUserData);
};

/////////////
// read
/////////////
export const getUserName = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) {
    return null;
  }
  const recordsRef = doc(db, "users", uid);
  const userSnap = await getDoc(recordsRef);
  if (!userSnap.exists()) return null;
  return userSnap.data().name as string;
};

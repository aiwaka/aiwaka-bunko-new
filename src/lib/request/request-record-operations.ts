import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, getCurrentUser } from "@/lib/firebase";
import { requestConverter } from "@/lib/firebase/converter";
import { getUserName } from "$lib/user/user-record-operations";
import {
  DocumentRequest,
  createDocumentRequest,
  type DocumentRequestWithoutId,
} from "./document-requests";

///////////////
// create
///////////////
export const createRequestToFirestore = async (
  requestType: number,
  target: string,
  targetName: string,
  message: string
): Promise<DocumentRequest | null> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  const userName = await getUserName();
  if (!uid || !userName) return null;

  // const userRecordsRef = doc(db, "users", uid);
  // const userSnap = await getDoc(userRecordsRef);
  // if (!userSnap.exists()) return null;
  const currentDate = Timestamp.now();
  const newRequestRef = doc(collection(db, "requests")).withConverter(requestConverter);
  const newRequestData: DocumentRequestWithoutId = {
    uid,
    requestType,
    userName,
    time: currentDate,
    target,
    targetName,
    message,
    status: 0,
  };
  await setDoc(newRequestRef, newRequestData);
  // リロードなしで使えるようにする.
  const newRec = createDocumentRequest(newRequestRef.id, newRequestData);
  return newRec;
};

///////////////
// read
///////////////
export const setAllRequestByUser = async (requestList: DocumentRequest[]) => {
  // あるユーザーに対するリクエストをすべて取得する.
  // fetch data from firestore
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return;
  const requestsQuery = query(collection(db, "requests"), where("uid", "==", uid)).withConverter(
    requestConverter
  );
  const querySnapshot = await getDocs(requestsQuery);
  querySnapshot.forEach((doc) => {
    requestList.push(doc.data());
  });
};

export const setRequestByUserAndTarget = async (requestList: DocumentRequest[], target: string) => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return;
  const requestsQuery = query(
    collection(db, "requests"),
    where("uid", "==", uid),
    where("target", "==", target)
  ).withConverter(requestConverter);
  const querySnapshot = await getDocs(requestsQuery);
  querySnapshot.forEach((doc) => {
    requestList.push(doc.data());
  });
};

///////////////
// update
///////////////
const updateRequestOfFirestore = async (requestId: string, newMessage: string): Promise<void> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return Promise.reject(new Error("User is not authenticated."));
  return await updateDoc(doc(db, "requests", requestId), {
    message: newMessage,
  });
};
/** 引数に渡したリクエストを修正する.
 * @param requestId 修正したいリクエストのid
 * @param requestList
 */
export const modifyRequestInList = async (requestId: string, requestList: DocumentRequest[]) => {
  const modifyingReq = requestList.find((req) => {
    return req.id === requestId;
  });
  if (modifyingReq === undefined) {
    alert("修正できません。");
    return;
  }
  const modifiedMessage = window.prompt("メッセージを修正してください。", modifyingReq.message);
  if (modifiedMessage !== null && modifiedMessage !== "") {
    if (confirm("以下の内容に修正して登録しますか？" + `\n${modifiedMessage}`)) {
      await updateRequestOfFirestore(requestId, modifiedMessage);
      modifyingReq.message = modifiedMessage;
    }
  }
};

///////////////
// delete
///////////////
const deleteRequestFromFirestore = async (requestId: string) => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return Promise.reject(new Error("User is not authenticated."));
  return deleteDoc(doc(db, "requests", requestId));
};
/**
 * リクエストリストから指定されたidのリクエストを削除し, 新しいリストを返す
 * @param requestId 削除したいリクエストのid
 * @param requestList リクエストのリスト
 * @return 新しいリスト
 */
export const deleteRequestFromList = async (requestId: string, requestList: DocumentRequest[]) => {
  if (confirm("削除しますか？")) {
    try {
      // 消去が成功した場合はフィルターをかけて新しいリストを返す.
      // それ以外はrequestListをそのまま返す.
      await deleteRequestFromFirestore(requestId);
      const newList = requestList.filter((req) => {
        return req.id !== requestId;
      });
      return newList;
    } catch (error) {
      return requestList;
    }
  } else {
    return requestList;
  }
};

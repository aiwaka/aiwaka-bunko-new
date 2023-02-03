import { collection, doc, getDoc, getDocs, query } from "@firebase/firestore";
import { db } from "@/lib/firebase";
import { documentConverter } from "@/lib/firebase/converter";
import type { DocumentContent } from "./document-content";

export const getAllContents = async (list: DocumentContent[]) => {
  // 全件取得
  const filesQuery = query(collection(db, "files").withConverter(documentConverter));
  const querySnapshot = await getDocs(filesQuery);
  const allContentsNum = querySnapshot.size;
  const docs = querySnapshot.docs;
  // num件分だけlistに格納する
  docs.forEach((doc) => {
    list.push(doc.data());
  });

  return allContentsNum;
};

export const getContent = async (urlStr: string): Promise<DocumentContent | null> => {
  const docRef = doc(db, "files", urlStr).withConverter(documentConverter);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

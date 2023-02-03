import type { DocumentContent } from "$lib/doc";
import { db, getCurrentUser } from "@/lib/firebase";
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { documentConverter, favoriteDocumentConverter } from "@/lib/firebase/converter";
import { getUserName } from "$lib/user";
import { FavoriteDocumentRelation, createFavDocRelation } from "./favorite-documents";

///////////////
// create
///////////////
export const createFavoriteToFirestore = async (
  docId: string,
  docName: string
): Promise<FavoriteDocumentRelation | null> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  const userName = await getUserName();
  if (!uid || !userName) return null;

  const newRequestRef = doc(collection(db, "favoriteDocuments")).withConverter(
    favoriteDocumentConverter
  );
  const newRequestData = {
    uid,
    userName,
    docId,
    docName,
  };
  await setDoc(newRequestRef, newRequestData);
  // リロードなしで使えるようにする.
  const newRec = createFavDocRelation(newRequestRef.id, newRequestData);
  return newRec;
};

///////////////
// read
///////////////
/**
 * 現在のユーザーがfavに入れている文書のidのリストを格納する.
 * @param documentIdList - 文書リストの配列（参照で渡される）
 */
export const setAllFavDocIdListByUser = async (documentIdList: string[]) => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return;
  // お気に入りのidリストを取得
  const favoriteQuery = query(
    collection(db, "favoriteDocuments"),
    where("uid", "==", uid)
  ).withConverter(favoriteDocumentConverter);
  const favoriteQuerySnapshot = await getDocs(favoriteQuery);
  favoriteQuerySnapshot.forEach((doc) => {
    documentIdList.push(doc.data().docId);
  });
};
/**
 * 現在のユーザーがfavに入れている文書のリストを格納する.
 * @param documentList - 文書リストの配列（参照で渡される）
 */
export const setAllFavDocByUser = async (documentList: DocumentContent[]) => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return;
  // まずお気に入りのidリストを取得
  const favoriteQuery = query(
    collection(db, "favoriteDocuments"),
    where("uid", "==", uid)
  ).withConverter(favoriteDocumentConverter);
  const favoriteQuerySnapshot = await getDocs(favoriteQuery);
  const docIdList: string[] = [];
  favoriteQuerySnapshot.forEach((doc) => {
    docIdList.push(doc.data().docId);
  });
  if (docIdList.length === 0) {
    return;
  }
  // idリストを使ってドキュメントのリストを取得
  const documentQuery = query(
    collection(db, "files"),
    where(documentId(), "in", docIdList)
  ).withConverter(documentConverter);
  const documentQuerySnapshot = await getDocs(documentQuery);
  documentQuerySnapshot.forEach((doc) => {
    documentList.push(doc.data());
  });
};

/**
 * 指定された文書が現在のユーザーのお気に入りに入っているかを返す
 * @param docId - 文書id（urlと一致）
 * @returns - 指定された文書が現在のユーザーのお気に入りに入っているならtrue
 */
export const getIfDocInFavorite = async (docId: string) => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return;

  const favoriteQuery = query(
    collection(db, "favoriteDocuments"),
    where("uid", "==", uid),
    where("docId", "==", docId)
  ).withConverter(favoriteDocumentConverter);
  const querySnapshot = await getDocs(favoriteQuery);
  return querySnapshot.docs.length !== 0;
};

///////////////
// delete
///////////////
/**
 * お気に入りのコレクションからuidとdocIdが一致するドキュメントをすべて削除する
 * @param docId - 文書id（urlと一致）
 */
export const deleteFavoriteFromFirestore = async (docId: string): Promise<void | null> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) return null;

  const favoriteQuery = query(
    collection(db, "favoriteDocuments"),
    where("uid", "==", uid),
    where("docId", "==", docId)
  ).withConverter(favoriteDocumentConverter);
  const favoriteQuerySnapshot = await getDocs(favoriteQuery);

  const batch = writeBatch(db);
  favoriteQuerySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  /*
   * 以下はどれだけ削除すべきものが多くてもうまくできるための措置.
   * 必要になることは無いと思われるので一旦コメントアウト
   */
  // const batch = writeBatch(db);
  // const MAX_WRITES_PER_BATCH = 500;
  // const docs = favoriteQuerySnapshot.docs;
  // const commitBatchPromises = [];
  // for (let i = 0; i < docs.length; i += MAX_WRITES_PER_BATCH) {
  //   const chunk = docs.slice(i, i + MAX_WRITES_PER_BATCH);
  //   chunk.forEach((doc) => batch.delete(doc.ref));
  //   commitBatchPromises.push(batch.commit());
  // }
  // await Promise.all(commitBatchPromises);
};

import type { QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { DocumentRequest } from "$lib/request";
import { FavoriteDocumentRelation } from "$lib/favorite";
import type { DocumentContent } from "../doc";

export const documentConverter = {
  toFirestore: (document: DocumentContent) => {
    return {
      title: document.title,
      id: document.id,
      update: document.update,
      description: document.description,
      notes: document.notes,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): DocumentContent => {
    const data = snapshot.data(options);
    return new DocumentContent(
      snapshot.id,
      data.id,
      data.title,
      data.update,
      data.description,
      data.notes
    );
  },
};

export const requestConverter = {
  toFirestore: (document: DocumentRequest) => {
    return {
      uid: document.uid,
      userName: document.userName, // 冗長だがユーザー名を保持しておく（確認するときの利便性）
      requestType: document.requestType,
      target: document.target,
      targetName: document.targetName, // 冗長に文書名を保持しておく
      time: document.time,
      message: document.message,
      status: document.status,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): DocumentRequest => {
    const data = snapshot.data(options);
    // ここもmake...関数に置き換えてもよいが, anyで怒られる. 無理やりキャストするのもありか？
    return new DocumentRequest(
      snapshot.id,
      data.uid,
      data.userName,
      data.requestType,
      data.target,
      data.targetName,
      data.time,
      data.message,
      data.status
    );
  },
};

export const favoriteDocumentConverter = {
  toFirestore: (doc: FavoriteDocumentRelation) => {
    return {
      uid: doc.uid,
      userName: doc.userName,
      docId: doc.docId,
      docName: doc.docName,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): FavoriteDocumentRelation => {
    const data = snapshot.data(options);
    return new FavoriteDocumentRelation(
      snapshot.id,
      data.uid,
      data.userName,
      data.docId,
      data.docName
    );
  },
};

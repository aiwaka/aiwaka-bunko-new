import {
  createFavoriteToFirestore,
  setAllFavDocByUser,
  setAllFavDocIdListByUser,
  getIfDocInFavorite,
  deleteFavoriteFromFirestore,
} from "./favorite-document-operations";
import {
  FavoriteDocumentRelation,
  type FavoriteDocumentRelationWithoutId,
  createFavDocRelation,
} from "./favorite-documents";

export {
  createFavoriteToFirestore,
  setAllFavDocByUser,
  setAllFavDocIdListByUser,
  getIfDocInFavorite,
  deleteFavoriteFromFirestore,
  FavoriteDocumentRelation,
  FavoriteDocumentRelationWithoutId,
  createFavDocRelation,
};

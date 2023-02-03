export type FavoriteDocumentRelationWithoutId = Omit<FavoriteDocumentRelation, "id">;
/**
 * id以外をすべて含むオブジェクトにidを付け足してFavoriteDocumentsRelationオブジェクトを作成する.
 * @param id idの指定
 * @param obj idだけ含まず他の要素はすべて含むオブジェクト
 */
export const createFavDocRelation = (
  id: string,
  obj: FavoriteDocumentRelationWithoutId
): FavoriteDocumentRelation => {
  return new FavoriteDocumentRelation(id, obj.uid, obj.userName, obj.docId, obj.docName);
};

export class FavoriteDocumentRelation {
  constructor(
    public id: string,
    public uid: string,
    public userName: string,
    public docId: string,
    public docName: string
  ) {}
}

import type { Timestamp } from "@firebase/firestore";

const dayStr = ["日", "月", "火", "水", "木", "金", "土"];
export const requestTypeStr = ["意見", "修正依頼", "GitHubリポジトリ参加依頼", "その他"];

export type DocumentRequestWithoutId = Omit<
  DocumentRequest,
  "id" | "getTime" | "getDate" | "getTypeStr"
>;

// }
/**
 * id以外をすべて含むオブジェクトにidを付け足してDocumentRequestオブジェクトを作成する.
 * @param id idの指定
 * @param obj idだけ含まず他の要素はすべて含むオブジェクト
 */
export const createDocumentRequest = (
  id: string,
  obj: DocumentRequestWithoutId
): DocumentRequest => {
  return new DocumentRequest(
    id,
    obj.uid,
    obj.userName,
    obj.requestType,
    obj.target,
    obj.targetName,
    obj.time,
    obj.message,
    obj.status
  );
};

export class DocumentRequest {
  constructor(
    public id: string,
    public uid: string,
    public userName: string, // 冗長だがユーザー名を保持しておく（確認するときの利便性）
    public requestType: number,
    public target: string,
    public targetName: string, // 冗長に文書名を保持しておく
    public time: Timestamp,
    public message: string,
    public status: number
  ) {}

  public getDate(): string {
    const dateObj: Date = this.time.toDate();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // getMonthは0始まり
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();
    const day = dayStr[dateObj.getDay()];
    return `${year}年${month}月${date}日（${day}） ${hour}時${minute}分${second}秒`;
  }
  public getTime(): string {
    const dateObj: Date = this.time.toDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    // const second = dateObj.getSeconds();
    return `${hour}時${minute}分`;
  }
  public getTypeStr(): string {
    return requestTypeStr[this.requestType];
  }
}

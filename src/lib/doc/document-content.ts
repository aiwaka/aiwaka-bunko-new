import type { Timestamp } from "@firebase/firestore";

export class DocumentContent {
  constructor(
    public urlStr: string,
    public id: number,
    public title: string,
    public update: Timestamp,
    public description: string,
    public notes: string[]
  ) {}
  public postDateAsString(): string {
    const date = this.update.toDate();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const downloadDocument = (urlStr: string) => {
  const fileRef = ref(storage, `documents/${urlStr}.pdf`);
  getDownloadURL(fileRef)
    .then((url) => {
      // 直接ダウンロードする場合はリクエスト処理を行う
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.onload = () => {
        const blob = xhr.response;
        //aタグ生成
        const aElem = document.createElement("a");
        //レスポンスからBlobオブジェクト＆URLの生成
        const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: blob.type }));
        document.body.appendChild(aElem);
        // 属性を設定
        aElem.setAttribute("href", blobUrl);
        aElem.setAttribute("style", "display: none");
        aElem.setAttribute("rel", "noopener noreferrer");
        aElem.setAttribute("download", urlStr);

        aElem.click();
        document.body.removeChild(aElem);
      };
      xhr.send();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const openFileAsNewTab = (urlStr: string) => {
  const fileRef = ref(storage, `documents/${urlStr}.pdf`);
  getDownloadURL(fileRef)
    .then((url) => {
      // 新しいタブとして開く場合
      //aタグ生成
      const aElem = document.createElement("a");
      document.body.appendChild(aElem);
      // 属性を設定
      aElem.setAttribute("href", url);
      aElem.setAttribute("target", "_blank");
      aElem.setAttribute("style", "display: none");
      aElem.setAttribute("rel", "noopener noreferrer");

      aElem.click();
      document.body.removeChild(aElem);
    })
    .catch((error) => {
      console.log(error);
    });
};

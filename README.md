# aiwaka-bunko

[@litteleIkawa](https://github.com/littleIkawa)が作成した講義板書などの文書制作物をまとめたウェブページです。

ログインすることで文書の閲覧が可能で, 他にも文書別に修正リクエスト等を行うことができます。
~~アカウント作成には私からアクセスコードを聞いて入力する必要があります。~~ →不要にしました。

[https://aiwaka-bunko.web.app](https://aiwaka-bunko.web.app)にデプロイしています。

## 仕様

- メールアドレスを利用して登録・ログイン（Firebase Authentication）.
- ~~登録にはさらにアクセスコードが必要.~~
- リモートストレージに置いてある PDF をダウンロードできる.
- 携帯端末でも見やすい.
- ストレージにおけるファイル名と URL を一致させるという制限で動的ルーティングを用いることでコード量の削減と保守性の向上がなされている.
- ダウンロードの動作を二種類用意することで様々な環境で閲覧できるようにしている.
- リクエスト機能により筆者に意見を送ることができる.
- リクエストの修正・削除等も簡単にできる.
- リクエストが受理されたかどうかもひと目で分かるようになっている.
- ユーザーページを追加し, 自分のリクエスト一覧を閲覧・編集できるようになった.
- 文書のお気に入りリスト機能. 各文書ページでお気に入りにチェックを入れればユーザーページに一覧が表示される他, コンテンツ一覧ページでもハイライトされる.
- 直近一週間に更新された文書にアイコンがつくようになった.
- ダークモードに対応（端末の設定に一致する）.
- リクエスト文章にLaTeX記法が使えるようになった.

## ギャラリー（旧バージョン）

<p>
<img width="25%" alt="コンテンツ一覧（モバイル）" src="https://user-images.githubusercontent.com/38373453/172040212-f51934ba-b375-4a81-8674-22ecd9cd2cb1.jpg">
<img width="65%" alt="コンテンツ一覧（PC）" src="https://user-images.githubusercontent.com/38373453/172039948-60c5db65-f0b2-4092-9b8d-dd1fc45cff29.png">
<img width="95%" alt="コンテンツ" src="https://user-images.githubusercontent.com/38373453/172040144-a214a96f-9766-4bbe-a7cc-32dc6fd7f0e1.png">
<img width="95%" alt="修正リクエスト" src="https://user-images.githubusercontent.com/38373453/172040169-cc949ded-e3dc-4fb9-85a0-ad8320be6a01.png">
</p>

## 技術的な概要（新バージョン準拠）

<table>
  <tr>
    <th>開発人数</th>
    <td>
      1人<br>
    </td>
  </tr>
  <tr>
    <th>開発期間</th>
    <td>2021年〜</td>
  </tr>
  <tr>
    <th>使用技術</th>
    <td>
        <ul>
        <li>SvelteKit</li>
        <li>Typescript</li>
        <li>Google Firebase (Authentication, Storage, Firestore, Hosting)</li>
        </ul>
    </td>
  </tr>
  <tr>
    <th>雑記</th>
    <td>
    <ul>
    <li>旧バージョンではVue.js v3を使用していた. また, SCSSも用いていた.</li>
    <li>Firebase Authentication のオブザーバーを設定したことでログインを検知して動的にヘッダーの内容を変更している.</li>
    <li>Firestore のコンバーターを挟んだことで保守性が大幅に上がった.</li>
    <li>お気に入りリストのデータベース構造はRDBを真似て中間レコード形式とした. ユニーク制約は難しそうだったので, 削除時にはバッチ処理で条件を満たすものを一括削除する形式にしている.</li>
    <li>`svelte-exmarkdown`というライブラリを利用し, `remark-math`と`rehype-katex`を挟むことでLaTeX記法の動的なレンダリングに対応した.</li>
    </ul>
  </tr>
</table>

## メモ

- gsutil を pip で入れ, CORS 設定を行った（ストレージへのアクセスのため）.

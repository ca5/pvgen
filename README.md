# Remotion Music PV Template

このテンプレートは、Remotionを使って楽曲のプロモーションビデオ（PV）やアルバムのクロスフェードプレビュー動画を生成するためのプロジェクトです。

ジャケット画像、音声ファイル、各楽曲の再生スタート＆エンド時間を設定することで、再生中の楽曲名が自動で切り替わるアニメーション動画（波形ビジュアライザ付き）を生成できます。

## セットアップ

依存関係をインストールします：

```bash
npm install
```

## 動画のプレビュー

ローカルで開発サーバーを立ち上げ、動画のプレビューを確認します：

```bash
npm run dev
```

ブラウザでプレビュー画面（Remotion Studio）が開きます。

## カスタマイズ方法

動画の内容を変更するには、`src/Root.tsx` 内の `defaultProps` を編集します。

```tsx
// src/Root.tsx
import { staticFile } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      // ...
      defaultProps={{
        // 音声ファイルのパス（publicフォルダ内に配置）
        audioFileUrl: staticFile("audio.wav"),

        // ジャケット画像のパス（publicフォルダ内に配置）
        coverImageUrl: staticFile("cover.jpeg"),

        // アルバム名
        albumName: "My Awesome Album",

        // 楽曲タイトルの文字色
        titleColor: "rgba(255, 255, 255, 0.93)",

        // トラックリストの設定
        // 各楽曲のタイトルと、再生の開始時間・終了時間（秒）を指定します
        songs: [
          { title: "Intro", startInSeconds: 0, endInSeconds: 5 },
          { title: "Main Track", startInSeconds: 5, endInSeconds: 15 },
          { title: "Outro", startInSeconds: 15, endInSeconds: 20 },
        ],

        // 波形ビジュアライザの設定
        visualizer: {
          type: "spectrum", // "spectrum" または "oscilloscope"
          color: "#F4B941",
          // ...
        },
      }}
    />
  );
};
```

### ファイルの差し替え

自身の音声ファイルやジャケット画像を使用する場合は、`public` フォルダ内にファイルを配置し、`staticFile("ファイル名")` のように指定してください。

*注意: 波形の描画を最適化するため、音声ファイルは `.wav` 形式を推奨します。*

## 動画のレンダリング（書き出し）

動画ファイル（MP4など）として出力するには、以下のコマンドを実行します：

```bash
npx remotion render
```

Renderパネルが開くので、そこから出力設定を行い、書き出しを開始できます。CLIから直接書き出すことも可能です。詳しくは [Remotionのドキュメント](https://www.remotion.dev/docs/render/) を参照してください。

## 構成

* `src/Root.tsx`: メインの設定ファイル。Compositionの登録とパラメータを管理します。
* `src/Audiogram/Main.tsx`: 動画のレイアウトやアニメーションのメインコンポーネントです。
* `src/Audiogram/schema.ts`: Zodを用いたパラメータのスキーマ定義です。

## ライセンスに関する注意

本テンプレートはRemotionを使用しています。商用利用など、一定の条件下ではライセンスの購入が必要になる場合があります。詳しくは [Remotionのライセンス条項](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) をご確認ください。

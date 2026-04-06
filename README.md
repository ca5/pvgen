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

## YouTubeへの自動アップロード

書き出した動画（`out/video.mp4`）を、指定したYouTubeアカウントへ限定公開で自動アップロードするスクリプトが用意されています。

### 1. YouTube API の設定
エージェントがバックグラウンド（ブラウザを開かない状態）でアップロードできるようにするため、一度だけ手動で「リフレッシュトークン」を取得する必要があります。

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成します。
2. **YouTube Data API v3** を有効化します。
3. **OAuth 同意画面** を設定し（テストユーザーにご自身のYouTubeアカウントを追加）、**認証情報** から「OAuth 2.0 クライアント ID」を作成します。
   * **アプリケーションの種類**: 「ウェブ アプリケーション」を選択
   * **承認済みのリダイレクト URI**: `https://developers.google.com/oauthplayground` を追加（トークン取得を簡単にするため）
4. **クライアントID** と **クライアントシークレット** を取得します。
5. [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) を使用して、YouTubeアカウントの **リフレッシュトークン** を取得します。
   * 画面右上の歯車アイコンをクリックし、「Use your own OAuth credentials」にチェックを入れて、先ほど取得したIDとシークレットを入力。
   * Step 1の「Input your own scopes」に `https://www.googleapis.com/auth/youtube.upload` を入力して「Authorize APIs」をクリックし、Googleアカウントでログインして許可。
   * Step 2で「Exchange authorization code for tokens」をクリックし、**Refresh token** を取得します。

### 2. 環境変数の設定
プロジェクトルートにある `.env.example` をコピーして `.env` ファイルを作成し、取得した認証情報を記述します。

```bash
cp .env.example .env
```

```env
# .env
YOUTUBE_CLIENT_ID=取得したクライアントID
YOUTUBE_CLIENT_SECRET=取得したクライアントシークレット
YOUTUBE_REFRESH_TOKEN=取得したリフレッシュトークン
```

### 3. アップロードの実行
動画の書き出し（デフォルトでは `out/video.mp4` に出力されます）が完了した後、以下のコマンドを実行します。

```bash
npm run upload
```

アップロードが成功すると、限定公開（URLを知っている人のみ視聴可能）のYouTubeリンクがコンソールに表示されます。

## 構成

* `src/Root.tsx`: メインの設定ファイル。Compositionの登録とパラメータを管理します。
* `src/Audiogram/Main.tsx`: 動画のレイアウトやアニメーションのメインコンポーネントです。
* `src/Audiogram/schema.ts`: Zodを用いたパラメータのスキーマ定義です。

## ライセンスに関する注意

本テンプレートはRemotionを使用しています。商用利用など、一定の条件下ではライセンスの購入が必要になる場合があります。詳しくは [Remotionのライセンス条項](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) をご確認ください。

# AIコウチョウ 👨‍🏫

ユーザーが入力したテキストを校長先生風のスピーチに変換し、AIアバターによる動画を生成するサービス

## 📝 概要

AIコウチョウは、以下の特徴を持つWebアプリケーションです：

- 🗣️ テキストを校長先生風の話し方に変換
- 🎥 AIアバターによる動画生成
- 🔊 自然な音声合成
- 🌐 簡単なシェア機能

## 🛠️ 技術スタック

- **フロントエンド**
  - Remix
  - TailwindCSS
  - TypeScript

- **バックエンド**
  - Remix (Server Side)
  - Node.js
  - Redis

- **インフラ**
  - Google Cloud Run
  - Cloud Storage
  - Cloud Monitoring

- **AI/外部サービス**
  - Vertex AI (PaLM 2)
  - Cloud Text-to-Speech
  - D-ID

## 🚀 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-org/ai-koucho.git
cd ai-koucho

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 🔧 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```bash
SESSION_SECRET=xxx
VERTEX_AI_PROJECT_ID=xxx
CLOUD_TTS_KEY=xxx
D_ID_API_KEY=xxx
REDIS_URL=xxx
```

## 📚 ドキュメント

- [基本設計書](docs/basic_design.md)
- [アーキテクチャ設計](docs/architecture.md)
- [コンセプトプラン](docs/concept_plan.md)
- [提案書](docs/proposal.md)
- [開発ステップ](docs/steps.md)

## 🧪 テスト実行

```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e
```

## 📦 デプロイ

```bash
# ビルド
npm run build

# Cloud Runへのデプロイ
npm run deploy
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 👥 チーム

- プロジェクトオーナー: [@owner](https://github.com/owner)
- 技術リード: [@tech-lead](https://github.com/tech-lead)
- デザイナー: [@designer](https://github.com/designer)

## 🌟 謝辞

- [Google Cloud Japan](https://cloud.google.com/japan) - AIハッカソン開催
- [D-ID](https://www.d-id.com/) - アバター生成技術の提供

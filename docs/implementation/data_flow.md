# AIコウチョウ - データフロー設計

## 1. シーケンス図

### 1-1. 正常系フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant FE as フロントエンド
    participant BE as バックエンド
    participant VAI as Vertex AI
    participant TTS as Cloud TTS
    participant DID as D-ID
    participant Storage as Cloud Storage

    User->>FE: テキスト入力
    FE->>BE: 変換リクエスト
    BE->>VAI: テキスト変換
    VAI-->>BE: 変換済みテキスト
    BE->>TTS: 音声合成
    TTS-->>BE: 音声データ
    BE->>Storage: 音声ファイル保存
    BE->>DID: アバター生成リクエスト
    DID-->>BE: 生成完了通知
    BE->>Storage: 動画ファイル保存
    BE-->>FE: 生成完了通知
    FE-->>User: 結果表示
```

### 1-2. 非同期処理フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant FE as フロントエンド
    participant BE as バックエンド
    participant Queue as タスクキュー
    participant Worker as ワーカー
    participant Storage as Cloud Storage

    User->>FE: 生成リクエスト
    FE->>BE: タスク登録
    BE->>Queue: タスク追加
    BE-->>FE: タスクID返却
    Worker->>Queue: タスク取得
    Worker->>Storage: 生成物保存
    Worker->>BE: 完了通知
    BE-->>FE: WebSocket通知
    FE-->>User: 完了表示
```

### 1-3. 進捗通知フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant FE as フロントエンド
    participant BE as バックエンド
    participant WS as WebSocketサーバー
    participant Progress as 進捗管理

    User->>FE: 生成開始
    FE->>WS: WebSocket接続
    BE->>Progress: 進捗更新（テキスト変換開始）
    Progress->>WS: 進捗通知
    WS-->>FE: 進捗表示（25%）
    BE->>Progress: 進捗更新（音声生成開始）
    Progress->>WS: 進捗通知
    WS-->>FE: 進捗表示（50%）
    BE->>Progress: 進捗更新（動画生成開始）
    Progress->>WS: 進捗通知
    WS-->>FE: 進捗表示（75%）
    BE->>Progress: 進捗更新（完了）
    Progress->>WS: 完了通知
    WS-->>FE: 完了表示（100%）
```

### 1-4. キャンセルフロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant FE as フロントエンド
    participant BE as バックエンド
    participant Worker as ワーカー
    participant Storage as Cloud Storage

    User->>FE: キャンセル要求
    FE->>BE: キャンセル通知
    BE->>Worker: 処理中断指示
    Worker->>Storage: 一時ファイル削除
    Worker-->>BE: 中断完了通知
    BE-->>FE: キャンセル完了
    FE-->>User: 完了表示
```

## 2. 状態遷移図

### 2-1. タスク状態遷移

```mermaid
stateDiagram-v2
    [*] --> CREATED: タスク作成
    CREATED --> PROCESSING: 処理開始
    PROCESSING --> TEXT_CONVERTED: テキスト変換完了
    TEXT_CONVERTED --> AUDIO_GENERATED: 音声生成完了
    AUDIO_GENERATED --> VIDEO_GENERATED: 動画生成完了
    VIDEO_GENERATED --> COMPLETED: 処理完了

    PROCESSING --> FAILED: エラー発生
    TEXT_CONVERTED --> FAILED: エラー発生
    AUDIO_GENERATED --> FAILED: エラー発生

    FAILED --> RETRY: リトライ
    RETRY --> PROCESSING: 再処理

    COMPLETED --> [*]
    FAILED --> [*]: リトライ上限
```

### 2-2. データライフサイクル

```mermaid
stateDiagram-v2
    [*] --> TEMPORARY: 生成
    TEMPORARY --> PROCESSING: 処理中
    PROCESSING --> AVAILABLE: 利用可能
    AVAILABLE --> EXPIRED: 24時間経過
    EXPIRED --> DELETED: 削除
    DELETED --> [*]
```

### 2-3. 進捗状態管理

```mermaid
stateDiagram-v2
    [*] --> WAITING: キュー追加
    WAITING --> INITIALIZING: 処理準備
    INITIALIZING --> TEXT_PROCESSING: テキスト変換中
    TEXT_PROCESSING --> AUDIO_PROCESSING: 音声生成中
    AUDIO_PROCESSING --> VIDEO_PROCESSING: 動画生成中
    VIDEO_PROCESSING --> FINALIZING: 後処理中
    FINALIZING --> COMPLETED: 完了

    state CANCELLABLE {
        TEXT_PROCESSING
        AUDIO_PROCESSING
        VIDEO_PROCESSING
    }

    CANCELLABLE --> CANCELLED: キャンセル
    CANCELLED --> [*]
    COMPLETED --> [*]
```

## 3. エラーフロー図

### 3-1. エラーハンドリングフロー

```mermaid
flowchart TD
    A[エラー発生] --> B{エラー種別判定}
    B -->|一時的なエラー| C[リトライ処理]
    B -->|永続的なエラー| D[エラー記録]
    C --> E{リトライ回数確認}
    E -->|上限以内| F[バックオフ待機]
    E -->|上限超過| G[失敗確定]
    F --> H[再処理]
    D --> I[ユーザー通知]
    G --> I
    I --> J[ログ記録]
```

### 3-2. リカバリーフロー

```mermaid
flowchart TD
    A[障害検知] --> B{影響範囲特定}
    B --> C[実行中タスク特定]
    C --> D[タスク状態保存]
    D --> E[システム再起動]
    E --> F[タスク再開]
    F --> G{再開成否}
    G -->|成功| H[正常処理継続]
    G -->|失敗| I[手動対応]
```

## 4. キャッシュ戦略

### 4-1. キャッシュ階層

```mermaid
flowchart TD
    A[リクエスト] --> B{L1キャッシュ確認}
    B -->|ヒット| C[L1から返却]
    B -->|ミス| D{L2キャッシュ確認}
    D -->|ヒット| E[L2から返却]
    D -->|ミス| F[オリジン処理]
    F --> G[キャッシュ更新]
    G --> H[結果返却]
```

### 4-2. キャッシュ設定

#### メモリキャッシュ（L1）

- 対象：頻出パターン、設定値
- 保持時間：1時間
- 最大サイズ：256MB
- 更新方式：LRU

#### ディスクキャッシュ（L2）

- 対象：生成済みコンテンツ
- 保持時間：24時間
- 最大サイズ：1GB
- 更新方式：FIFO

### 4-3. キャッシュ無効化

#### 自動無効化

- TTL期限切れ
- 容量超過時
- デプロイ時

#### 手動無効化

- 緊急時の強制クリア
- パターン指定での部分削除
- 定期メンテナンス時

### 4-4. キャッシュ監視

#### 監視項目

- ヒット率
- 容量使用率
- 応答時間
- 無効化頻度

#### アラート条件

- ヒット率 70%以下
- 容量使用率 90%以上
- 応答時間 100ms以上
- 無効化頻度 10回/分以上

## 5. データ永続化

### 5-1. ストレージ構成

```mermaid
flowchart TD
    A[Cloud Storage] --> B[一時保存領域]
    A --> C[公開領域]
    A --> D[アーカイブ]

    B --> B1[音声ファイル]
    B --> B2[動画ファイル]

    C --> C1[ダウンロード用]
    C --> C2[ストリーミング用]

    D --> D1[バックアップ]
    D --> D2[統計データ]
```

### 5-2. データ保持ポリシー

#### 一時保存データ

- 音声ファイル: 処理完了後24時間
- 中間生成物: 処理完了後即時削除
- エラーログ: 7日間

#### 永続化データ

- 生成済み動画: 24時間
- 利用統計: 90日間
- システムログ: 30日間
- 監査ログ: 1年間

### 5-3. バックアップ戦略

#### 定期バックアップ

- システム設定: 日次
- 利用統計データ: 週次
- ログデータ: 月次

#### リテンション期間

- システム設定: 30世代
- 統計データ: 12ヶ月
- ログデータ: 5年

## 6. スケーリング戦略

### 6-1. 自動スケーリング条件

#### ワーカー数の制御

- 最小インスタンス数: 2
- 最大インスタンス数: 10
- スケールアウト閾値: CPU使用率80%超過
- スケールイン閾値: CPU使用率20%未満

#### キューの監視

- キュー深さ閾値: 100タスク
- 処理待ち時間閾値: 5分
- スケール間隔: 1分

### 6-2. 負荷分散

#### リージョン設定

- プライマリ: asia-northeast1
- セカンダリ: asia-northeast2
- フェイルオーバー: 自動

#### トラフィック制御

- CDN利用: 動画配信
- ロードバランサー: リクエスト分散
- レート制限: リージョンごとに設定

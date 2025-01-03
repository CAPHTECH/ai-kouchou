# AIコウチョウ - コーディング規約

## 1. TypeScript/Remix規約

### 1-1. TypeScript基本規則

#### 型定義

- 明示的な型定義を優先
- any型の使用を禁止
- unknown型を使用して型安全性を確保

```typescript
// 良い例
type User = {
  id: string;
  name: string;
  age: number;
};

// 悪い例
const user: any = { ... };
```

#### Null/Undefined

- nullの代わりにundefinedを使用
- Optional Chainingを活用
- Nullish Coalescingを使用

```typescript
// 良い例
const name = user?.name ?? '名前なし'

// 悪い例
const name = user && user.name ? user.name : '名前なし'
```

#### 非同期処理

- async/awaitを使用
- Promise.allを活用して並列処理
- エラーハンドリングを必ず実装

```typescript
// 良い例
try {
  const data = await fetchData()
} catch (error) {
  if (error instanceof Error) {
    handleError(error)
  }
}
```

#### パフォーマンス最適化

- 不要なre-renderを防ぐためのメモ化

```typescript
// 良い例
const MemoizedComponent = memo(({ data }: Props) => {
  return <div>{data}</div>
});

// useMemoの適切な使用
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);

// useCallbackの適切な使用
const handleClick = useCallback(() => {
  // 処理
}, [/* 依存配列 */]);
```

#### ディレクトリ構成

```
src/
  ├── components/
  │   ├── common/      # 共通コンポーネント
  │   ├── features/    # 機能別コンポーネント
  │   └── layouts/     # レイアウトコンポーネント
  ├── hooks/           # カスタムフック
  ├── lib/            # ユーティリティ関数
  ├── routes/         # ルート定義
  ├── styles/         # スタイル定義
  └── types/          # 型定義
```

### 1-2. Remix規約

#### ルーティング

- ネストされたルートを適切に使用
- ローダー関数でのデータ取得
- アクション関数での状態更新

```typescript
// routes/users/$userId.tsx
export const loader = async ({ params }: LoaderArgs) => {
  const user = await getUser(params.userId)
  return json({ user })
}
```

#### エラーバウンダリ

- 適切なエラーハンドリング
- カスタムエラーページの実装
- エラーログの記録

```typescript
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <h1>エラーが発生しました</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

## 2. コンポーネント設計方針

### 2-1. コンポーネント分類

#### 分類基準

- Presentational Components（見た目）
- Container Components（ロジック）
- Page Components（ページ）
- Layout Components（レイアウト）

#### 命名規則

```typescript
// Presentationalコンポーネント
export const Button = ({ label, onClick }: ButtonProps) => { ... };

// Containerコンポーネント
export const UserListContainer = () => { ... };

// Pageコンポーネント
export default function UsersPage() { ... };

// Layoutコンポーネント
export const DashboardLayout = ({ children }: PropsWithChildren) => { ... };
```

### 2-2. Props設計

#### 基本ルール

- 必須プロパティの明示
- 適切なデフォルト値の設定
- 型の再利用

```typescript
type ButtonProps = {
  label: string
  variant?: 'primary' | 'secondary'
  onClick: () => void
}

const defaultProps = {
  variant: 'primary' as const,
}
```

#### イベントハンドリング

- 関数名にhandlerPrefixを使用
- イベント型の明示
- バブリングの適切な制御

```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation()
  onClick()
}
```

### 2-3. スタイリング規約

#### CSS Modules

- コンポーネントスコープのスタイル
- BEM命名規則の採用

```typescript
// styles/Button.module.css
.button {
  /* ベーススタイル */
}

.button--primary {
  /* バリアントスタイル */
}

// Button.tsx
import styles from './Button.module.css';
```

#### テーマ設計

- デザイントークンの使用
- レスポンシブデザインの一貫性

```typescript
// styles/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    // ...
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // ...
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    // ...
  },
} as const
```

## 3. 状態管理ルール

### 3-1. 状態管理方針

#### ローカル状態

- useStateを使用
- 単一責任の原則に従う
- 状態の最小化

```typescript
const [isOpen, setIsOpen] = useState(false)
const [count, setCount] = useState(0)
```

#### グローバル状態

- Remixのloaderを優先使用
- 必要な場合のみContextを使用
- 状態の正規化

```typescript
export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

### 3-2. データフロー

#### 単方向データフロー

- 親から子へのprops伝達
- コールバック関数による状態更新
- 状態の集中管理

```typescript
function Parent() {
  const [data, setData] = useState<Data>();
  return <Child data={data} onUpdate={setData} />;
}
```

### 3-3. エラー処理

#### エラー種別

- ネットワークエラー
- バリデーションエラー
- ビジネスロジックエラー

```typescript
class ValidationError extends Error {
  constructor(public errors: Record<string, string>) {
    super('Validation Error')
    this.name = 'ValidationError'
  }
}

class NetworkError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}
```

#### エラーハンドリング方針

- エラーの集中管理
- ユーザーフレンドリーなエラーメッセージ
- エラーログの記録

```typescript
export function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    // バリデーションエラーの処理
    showValidationErrors(error.errors)
  } else if (error instanceof NetworkError) {
    // ネットワークエラーの処理
    showNetworkError(error.status)
  } else {
    // 予期せぬエラーの処理
    logError(error)
    showUnexpectedError()
  }
}
```

## 4. テスト方針

### 4-1. テスト階層

#### 単体テスト

- コンポーネントの独立したテスト
- ユーティリティ関数のテスト
- カスタムフックのテスト

```typescript
describe("Button", () => {
  it("クリック時にonClickが呼ばれる", () => {
    const onClick = vi.fn();
    render(<Button label="テスト" onClick={onClick} />);
    fireEvent.click(screen.getByText("テスト"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

#### 統合テスト

- 複数コンポーネントの結合テスト
- ルーティングのテスト
- データフローのテスト

```typescript
test("ユーザー一覧の表示と詳細画面への遷移", async () => {
  render(<UserList />);
  await screen.findByText("ユーザー一覧");
  fireEvent.click(screen.getByText("ユーザー1"));
  expect(await screen.findByText("ユーザー詳細")).toBeInTheDocument();
});
```

### 4-2. テストカバレッジ

#### カバレッジ目標

- ビジネスロジック: 90%以上
- UIコンポーネント: 80%以上
- ユーティリティ関数: 100%

#### テスト優先度

1. クリティカルなビジネスロジック
2. 複雑なデータ変換処理
3. エラーハンドリング
4. UIの基本機能

### 4-3. テストツール

#### 推奨ツール

- Vitest: 単体テスト
- Testing Library: コンポーネントテスト
- MSW: APIモック
- Playwright: E2Eテスト

#### テストユーティリティ

```typescript
// テストユーティリティの例
export function renderWithProvider(ui: React.ReactElement) {
  return render(
    <UserProvider>
      <ThemeProvider>{ui}</ThemeProvider>
    </UserProvider>
  );
}
```

### 4-4. パフォーマンス最適化

#### 測定指標

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

#### 最適化戦略

- コード分割

```typescript
// 動的インポート
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Suspenseの使用
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

- 画像最適化

```typescript
// next/imageの使用
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/image.jpg"
      alt="最適化された画像"
      width={800}
      height={600}
      loading="lazy"
    />
  );
}
```

- キャッシュ戦略

```typescript
// loaderでのキャッシュ制御
export const loader = async ({ request }: LoaderArgs) => {
  const data = await getData()
  return json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  })
}
```

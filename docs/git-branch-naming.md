# Gitブランチ命名規則

## ブランチの種類

- `main`: プロダクションブランチ
- `develop`: 開発ブランチ
- `feature/*`: 機能開発ブランチ
- `fix/*`: バグ修正ブランチ
- `hotfix/*`: 緊急バグ修正ブランチ
- `release/*`: リリース準備ブランチ

## 命名規則

### 機能開発ブランチ (feature/\*)

```
feature/[issue-number]-[feature-name]
例: feature/123-user-authentication
```

### バグ修正ブランチ (fix/\*)

```
fix/[issue-number]-[bug-description]
例: fix/456-login-error
```

### ホットフィックスブランチ (hotfix/\*)

```
hotfix/[issue-number]-[fix-description]
例: hotfix/789-security-vulnerability
```

### リリースブランチ (release/\*)

```
release/[version]
例: release/v1.0.0
```

## 注意事項

- ブランチ名は英語で記述
- 単語間はハイフン(-)で区切る
- 機能名やバグの説明は簡潔に
- イシュー番号は必ず含める

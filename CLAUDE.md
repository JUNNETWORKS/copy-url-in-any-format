# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Chrome拡張機能（Manifest V3）で、現在のページURLを様々なフォーマットでコピーできる機能を提供します。TypeScript + React + Viteで構築され、テスト駆動開発（TDD）で実装されています。

## 開発コマンド

### ビルド・開発
```bash
npm run dev        # 開発サーバー起動（ホットリロード対応）
npm run build      # プロダクションビルド（distフォルダーに出力）
npm run preview    # ビルド結果のプレビュー
```

### テスト
```bash
npm test                              # テスト実行（ウォッチモード）
npm run test:run                      # テスト実行（単発）
npm test tests/unit/formatters.test.ts # 特定のテストファイルを実行
npm run test:ui                       # UIモードでテスト実行
npm run coverage                      # カバレッジ付きテスト実行
```

### コード品質
```bash
npm run lint       # ESLintでコード検証
npm run format     # Prettierでコード整形
```

## アーキテクチャ

### コンポーネント構成

1. **Popup** (`src/popup/`)
   - 拡張機能アイコンクリック時に表示されるUI
   - 現在のタブ情報を取得し、フォーマット選択・コピー機能を提供
   - `FormatList`コンポーネントでフォーマット一覧を表示

2. **Options** (`src/options/`)
   - 拡張機能の設定画面
   - フォーマットのCRUD操作（作成・読取・更新・削除）
   - `FormatEditor`コンポーネントで編集フォームを提供

3. **Background** (`src/background/`)
   - サービスワーカー（Manifest V3）
   - 現在は最小限の実装のみ

### 共通モジュール (`src/shared/`)

1. **Types** (`types/index.ts`)
   - `Format`: フォーマット定義
   - `PageInfo`: ページ情報（title, url）
   - `FormatVariables`: フォーマット変数

2. **Formatters** (`formatters/index.ts`)
   - `formatUrl()`: テンプレートに基づいてURLをフォーマット
   - `{title}`と`{url}`プレースホルダーを置換

3. **Storage** (`storage/index.ts`)
   - `FormatStorage`クラス: Chrome Storage APIのラッパー
   - デフォルトフォーマットとカスタムフォーマットの管理

### Chrome拡張機能の構成

- **manifest.json**: Manifest V3形式
- **エントリーポイント**:
  - `popup.html` → `src/popup/index.tsx`
  - `options.html` → `src/options/index.tsx`
  - `background` → `src/background/index.ts`

### テスト戦略

- **単体テスト**: フォーマッター、ストレージクラス
- **コンポーネントテスト**: React Testing Library使用
- **Chrome APIモック**: `src/test/setup.ts`で定義
- **テストファースト開発**: 機能実装前にテストを作成

### ビルド設定

- **Vite**: 高速ビルドツール
  - マルチエントリーポイント設定（popup, options, background）
  - 出力ファイル名の固定化（[name].js形式）
- **TypeScript**: 厳格な型チェック設定
- **React**: JSX変換設定済み

## 注意事項

- Chrome拡張機能のため、`chrome.*` APIを使用
- ビルド後は`dist`フォルダーを拡張機能として読み込む
- アイコンファイルは`assets`フォルダーに配置（現在はプレースホルダー）
- Node.js 20.11.0使用（Mise管理）
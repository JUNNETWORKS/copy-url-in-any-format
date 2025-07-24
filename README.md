# Copy URL in any format

Chrome拡張機能で、現在のページのURLを様々なフォーマットでコピーできます。

## 機能

- **プリセットフォーマット**: Markdown、HTML、プレーンURLなどの一般的なフォーマットをサポート
- **カスタムフォーマット**: 独自のフォーマットを作成・保存
- **簡単操作**: 拡張機能アイコンをクリックして、ワンクリックでコピー
- **プレビュー機能**: フォーマットにマウスオーバーすると実際の出力をプレビュー
- **設定管理**: 設定画面でフォーマットの追加・編集・削除が可能

## インストール方法

### 開発版のインストール

1. このリポジトリをクローン
```bash
git clone https://github.com/yourusername/copy-url-in-any-format.git
cd copy-url-in-any-format
```

2. 依存関係をインストール
```bash
mise install
npm install
```

3. 拡張機能をビルド
```bash
npm run build
```

4. Chromeで拡張機能を読み込み
   - Chrome の設定メニューから「その他のツール」→「拡張機能」を開く
   - 右上の「デベロッパーモード」をオンにする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - ビルドした `dist` フォルダーを選択

## 使い方

### URLをコピー
1. コピーしたいページを開く
2. 拡張機能のアイコンをクリック
3. 使いたいフォーマットをクリック
4. クリップボードにコピーされます

### フォーマットの管理
1. 拡張機能のアイコンを右クリック
2. 「オプション」を選択
3. 設定画面でフォーマットを管理
   - 新規追加: 「Add New Format」ボタンをクリック
   - 編集: 各フォーマットの「Edit」ボタンをクリック
   - 削除: 各フォーマットの「Delete」ボタンをクリック

### 利用可能な変数
- `{title}` - ページのタイトル
- `{url}` - ページのURL

### フォーマット例
- Markdown: `[{title}]({url})`
- HTML: `<a href="{url}">{title}</a>`
- Textile: `"{title}":{url}`
- reStructuredText: `` `{title} <{url}>`_ ``
- AsciiDoc: `link:{url}[{title}]`
- Org-mode: `[[{url}][{title}]]`

## 開発

### 必要な環境
- Node.js 20.11.0 以上
- Chrome ブラウザ

### セットアップ
```bash
# Mise を使用している場合
mise install

# 依存関係のインストール
npm install
```

### 開発用コマンド

```bash
# 開発サーバーの起動（ホットリロード対応）
npm run dev

# プロダクションビルド
npm run build

# テストの実行
npm test

# テストの実行（UIモード）
npm run test:ui

# テストの実行（カバレッジ付き）
npm run coverage

# Lintの実行
npm run lint

# コードフォーマット
npm run format
```

### プロジェクト構造
```
copy-url-in-any-format/
├── src/
│   ├── background/          # サービスワーカー
│   ├── popup/              # ポップアップUI
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── styles.css
│   ├── options/            # 設定画面UI
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── styles.css
│   ├── shared/             # 共通ロジック
│   │   ├── formatters/     # フォーマット処理
│   │   ├── storage/        # ストレージ管理
│   │   └── types/          # 型定義
│   └── test/               # テスト設定
├── tests/                  # テストファイル
│   └── unit/
├── assets/                 # アイコン等
├── manifest.json           # Chrome拡張機能マニフェスト
├── popup.html
├── options.html
└── vite.config.ts

```

### テスト

このプロジェクトはテスト駆動開発（TDD）で作成されています。

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test tests/unit/formatters.test.ts

# ウォッチモードでテスト実行
npm test -- --watch
```

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容について議論してください。
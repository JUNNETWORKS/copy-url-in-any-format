# Copy URL in any format

A Chrome extension that allows you to copy the current page's URL in various formats.

## Features

- **Preset Formats**: Support for common formats like Markdown, HTML, plain URL, etc.
- **Custom Formats**: Create and save your own custom formats
- **Easy Operation**: Click the extension icon for one-click copying
- **Preview Feature**: Hover over a format to preview the actual output
- **Settings Management**: Add, edit, and delete formats from the settings page
- **Auto Copy**: Automatically copy when clicking a format (configurable)

## Installation

### Development Version Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/copy-url-in-any-format.git
cd copy-url-in-any-format
```

2. Install dependencies
```bash
mise install
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load the extension in Chrome
   - Open Chrome settings menu → "More tools" → "Extensions"
   - Turn on "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the built `dist` folder

## Usage

### Copying URLs
1. Open the page you want to copy
2. Click the extension icon
3. Click the format you want to use
4. The formatted URL is copied to your clipboard

### Managing Formats
1. Right-click the extension icon
2. Select "Options"
3. Manage formats on the settings page
   - Add new: Click the "Add New Format" button
   - Edit: Click the "Edit" button for each format
   - Delete: Click the "Delete" button for each format

### Available Variables
- `{title}` - Page title
- `{url}` - Page URL

### Format Examples
- Markdown: `[{title}]({url})`
- HTML: `<a href="{url}">{title}</a>`
- Textile: `"{title}":{url}`
- reStructuredText: `` `{title} <{url}>`_ ``
- AsciiDoc: `link:{url}[{title}]`
- Org-mode: `[[{url}][{title}]]`

## Development

### Requirements
- Node.js 20.11.0 or higher
- Chrome browser

### Setup
```bash
# If using Mise
mise install

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Production build
npm run build

# Run tests
npm test

# Run tests (UI mode)
npm run test:ui

# Run tests with coverage
npm run coverage

# Run lint
npm run lint

# Format code
npm run format
```

### Project Structure
```
copy-url-in-any-format/
├── src/
│   ├── background/          # Service worker
│   ├── popup/              # Popup UI
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── styles.css
│   ├── options/            # Settings page UI
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── styles.css
│   ├── shared/             # Shared logic
│   │   ├── formatters/     # Format processing
│   │   ├── storage/        # Storage management
│   │   └── types/          # Type definitions
│   └── test/               # Test configuration
├── tests/                  # Test files
│   └── unit/
├── assets/                 # Icons, etc.
├── manifest.json           # Chrome extension manifest
├── popup.html
├── options.html
└── vite.config.ts

```

### Testing

This project is developed using Test-Driven Development (TDD).

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/unit/formatters.test.ts

# Run tests in watch mode
npm test -- --watch
```

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
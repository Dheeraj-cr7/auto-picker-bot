# IndiaMART Leads Scraper

Automated web scraper for IndiaMART Buy Leads with intelligent filtering and anti-detection mechanisms.

## Features
- ✅ Automated IndiaMART login
- ✅ Smart filter application (Country, Email Required, Phone Required)
- ✅ Automated lead purchasing
- ✅ Anti-ban mechanisms (stealth mode, random delays)
- ✅ Comprehensive logging
- ✅ Error handling with screenshots
- ✅ Cookie-based session management

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your IndiaMART credentials
3. Configure filter preferences

```bash
cp .env.example .env
```

## Usage

```bash
npm start
```

## Development

```bash
npm run dev
```

This will use nodemon to auto-restart on file changes.

## Project Structure

See [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md) for detailed project structure and workflow information.

## Anti-Detection Features

- Puppeteer Stealth plugin
- Random action delays (1-3 seconds)
- User agent rotation
- Human-like mouse movements
- Proxy support (optional)
- Error screenshots

## Security

- Credentials stored in `.env` (never committed)
- Session cookies cached locally
- Rate limiting between requests
- Backoff strategy for failures

## Requirements

- Node.js v14+
- Valid IndiaMART account
- Internet connection

## Warning

Use responsibly and in accordance with IndiaMART's Terms of Service. Excessive scraping may result in account suspension.

---

For detailed setup and workflow information, see [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md)

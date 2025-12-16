# IndiaMART Leads Scraper - Project Workflow & Setup

## 📋 Project Overview
This is an automated web scraper for IndiaMART that:
- Logs into IndiaMART profile
- Navigates to the "Buy Leads" page
- Applies filters (Country, Email Required, Phone Required)
- Clicks on buy leads with intelligent delays
- Implements anti-detection mechanisms to avoid bans

## 🛠️ Tech Stack Required

### Core Libraries
- **Puppeteer** - Headless browser automation for login and page navigation
- **Puppeteer-Extra** - Enhanced Puppeteer with plugins for stealth mode
- **Puppeteer-Extra-Plugin-Stealth** - Anti-detection plugin to avoid bot detection
- **Cheerio** - HTML parsing and DOM manipulation
- **Axios** - HTTP client for additional requests
- **Winston** - Logging framework for tracking scraper activities
- **dotenv** - Environment variable management for credentials
- **p-queue** - Queue management for request throttling

### Development Tools
- **Nodemon** - Auto-restart on file changes during development

## 📁 Project Structure

```
indiamartScraper/
├── index.js                 # Main entry point (Hello World for now)
├── package.json             # Project dependencies
├── .env.example             # Example environment variables
├── .env                     # Actual credentials (git ignored)
├── .gitignore               # Git ignore file
├── PROJECT_WORKFLOW.md      # This file
├── README.md                # Documentation
├── logs/                    # Directory for log files
│   └── scraper.log
├── screenshots/             # Directory for error screenshots
├── src/
│   ├── config/
│   │   └── config.js        # Configuration loader
│   ├── auth/
│   │   └── login.js         # IndiaMART login logic
│   ├── scraper/
│   │   ├── browser.js       # Browser setup & teardown
│   │   ├── filters.js       # Filter application logic
│   │   └── buyLeads.js      # Click buy leads logic
│   ├── utils/
│   │   ├── logger.js        # Winston logger setup
│   │   ├── delay.js         # Random delay generator
│   │   ├── stealth.js       # Anti-detection mechanisms
│   │   └── helpers.js       # Utility functions
│   └── services/
│       ├── proxyService.js  # Proxy management (optional)
│       └── storageService.js # Local data storage
└── data/
    └── leads.json           # Extracted leads storage
```

## 🚀 Installation Steps

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- IndiaMART account credentials

### 2. Setup
```bash
# Navigate to project directory
cd indiamartScraper

# Install all dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
# Add your IndiaMART email, password, and other configurations
```

### 3. Verify Installation
```bash
npm start
# Should output: "Hello World - IndiaMART Leads Scraper Starting..."
```

## ⚙️ Key Features to Implement

### Anti-Detection Mechanisms
- [ ] Stealth mode plugin to hide automation signals
- [ ] Random delays between actions (1-3 seconds)
- [ ] Random user agent rotation
- [ ] Proxy support (optional)
- [ ] Human-like mouse movements
- [ ] Screenshot taking on errors
- [ ] Session persistence

### Login Flow
- [ ] Navigate to IndiaMART login page
- [ ] Fill email and password with random delays
- [ ] Handle 2FA if present
- [ ] Verify successful login

### Lead Buying
- [ ] Navigate to Buy Leads page
- [ ] Apply Country filter
- [ ] Apply Email Required filter
- [ ] Apply Phone Number Required filter
- [ ] Wait for results to load
- [ ] Click "Buy Leads" button
- [ ] Handle success/error responses

### Data Management
- [ ] Extract lead data
- [ ] Save to JSON file
- [ ] Log all actions
- [ ] Handle rate limiting
- [ ] Retry logic for failed requests

### Error Handling
- [ ] Detect and log errors
- [ ] Take screenshots on failure
- [ ] Implement retry mechanisms
- [ ] Handle bot detection responses
- [ ] Graceful shutdown

## 🔒 Security & Anti-Ban Measures
- Use Puppeteer Stealth plugin
- Implement random delays between 1-3 seconds
- Rotate user agents
- Use proxy rotation if needed
- Monitor for CAPTCHA/bot detection
- Implement backoff strategy
- Session management with cookies

## 📊 Logging & Monitoring
- Winston logger for all activities
- Separate log files for errors and info
- Console output during development
- Timestamp for each action
- Error tracking and reporting

## 🔄 Workflow
1. Load configuration from .env
2. Initialize headless browser with stealth plugins
3. Authenticate to IndiaMART
4. Navigate to Buy Leads page
5. Apply all required filters
6. Extract available leads
7. Click buy leads with anti-detection delays
8. Save results
9. Close browser gracefully
10. Generate report

## ⚠️ Important Notes
- **Rate Limiting**: Always use delays between requests
- **Cookie Management**: Save and reuse cookies to avoid repeated logins
- **Error Handling**: Implement comprehensive error catching
- **Testing**: Start with dry-run mode before actual execution
- **Monitoring**: Keep logs to detect any blocks or bans

## 📝 Next Steps
1. Install dependencies with: `npm install`
2. Copy `.env.example` to `.env` and add credentials
3. Start building individual modules in `src/` directory
4. Test each module before integrating

---
**Last Updated**: December 16, 2025

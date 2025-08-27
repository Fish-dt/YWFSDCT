# YaYa Wallet Dashboard - Project Overview

## 📁 Project Structure

```
yaya-dashboard/
├── app/                  # Next.js App Router pages and layout
├── components/           # Reusable UI components (header, table, buttons)
├── lib/                  # API service and utility functions
├── hooks/                # Custom hooks (useIsMobile)
├── public/               # Static assets (images, logos)
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## 🚀 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/FIsh-dt/yaya-dashboard-work-3
cd yaya-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the root folder:
```env
SERVER_PORT=4000
YAYA_BASE_URL=https://sandbox.yayawallet.com
YAYA_API_KEY=key-test_13817e87-33a9-4756-82e0-e6ac74be5f77
YAYA_API_SECRET=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5Ijoia2V5LXRlc3RfMTM4MTdlODctMzNhOS00NzU2LTgyZTAtZTZhYzc0YmU1Zjc3Iiwic2VjcmV0IjoiY2E5ZjJhMGM5ZGI1ZmRjZWUxMTlhNjNiMzNkMzVlMWQ4YTVkNGZiYyJ9.HesEEFWkY55B8JhxSJT4VPJTXZ-4a18wWDRacTcimNw
```


### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

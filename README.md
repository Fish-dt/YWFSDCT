# YaYa Wallet Dashboard - Project Overview


The dashboard allows users to:

- View their transaction history
- Search transactions by ID, sender, receiver, or cause
- Navigate pages using pagination
- Switch between light/dark themes
- Access mobile-friendly layout on smaller screens

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Auth**: API Key + Secret (HMAC-ready)
- **HTTP**: Native Fetch API
- **Dev**: TypeScript, ESLint
  
## 🚀 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Fish-dt/yaya-wallet-dashboard
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
These credentials are test credentials, they are placed here for the purpose of elaboration.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

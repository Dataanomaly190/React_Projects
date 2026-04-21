# Invoice Generator

A professional-grade invoicing application with full management capabilities for drafts and transaction history.

## Features

- **Invoice Creation**: Simplified form for generating professional invoices.
- **History Management**: Track and view past invoices through a dedicated history server.
- **Draft System**: Save work-in-progress invoices for later completion.
- **Multi-Service Architecture**: Uses separate micro-servers for invoices, history, and drafts.
- **Modern Routing**: Smooth navigation between Home, Invoice, History, and Draft pages.

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js (Concurrent services)
- **Styling**: Modular CSS

## Setup Instructions

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the application**:
   This project uses `concurrently` to start both the frontend and the three backend servers (Invoice, History, Draft) simultaneously.

   ```bash
   npm run dev
   ```

---

# PROJECT_STATE.md — Comprehensive Repository Audit & Handoff Document

> **Authoritative Handoff Document for Future Codex & Development Sessions**  
> **Last Audited:** September 9, 2026  
> **Audit Status:** Read-Only Complete  
> **Repository:** `procurement--main` (ProcureAI Platform Frontend)

---

## 1. Project Overview

* **Application Name:** ProcureAI (Package Name: `procurement`)
* **Current Purpose:** An enterprise-grade, dark-themed Single Page Application (SPA) frontend designed as an AI-powered procurement and supply chain management platform. It allows users to manage suppliers, RFQs, quotations, purchase orders, inventory, spend analytics, price forecasting, supplier risk intelligence, and interactive AI assistance.
* **Technology Stack:**
  * **Core Library:** React `^19.2.8`
  * **Language:** TypeScript `~6.0.2`
  * **Build System & Dev Server:** Vite `^8.2.0` (`@vitejs/plugin-react` `^6.0.4`)
  * **Styling Engine:** Tailwind CSS `^4.3.3` with `@tailwindcss/vite` `^4.3.3`
  * **Utility Libraries:** `clsx` `^2.1.1`, `tailwind-merge` `^3.6.0`
  * **Icons:** `lucide-react` `^1.31.0`
  * **Visualization / Charts:** `recharts` `^3.10.1`
  * **Linter:** `oxlint` `^1.75.0`
* **Entry Points:**
  1. `index.html` — HTML shell mounting to `#root` element.
  2. [src/main.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/main.tsx) — React DOM root renderer.
  3. [src/App.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/App.tsx) — Root application component wrapped in `ProcurementProvider` (`src/context/ProcurementContext.tsx`).

---

## 2. Repository Structure

```
procurement--main/
├── public/
│   ├── favicon.svg                 # Application browser icon
│   └── icons.svg                   # SVG icon assets
├── src/
│   ├── assets/                     # Static image assets (hero.png, react.svg, vite.svg)
│   ├── components/                 # UI View Components grouped by domain
│   │   ├── auth/
│   │   │   └── AuthViews.tsx       # Sign In, Registration, Password Reset & Demo Login screen
│   │   ├── dashboard/
│   │   │   └── DashboardView.tsx   # Executive overview dashboard with KPIs & AI alerts
│   │   ├── forecast/
│   │   │   └── PriceForecastView.tsx # Price forecasting chart (Recharts) & AI Purchase Plan trigger
│   │   ├── intelligence/
│   │   │   ├── AIAssistantView.tsx # Interactive AI chat assistant interface
│   │   │   └── AIRecommendationsView.tsx # Full AI recommendations catalog & action router
│   │   ├── inventory/
│   │   │   └── InventoryView.tsx   # Inventory tracking, stock health & automated reorder trigger
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Shell wrapper containing Sidebar, Header & Modals
│   │   │   ├── Header.tsx          # Top navigation bar with search, notifications & profile
│   │   │   └── Sidebar.tsx         # Left navigation drawer with collapsible state
│   │   ├── modals/
│   │   │   ├── AIProcessingModal.tsx # Global animated progress modal for AI operations
│   │   │   └── GlobalSearchModal.tsx # Cmd+K global search dialog across entities
│   │   ├── notifications/
│   │   │   └── NotificationDrawer.tsx # Slide-out drawer for user notifications
│   │   ├── orders/
│   │   │   └── PurchaseOrdersView.tsx # Purchase Order (PO) tracking table & status filter
│   │   ├── reports/
│   │   │   └── ReportsView.tsx     # Executive reporting engine & CSV download export
│   │   ├── rfq/
│   │   │   ├── QuotationComparisonView.tsx # Side-by-side quotation decision matrix
│   │   │   └── RFQsView.tsx        # RFQ management table & RFQ creation modal form
│   │   ├── risk/
│   │   │   └── SupplierRiskView.tsx # Supplier risk intelligence engine & pie chart
│   │   ├── settings/
│   │   │   └── SettingsView.tsx    # User profile & interactive AI scoring weight sliders
│   │   └── spend/
│   │       └── SpendAnalyticsView.tsx # Category & vendor spend analytics charts
│   ├── context/
│   │   └── ProcurementContext.tsx  # Centralized React Context state & localStorage sync
│   ├── data/
│   │   └── mockData.ts             # Static mock datasets for all procurement entities (1170+ lines)
│   ├── types/
│   │   └── procurement.ts          # Complete TypeScript interfaces & type declarations
│   ├── App.css                     # Minimal container styling
│   ├── App.tsx                     # Main view router component
│   ├── index.css                   # Custom Tailwind CSS theme, scrollbars & glassmorphism classes
│   └── main.tsx                    # React application bootstrapper
├── .gitignore                      # Git exclusion file
├── .oxlintrc.json                  # Oxlint linter settings
├── index.html                      # Main HTML page
├── package.json                    # Project dependencies & npm scripts
├── tsconfig.app.json               # TypeScript config for application source
├── tsconfig.json                   # Root TypeScript config
├── tsconfig.node.json              # TypeScript config for Vite/Node tools
└── vite.config.ts                  # Vite build setup with path alias (@ -> ./src)
```

---

## 3. Application Architecture

```
                       +---------------------------------------+
                       |           index.html                  |
                       +---------------------------------------+
                                           |
                                           v
                       +---------------------------------------+
                       |           src/main.tsx                |
                       +---------------------------------------+
                                           |
                                           v
                       +---------------------------------------+
                       |           src/App.tsx                 |
                       |    (<ProcurementProvider>)            |
                       +---------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
       (if !isAuthenticated)                             (if isAuthenticated)
                    v                                             v
        +-----------------------+                     +-----------------------+
        |   AuthViews.tsx       |                     |    AppLayout.tsx      |
        +-----------------------+                     +-----------------------+
                                                                  |
                                       +--------------------------+--------------------------+
                                       |                          |                          |
                                       v                          v                          v
                            +--------------------+     +--------------------+     +--------------------+
                            |    Sidebar.tsx     |     |    Header.tsx      |     |  Global Modals     |
                            | (Nav Selection)    |     | (Search/Notifs)    |     | Search & Processing|
                            +--------------------+     +--------------------+     +--------------------+
                                       |                          |                          |
                                       +--------------------------+--------------------------+
                                                                  |
                                                                  v
                                                     +--------------------------+
                                                     |    Active View Component |
                                                     | (switch on `activePage`) |
                                                     +--------------------------+
                                                                  |
                                                                  v
                                                     +--------------------------+
                                                     |   ProcurementContext     |
                                                     |  (React State & LocalS)  |
                                                     +--------------------------+
                                                                  |
                                                                  v
                                                     +--------------------------+
                                                     |     src/data/mockData.ts |
                                                     +--------------------------+
```

### Communication Flow:
1. **Routing:** State-based routing handled by `activePage` in `ProcurementContext.tsx`. `App.tsx` conditionally mounts the appropriate view component. There is **no URL path routing** (no React Router).
2. **State Management:** All state (`suppliers`, `rfqs`, `quotations`, `purchaseOrders`, `inventory`, `notifications`, `recommendations`, `chatMessages`, `scoringWeights`) is stored in React `useState` hooks inside `ProcurementContext.tsx`.
3. **Persistence:** On initial mount, state falls back to `mockData.ts`. Any state mutation automatically synchronizes to browser `localStorage` (`procureai_suppliers`, `procureai_rfqs`, `procureai_quotations`, `procureai_orders`, `procureai_inventory`, `procureai_notifications`).
4. **Data Access:** All components access and modify global state via the `useProcurement()` hook.
5. **API & Services Layer:** **0 external network calls exist.** All AI operations (e.g., quotation evaluation, risk scans, reorder recommendations) trigger simulated progress timers (`setInterval`) inside `ProcurementContext.tsx` that update local state directly.

---

## 4. Complete Route/Page Inventory

| Route (`activePage`) | Purpose | Main Component | Primary User Actions | Data Displayed | Implementation Status | Key Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `auth` (`!isAuthenticated`) | User login, signup & demo access | `AuthViews.tsx` | Demo Login, Sign In, Register, Password Reset submit | Pre-filled demo user credentials, security certifications | Fully functional UI with local state toggle | `lucide-react`, `ProcurementContext` |
| `dashboard` | Executive procurement overview | `DashboardView.tsx` | Click KPI cards to navigate, click recommendation cards to route to target entities | Total Spend ($1.24M), Active Suppliers (128), Open RFQs (24), Potential Savings ($184K), AI Recs, High Risk alerts | Fully implemented UI, static KPI totals | `lucide-react`, `ProcurementContext` |
| `suppliers` | Supplier relationship & performance directory | `SuppliersView.tsx` | Filter by risk/category, search, select supplier detail, trigger AI Risk Scan | Supplier list, performance scores, quality scores, risk levels, financial/delivery risk breakdown | Fully implemented UI with local state selection | `lucide-react`, `ProcurementContext` |
| `rfqs` | Request for Quotation management | `RFQsView.tsx` | Search, open Create RFQ modal form, submit new RFQ, navigate to Quotations view | RFQ list, status badges, invited suppliers count, target price, deadline | Fully implemented UI with real state insertion to `localStorage` | `lucide-react`, `ProcurementContext` |
| `quotations` | Multi-criteria quotation evaluation matrix | `QuotationComparisonView.tsx` | Select RFQ dropdown, adjust scoring weight sliders, trigger AI evaluation timer, award PO | Side-by-side quotation comparison table, unit prices, delivery days, quality ratings, AI scores, recommended quote callout | Fully implemented UI; weight sliders update state but don't recalculate raw scores | `lucide-react`, `ProcurementContext` |
| `orders` | Purchase Orders (POs) tracking | `PurchaseOrdersView.tsx` | Search POs by ID/supplier/product, click "Award PO from RFQ" | PO list, total amounts, expected delivery dates, fulfillment status badges | Fully implemented UI | `lucide-react`, `ProcurementContext` |
| `inventory` | Stock inventory & demand monitoring | `InventoryView.tsx` | Filter by category, trigger AI Reorder Recommendation for critical items | Inventory table, SKU, stock levels, daily demand, reorder points, stock status badges | Fully implemented UI; reorder action auto-creates an RFQ in state | `lucide-react`, `ProcurementContext` |
| `spend` | Procurement spend analytics & trend visualization | `SpendAnalyticsView.tsx` | Toggle timeframe (7D, 30D, 3M, 12M) | Spend trend area chart, category spend pie chart, top 6 vendor spend bar chart | Fully implemented UI with Recharts visualizations | `recharts`, `lucide-react`, `ProcurementContext` |
| `recommendations` | Catalog of AI-identified strategic recommendations | `AIRecommendationsView.tsx` | Filter by category/priority, click action links to navigate to specific workspace tools | List of AI recommendations, confidence percentages, potential cost impact, priority badges | Fully implemented UI with action routing | `lucide-react`, `ProcurementContext` |
| `risk` | Supplier risk intelligence monitoring engine | `SupplierRiskView.tsx` | Select supplier, trigger AI Risk Scan, toggle mitigation plan view | Risk level distribution pie chart, risk breakdown meters, risk reason, recommended mitigation plan | Fully implemented UI with Recharts pie chart | `recharts`, `lucide-react`, `ProcurementContext` |
| `forecast` | Commodity price forecasting & trend analysis | `PriceForecastView.tsx` | Select commodity material (Steel, Copper, Aluminum, etc.), trigger AI Purchase Plan | Historical & 30-day forecast trend chart with confidence band area, AI recommendation summary | Fully implemented UI with Recharts ComposedChart | `recharts`, `lucide-react`, `ProcurementContext` |
| `assistant` | Conversational AI procurement assistant | `AIAssistantView.tsx` | Send chat message, click suggested questions, click embedded action links | Chat transcript, user/AI message bubbles, structured data tables in chat responses, action links | Fully implemented UI with keyword-matching mock response generator | `lucide-react`, `ProcurementContext` |
| `reports` | Executive procurement report generation & export | `ReportsView.tsx` | Select report type, generate report, export to CSV, trigger PDF download stub | Report description, data preview table, download triggers | Fully implemented UI; CSV export generates real browser file download | `lucide-react`, `ProcurementContext` |
| `settings` | Platform settings & AI configuration | `SettingsView.tsx` | Adjust multi-criteria AI weight sliders (Price, Quality, Delivery, Risk, Performance), save settings | User profile details, access level, interactive weight sliders | Fully implemented UI with state persistence | `lucide-react`, `ProcurementContext` |

---

## 5. Component Inventory

### Reusable Layout & System Components
1. **[AppLayout.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/layout/AppLayout.tsx)**
   * **Purpose:** Root layout container for authenticated screens.
   * **Used In:** `App.tsx`
   * **Props:** `{ children: React.ReactNode }`
   * **State:** `sidebarCollapsed` (boolean)
   * **Dependencies:** `Sidebar`, `Header`, `GlobalSearchModal`, `AIProcessingModal`
2. **[Sidebar.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/layout/Sidebar.tsx)**
   * **Purpose:** Fixed left navigation panel with section groupings ("Procurement", "Intelligence", "Management"), badges, and collapse toggle.
   * **Used In:** `AppLayout.tsx`
   * **Props:** `{ collapsed: boolean; setCollapsed: (val: boolean) => void }`
   * **Dependencies:** `useProcurement()`, `lucide-react`
3. **[Header.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/layout/Header.tsx)**
   * **Purpose:** Fixed top navigation bar containing global search trigger (`⌘K`), AI Assistant chip, notification bell with unread counter, and user profile dropdown menu.
   * **Used In:** `AppLayout.tsx`
   * **Props:** `{ sidebarCollapsed: boolean }`
   * **Dependencies:** `useProcurement()`, `NotificationDrawer`, `lucide-react`
4. **[GlobalSearchModal.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/modals/GlobalSearchModal.tsx)**
   * **Purpose:** Keyboard-driven (`Cmd+K` / `Ctrl+K`) modal dialog for instantaneous search filtering across Suppliers, RFQs, Inventory, and Recommendations.
   * **Used In:** `AppLayout.tsx`
   * **Props:** None
   * **Dependencies:** `useProcurement()`, `lucide-react`
5. **[AIProcessingModal.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/modals/AIProcessingModal.tsx)**
   * **Purpose:** Global animated processing modal displaying multi-step progress status and completion results for async AI simulations.
   * **Used In:** `AppLayout.tsx`
   * **Props:** None
   * **Dependencies:** `useProcurement()`, `lucide-react`
6. **[NotificationDrawer.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/notifications/NotificationDrawer.tsx)**
   * **Purpose:** Slide-over right drawer displaying system notifications, unread badges, filter tabs, mark-all-as-read, and navigation routing links.
   * **Used In:** `Header.tsx`
   * **Props:** `{ isOpen: boolean; onClose: () => void }`
   * **Dependencies:** `useProcurement()`, `lucide-react`

---

## 6. Current User Flows

### Flow 1: RFQ Creation & Dispatch
`User` → Navigation to `RFQs` view (`activePage = 'rfqs'`) → Clicks "+ Create RFQ" button → Fills form (Product Name, Category, Quantity, Unit, Target Price, Deadline, Delivery Date, Description, Invited Suppliers) → Submits Form → `createRFQ()` called in `ProcurementContext` → New RFQ object created with ID `RFQ-2026-xxx` → Added to `rfqs` state & saved to `localStorage` → New Notification generated → RFQ table updates instantly.

### Flow 2: AI Quotation Evaluation & Awarding
`User` → Navigation to `Quotations` view (`activePage = 'quotations'`) → Selects RFQ from dropdown → Reviews side-by-side quotations → Adjusts scoring weights (Price, Quality, Delivery, Risk, Performance) → Clicks "Evaluate Quotations with AI" → `evaluateQuotationsAI(rfqId)` triggers `AIProcessingModal` → Runs 4-step timed progress animation (900ms per step) → Updates winning quotation status to `RECOMMENDED` with 94% score → User clicks "Award PO" → Navigates to Purchase Orders view.

### Flow 3: AI Supplier Risk Analysis Deep-Dive
`User` → Navigation to `Supplier Risk` view (`activePage = 'risk'`) → Selects target supplier → Reviews risk meters and solvency metrics → Clicks "Re-Run AI Risk Scan" → `runSupplierRiskAnalysisAI(supplierId)` triggers `AIProcessingModal` → Runs 4-step progress animation → Updates target supplier risk score to 85, financial risk to 92, and updates `riskReason` text in state & `localStorage`.

### Flow 4: Critical Inventory Reorder Workflow
`User` → Navigation to `Inventory` view (`activePage = 'inventory'`) → Identifies item with `CRITICAL` or `LOW_STOCK` status → Clicks "Generate Reorder Recommendation" → `generateReorderRecommendationAI(inventoryId)` triggers `AIProcessingModal` → Runs 4-step progress animation → Automatically creates a new replenishment RFQ in state with 2x reorder point quantity → Navigates to RFQs view to inspect generated draft.

### Flow 5: Interactive AI Chat Assistant
`User` → Clicks "AI Assistant" chip in Header or Sidebar → Enters question or clicks suggested chip (e.g. "Which suppliers are high risk?") → `sendChatMessage(text)` appends user message to transcript → Sets typing indicator → After 800ms timeout, evaluates keyword string patterns → Appends AI response message with Markdown formatting, structured data table, and interactive action link buttons.

### Flow 6: CSV Report Export
`User` → Navigation to `Reports` view (`activePage = 'reports'`) → Selects report type (e.g., "Supplier Risk Audit Report") → Clicks "Generate & Preview Report" → Clicks "Export CSV Data" → `handleExportCSV()` dynamically constructs CSV data string from React state → Creates inline `a[download]` element and triggers browser file download.

---

## 7. Data Model

All domain data interfaces are declared in [src/types/procurement.ts](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/types/procurement.ts).

### Key Entities:
1. **`Supplier`**: ID, name, category, spend, performance score (0-100), delivery rate, quality score, risk score, risk level (`LOW`|`MEDIUM`|`HIGH`), status (`ACTIVE`|`PENDING`|`FLAGGED`|`INACTIVE`), location, email, phone, contract expiry date, financial risk, delivery risk, quality risk, price stability score, risk reason, recent RFQ count, lead time, complaint rate.
2. **`RFQ`**: ID, title, product, category, quantity, unit, target price, deadline, invited suppliers count, response count, status (`DRAFT`|`OPEN`|`IN_EVALUATION`|`AWARDED`|`CLOSED`), creation date, delivery date, description, invited supplier IDs.
3. **`Quotation`**: ID, RFQ ID, supplier ID, supplier name, price, currency, delivery days, quality rating %, payment terms, risk rating, historical performance %, overall score %, status (`PENDING`|`SHORTLISTED`|`RECOMMENDED`|`ACCEPTED`|`REJECTED`), submitted date, notes.
4. **`PurchaseOrder`**: ID, RFQ ID (optional), supplier name, product, quantity, unit, total amount, status (`ISSUED`|`IN_TRANSIT`|`FULFILLED`|`CANCELLED`), issue date, expected delivery date.
5. **`InventoryItem`**: ID, product, SKU, category, current stock, daily demand, reorder point, lead time days, status (`HEALTHY`|`LOW_STOCK`|`CRITICAL`|`OVERSTOCKED`), unit price, unit, supplier name, critical days left.
6. **`SpendRecord`**: Month, direct materials, logistics, electronics, MRO, packaging, total spend, savings opportunity.
7. **`PriceForecast`**: Material name (`Steel`|`Copper`|`Aluminum`|`Electronic Components`|`Plastic`), current price, unit, 30-day forecast price, expected change %, confidence %, AI recommendation text, historical data points, forecast data points (with lower/upper confidence bounds).
8. **`AIRecommendation`**: ID, title, category, description, potential impact, savings amount, confidence %, priority (`HIGH`|`MEDIUM`|`LOW`), recommended action, action type (`NAVIGATE_SUPPLIER`|`CREATE_RFQ`|`EVALUATE_QUOTE`|`REORDER_INVENTORY`|`PURCHASE_PLAN`), target ID, status.
9. **`Notification`**: ID, title, description, timestamp, type, read boolean, target page, target ID.
10. **`User`**: ID, name, email, role, avatar URL, department, organization.
11. **`ChatMessage`**: ID, sender (`user`|`ai`), text, timestamp, suggestions, data table headers & rows, action link.
12. **`ScoringWeights`**: Price weight, quality weight, delivery weight, risk weight, performance weight.

### Data Classification:

```
+-----------------------------------------------------------------------------------+
| REAL DATA                                                                         |
| - None. 0 live backend APIs or external databases connected.                      |
+-----------------------------------------------------------------------------------+
| MOCK DATA                                                                         |
| - All initial objects in `src/data/mockData.ts` (128 suppliers total spend,       |
|   RFQ lists, quotation score values, mock chat transcripts, user profiles).       |
| - Persisted locally in browser `localStorage`.                                    |
+-----------------------------------------------------------------------------------+
| ASSUMED DATA                                                                      |
| - Solvency risk scores, 30-day commodity price trends, delivery delay variances,  |
|   AI recommendation confidence percentages (hardcoded constants in UI).           |
+-----------------------------------------------------------------------------------+
| MISSING DATA                                                                      |
| - Implicit dependency graph nodes/edges, natural language semantic intent         |
|   schemas, counterfactual policy simulator rules, real ERP connector payloads.    |
+-----------------------------------------------------------------------------------+
```

---

## 8. API / Backend Integration

* **Current Status:** **NO BACKEND EXISTS.**
* **API Endpoints:** `0` endpoints.
* **HTTP Client:** Neither `axios` nor native `fetch()` are used anywhere in the codebase.
* **Authentication:** Simulated. `loginWithDemo()` sets `isAuthenticated = true` in React state and loads `initialUser` object. `logout()` sets `isAuthenticated = false`. No JWT, session cookies, OAuth2, or backend validation exist.

---

## 9. AI/LLM Integration

* **Current Status:** **100% MOCKED FRONTEND SIMULATION.**
* **AI Provider / Models:** None connected.
* **Prompts:** None sent to external LLMs.
* **Implementation Details:**
  * **Processing Animations:** Functions like `evaluateQuotationsAI()`, `runSupplierRiskAnalysisAI()`, `generatePurchasePlanAI()`, and `generateReorderRecommendationAI()` trigger `AIProcessingModal` with hardcoded arrays of step strings and cycle through them using a `setInterval` timer (step duration: 900ms).
  * **Chatbot:** [src/context/ProcurementContext.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/context/ProcurementContext.tsx#L369-L422) evaluates string keywords (`includes('risk')`, `includes('rfq')`, `includes('steel')`, `includes('save')`) in a JavaScript `setTimeout` callback (800ms delay) and appends pre-formatted mock text and tables.

---

## 10. Procurement Decision Logic

| Logic Area | Existing Code Implementation | Source Location | Reality Assessment |
| :--- | :--- | :--- | :--- |
| **Multi-Criteria Quotation Scoring** | Interactive sliders update `scoringWeights` state (`price`, `quality`, `delivery`, `risk`, `performance`). | [SettingsView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/settings/SettingsView.tsx), [QuotationComparisonView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/rfq/QuotationComparisonView.tsx) | **Partial/UI-only:** Changing weights updates state, but quote overall scores (e.g. 94%) are static constants and NOT dynamically calculated using the weight math. |
| **Supplier Risk Scoring** | Categorizes suppliers into `HIGH`, `MEDIUM`, `LOW` based on `riskScore >= 75` or `riskLevel`. | [SuppliersView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/suppliers/SuppliersView.tsx), [SupplierRiskView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/risk/SupplierRiskView.tsx) | **Static UI Mock:** Risk scores are hardcoded in `mockData.ts`. AI risk scan simply sets `riskScore = 85`. |
| **Inventory Replenishment Trigger** | Evaluates stock status (`CRITICAL`, `LOW_STOCK`, `HEALTHY`) by comparing `currentStock` against `reorderPoint`. | [InventoryView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/inventory/InventoryView.tsx) | **Simple UI Condition:** UI applies badge styles based on string enum. AI reorder trigger hardcodes a new RFQ with quantity `reorderPoint * 2`. |
| **Commodity Price Forecasting** | Combines static historical data points with 30-day forecast points and lower/upper bounds. | [PriceForecastView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/forecast/PriceForecastView.tsx) | **Static Data Render:** Forecast data is pre-populated in `mockData.ts`. No predictive ML model or regression algorithm exists. |
| **Spend Aggregation** | Filters monthly spend array by selected timeframe (`7D`, `30D`, `3M`, `12M`). | [SpendAnalyticsView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/spend/SpendAnalyticsView.tsx) | **Simple Array Slice:** `spendData.slice(-1)`, `spendData.slice(-3)`, etc. |
| **Report Export** | Constructs CSV formatted string from `suppliers` or `spendData` arrays in React memory. | [ReportsView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/reports/ReportsView.tsx) | **Functional Client Export:** Real client-side CSV Blob generation. PDF export is an `alert()` stub. |

---

## 11. UI/UX System

* **Styling Approach:** Tailwind CSS v4 using modern `@import "tailwindcss";` directive in `src/index.css`.
* **Theme:** Deep Dark Mode theme built on Slate palette (`bg-slate-950` `#070b14`).
* **Accent Palette:**
  * **Cyan:** Primary AI brand color (`#06b6d4`, `text-cyan-400`, `border-cyan-500/30`).
  * **Blue:** Secondary primary (`#3b82f6`, `bg-blue-600`).
  * **Emerald:** Success, healthy inventory, low risk (`#10b981`).
  * **Amber:** Warnings, low stock, medium risk (`#f59e0b`).
  * **Rose:** Critical alerts, high risk, cancelled orders (`#f43f5e`).
* **Custom CSS Utilities (`src/index.css`):**
  * `.glass-panel`: Semi-transparent background with backdrop blur (`background: rgba(15, 23, 42, 0.75)`, `backdrop-filter: blur(16px)`).
  * `.glass-panel-hover`: Hover state transition with subtle elevation and border highlight.
  * `.electric-glow`, `.glow-cyan`, `.glow-rose`, `.glow-emerald`: Colored outer box-shadow glows.
  * `.animate-pulse-glow`: Pulse keyframe animation for AI chips.
* **Typography:** Inter / system sans-serif font stack.
* **Iconography:** Lucide React (`lucide-react`) icons throughout all views.
* **Charts Engine:** Recharts (`ResponsiveContainer`, `AreaChart`, `BarChart`, `PieChart`, `ComposedChart`).

---

## 12. Current Procurement Feature Mapping

| Planned Capability | Existing UI | Existing Logic | Backend Required | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Semantic Intent & Asset Interceptor** | Partial (Create RFQ Modal in `RFQsView.tsx` accepts product title & description string) | None (Simple form submit pushes raw object into state) | Yes (NPL parser, entity extractor, organizational asset catalog matching) | **Mock / Missing** |
| **Implicit Dependency Graph** | None (No graph visualization or dependency tree component exists) | None (No graph structure or relationship traversal logic exists) | Yes (Graph database e.g., Neo4j / Postgres, bill-of-materials dependency engine) | **Completely Missing** |
| **Counterfactual Policy Simulator** | Partial (Scoring weight sliders in `QuotationComparisonView` & Purchase Plan modal in `PriceForecastView`) | None (Simulated timers with static result summaries) | Yes (Policy engine, constraint solver, scenario simulation engine) | **Mock / Missing** |
| **Innovative Feature 4** | None | None | Yes | **Not Decided** |
| **Innovative Feature 5** | None | None | Yes | **Not Decided** |

---

## 13. Missing Architecture

To transition this frontend prototype into a production-ready application, the following backend components must be implemented:

1. **Backend API Service:** REST or GraphQL API server (e.g., Express, FastAPI, Go, NestJS) providing real HTTP endpoints for all procurement entities.
2. **Database System:**
   * **Relational DB (PostgreSQL / MySQL):** For storing users, organizations, suppliers, RFQs, quotations, purchase orders, inventory, and audit trails.
   * **Graph DB (Neo4j / PostgreSQL Apache AGE):** For storing organizational asset dependency graphs and supply chain relationship trees.
3. **AI / LLM Agent Engine:**
   * Natural Language Intent Parser to intercept requests before procurement creation.
   * RAG (Retrieval-Augmented Generation) pipeline over corporate procurement policy documents and contract archives.
   * LLM Agent Integration (e.g., LangChain / LlamaIndex / Gemini API) for conversational assistant.
4. **Procurement Decision Engine:** Deterministic calculation service for multi-criteria quotation scoring, total cost of ownership (TCO) evaluation, and counterfactual policy simulation.
5. **Data Ingestion & ERP Connectors:** Ingestion pipelines for external ERP systems (SAP, Oracle, NetSuite), live commodity market data feeds, and supplier credit risk feeds.
6. **Authentication & Authorization:** Production Auth framework (JWT, OAuth2, SAML/SSO, Clerk, Firebase Auth) with Role-Based Access Control (RBAC).
7. **Background Job Queue:** Asynchronous task queue (Redis + BullMQ / Celery) for long-running risk scans, price prediction updates, and notification triggers.

---

## 14. Technical Risks

1. **Custom State-Based Navigation (`activePage`):** The app uses string state in `ProcurementContext` instead of standard browser routing (e.g., React Router). **Consequences:** Browser `Back` and `Forward` buttons do not work; URLs cannot be bookmarked or shared; deep-linking requires manual context state manipulation.
2. **`localStorage` Data Serialization:** The app serializes entire entity arrays to `localStorage`. **Consequences:** Adding new required fields to TypeScript interfaces in future updates will cause runtime errors for users with old cached `localStorage` data until cleared.
3. **Hardcoded AI & Scoring Disconnect:** Weight sliders in `QuotationComparisonView` update `scoringWeights` state, but overall quotation scores (e.g. `94%`) do not recalculate. **Consequences:** Future developers might assume the scoring matrix logic is functioning when it is entirely static.
4. **No Error Boundaries or Form Validation:** Forms (e.g., Create RFQ, Login) perform minimal validation and lack global React Error Boundaries.
5. **In-Memory Data Scaling:** All 128 suppliers, RFQs, quotations, and inventory items are loaded into client memory simultaneously. **Consequences:** Will cause browser memory degradation if connected directly to large enterprise datasets without backend pagination.

---

## 15. Recommended Implementation Boundaries

To preserve clean architecture as backend services are built, responsibility should be partitioned as follows:

```
+-----------------------------------------------------------------------------------+
| FRONTEND LAYER (React + Vite)                                                     |
| - UI Rendering, Glassmorphic Design System, Recharts Visualizations.              |
| - User Input Forms & Interactive Sliders.                                         |
| - Client-side View Routing & Modal Controllers.                                   |
+-----------------------------------------------------------------------------------+
                                         | (REST / HTTP Requests)
                                         v
+-----------------------------------------------------------------------------------+
| BACKEND API LAYER (Node.js / FastAPI / Go)                                        |
| - Authentication & RBAC Middleware.                                               |
| - Deterministic Business Logic & Multi-Criteria Scoring Math.                     |
| - Counterfactual Policy Simulation Engine.                                        |
| - Dependency Graph Query Handler.                                                 |
+-----------------------------------------------------------------------------------+
                    |                                       |
                    v                                       v
+---------------------------------------+   +---------------------------------------+
| LLM ENGINE (Gemini / OpenAI / Custom) |   | DATABASE LAYER (PostgreSQL + Neo4j)   |
| - Natural Language Intent Parsing.    |   | - Entity Records (Suppliers, RFQs).   |
| - Semantic Asset Interceptor.         |   | - Graph Nodes & Edges (Dependencies).  |
| - RAG over Procurement Policies.      |   | - Audit Logs & History.               |
+---------------------------------------+   +---------------------------------------+
```

---

## 16. Exact Files Likely to Change

When implementing real backend integration and pre-procurement capabilities, the following existing files will require modification:

1. **[src/types/procurement.ts](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/types/procurement.ts):**
   * *Why:* To define API payload types, intent interceptor schemas, dependency graph node/edge types, and policy simulation request/response parameters.
2. **[src/context/ProcurementContext.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/context/ProcurementContext.tsx):**
   * *Why:* To replace local `localStorage` reads/writes and mock timer functions with real async HTTP API client calls.
3. **[src/components/rfq/RFQsView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/rfq/RFQsView.tsx):**
   * *Why:* To connect the Create RFQ form to the Semantic Intent & Asset Interceptor before creating an RFQ.
4. **[src/components/rfq/QuotationComparisonView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/rfq/QuotationComparisonView.tsx):**
   * *Why:* To connect multi-criteria weight sliders to the backend decision calculation engine for dynamic score re-computation.
5. **[src/components/intelligence/AIAssistantView.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/components/intelligence/AIAssistantView.tsx):**
   * *Why:* To stream responses from a real LLM endpoint instead of keyword string matching.
6. **[src/App.tsx](file:///c:/Users/Lenovo/Downloads/procurement--main/procurement--main/src/App.tsx):**
   * *Why:* Optional refactoring to introduce URL-based routing (e.g. React Router) if requested.

---

## 17. Environment & Run Instructions

### Prerequisites:
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher

### Commands (Verified from `package.json`):
* **Install Dependencies:** `npm install`
* **Development Server:** `npm run dev` (Runs Vite dev server, typically at `http://localhost:5173`)
* **Production Build:** `npm run build` (Runs `tsc -b && vite build`)
* **Preview Production Build:** `npm run preview` (Runs `vite preview`)
* **Linting:** `npm run lint` (Runs `oxlint`)

### Environment Variables:
* Currently **no `.env` file or environment variables exist** in the repository.

---

## 18. Current Problems / TODOs

1. **Zero Real Backend Connection:** All data is read from `mockData.ts` or `localStorage`.
2. **Missing Dependency Graph Component:** The project currently has no visual UI or data model for the "Implicit Dependency Graph" feature.
3. **Missing Intent Interceptor UI:** RFQ creation does not intercept user intent to evaluate internal asset availability prior to purchase.
4. **Static PDF Report Export:** Clicking "Export PDF" in `ReportsView.tsx` triggers a browser `alert()` pop-up stub (`"Downloading ProcureAI REPORT Report (PDF Format)..."`).
5. **Static Quotation Overall Score:** Adjusting sliders in `SettingsView.tsx` or `QuotationComparisonView.tsx` updates state but does NOT re-evaluate overall quotation scores dynamically.
6. **No Real Auth Security:** Demo login bypasses password verification and sets a hardcoded user object.

---

## 19. Final State Summary

#### What Already Works
* Complete, polished dark-mode glassmorphic design system with custom utility styling.
* 13 interactive domain views and responsive layout shell with collapsible sidebar and header.
* Fully interactive UI controls, modals (`Cmd+K` search, AI progress modal), notification drawer, and filter tabs.
* Full local data persistence across browser sessions via `localStorage`.
* Functional CSV data file generator and browser download export.

#### What Is UI-Only
* Report PDF Export (triggers browser `alert()` pop-up).
* Multi-criteria AI weight sliders (updates state but doesn't recalculate quotation scores).
* Global search modal (filters client-side React memory arrays).

#### What Is Mocked
* All AI actions (evaluate quotations, supplier risk scan, purchase plan generator, inventory reorder recommendation).
* Conversational AI Assistant responses (keyword matching with 800ms timer).
* Commodity price predictions and confidence bands.
* User authentication and role permissions.

#### What Is Missing
* Backend REST/GraphQL API server.
* Relational & Graph Database.
* Natural Language LLM Agent service.
* Semantic Intent & Asset Interceptor UI & Engine.
* Implicit Dependency Graph UI & Engine.
* Counterfactual Policy Simulator Engine.

#### What Should NOT Be Changed
* Existing Tailwind CSS v4 styling system, color palette (Cyan/Blue/Dark Slate), and component styling tokens.
* Recharts charting setup and layout structures.
* Existing entity TypeScript interfaces in `src/types/procurement.ts` (extend them, do not break existing properties).

#### What Should Be Implemented Next
1. Build the backend foundation (API server & database schema).
2. Integrate the **Semantic Intent & Asset Interceptor** into the RFQ creation flow.
3. Build the **Implicit Dependency Graph** visualization and data model.
4. Build the **Counterfactual Policy Simulator** engine.

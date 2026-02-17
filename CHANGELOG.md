# Change Log

**Software Reference:** Usuppli-SMC v3.10 2026-02-13  
**Project:** Usuppli Supply Chain Production Manager

---

## [v3.10] - 2026-02-13
**Focus:** UI Navigation Refinement & Workspace Hardening

### 🧭 Sidebar Navigation (Sidebar.tsx)
* **Action Header Refactor:**
    * **New Product Button:** Restored to the high-visibility compact gradient style (Blue/Indigo). Fixed width at 57% with centered content for visual balance.
    * **Integrated Theme Toggle:** Relocated the Dark/Light mode switch to the immediate right of the primary action button, ensuring vertical alignment within the header group.
* **Navigation Aesthetics:**
    * **Active State:** Migrated from flat color to the "Usuppli Gradient" (Blue/Indigo) for the active selection state, improving brand consistency across the UI.
    * **Hover Logic:** Reverted hover interactions to the lighter slate palette for improved contrast against the dark background.
* **Footer & Cleanup:**
    * **Language Selector:** Relocated the EN/简/繁 toggle to the sidebar footer. Updated to the "Lighter Slate" design protocol.
    * **Sidebar Control:** Restored the legacy text-based "Hide Sidebar" button in the footer; deprecated floating icon toggles.
    * **Menu De-cluttering:** Removed "Currency Exchange" from the primary sidebar as it now resides as a native module within the Product Workspace.

### 📊 Competitor Analysis (CompetitorAnalysis.tsx)
* **Interaction Hardening:** Resolved an issue where "Click to edit" would occasionally fail to trigger input mode on specific rows. 
* **Row Management:** Added a dedicated 'Delete' action (Trash icon) to the competitor matrix.
* **Data Integrity:** Fixed state synchronization logic. Edits to Brand and Price variables now persist to the global product object immediately upon save.
* **Layout Stability:** Implemented a fixed sorting logic during edit sessions to prevent table rows from jumping categories dynamically when price values are modified.

### 💹 Exchange Rate View (ExchangeRateView.tsx)
* **Architecture Restoration:** Re-applied the original layout hierarchy:
    * **Primary Col:** Currency Grid.
    * **Secondary Col (Top):** Blue "Exchange Calculator" Card.
    * **Secondary Col (Bottom):** Market Context / Info Card.
* **Visual Streamlining:** Removed redundant Up/Down trend arrow icons from the currency grid cards to reduce cognitive load.
* **Styling Standardization:** Updated all input fields to use the "Click to Edit" slate aesthetic, matching the Tariff and Costing modules for a unified UX.

---

## [v3.09] - 2026-02-12
**Focus:** Customer Print Module Finalization & Production Data Seeding

### 📄 Documentation & Output
* **Customer Profile Print Engine:** Developed and integrated a specialized Portrait PDF generator for the CRM module. 
* **Print Wizard Synchronization:** Unified all 5 core modules (Order, Sample, Shipment, Product, Customer) under a single Print Preview workflow.
* **Logic Hardening:** Resolved a critical runtime error in the Print Wizard where `PrintableProductSpec` was incorrectly referenced without an import declaration.

### 📦 Master Data & UAT Prep
* **BEMA Plus Deployment:** Successfully seeded the "BEMA Plus Support Bra" as the primary system template for UAT.
* **Live Production Injection:** Added the "BEMA Plus Launch Batch" (JOB-BEMA-001) to the active production queue.
* **Supplier Health Data:** Populated the Shantou Zhenshangmei facility with a Grade B scorecard for performance benchmarking simulations.

---

## [v3.08] - 2026-02-12
**Focus:** Print Engine Refactor (Portrait Protocol)

### 📄 Printing Protocols
* **Portrait Migration:** Deprecated Landscape mode for Product Specifications. All technical documentation now forces **Portrait (A4)** to ensure data integrity and prevent horizontal truncation.
* **Vertical Stack Re-engineering:**
    * **Hero Zone:** Image scaling optimized via `object-fit: contain`.
    * **Data Matrix:** Implemented a high-density 3-column grid for technical DNA.
    * **Financials:** Cost Breakdown tables pinned to the base of the content area.

---

## [v3.07] - 2026-02-12
**Focus:** UI/UX Overhaul, Tariff Intelligence & Role Governance

### 🎨 UI/UX & Theming
* **Dark Mode Restoration:** Re-architected the `ThemeProvider` to support a "Class-Based" toggle strategy.
* **Sidebar Redesign:** Consolidated "New Product" and "Theme Toggle" into a unified action header.
* **Visual Polishing:** Updated `CommandPalette` and `Dashboard` components with `dark:` utility classes.

### 💰 Tariff & Landed Cost Overhaul
* **Global Config Engine:** Implemented `GlobalConfigContext` to centrally manage baseline tariff rates.
* **Smart Locking:** Added a "Tariff Lock" mechanism to prevent individual Product Workspaces from overriding critical trade compliance data.

### 🔐 Roles & Governance (RBAC)
* **Menu-Level Security:** Refactored `Sidebar.tsx` to support a strict `restrictedTo` array for every navigation item.
* **Admin Hardening:** Added a `canAccessAdmin` logic gate in `App.tsx`.

---

## [3.0.1] - 2025-06-01 (Previous)
**Focus:** Governance, Security Hardening & Version Alpha

### Data Governance & Security
- **Restricted Data Export:** Implemented role-based conditional rendering for "Export CSV" functionality.
- **Session Integrity:** Standardized `userRole` retrieval from local persistence.

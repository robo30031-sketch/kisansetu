# KisanSetu — Your Farm. Your Records. Your Control.

KisanSetu is a modern, mobile-first, multilingual farm management application engineered for Indian farmers across diverse agricultural ecosystems. It provides straightforward, accurate recordkeeping for farms, fields, crop cycles, financial ledger (income & expenses), agricultural tasks, and inventory stocks.

> **Important Architecture Principle**: KisanSetu contains **zero AI dependencies, chatbots, or external AI API calls**. All computations, totals, validations, and stock audits are deterministic, fast, privacy-focused, and executed client-side or within PostgreSQL.

---

## 🌾 Features

1. **Multilingual Support (22 Languages + English)**:
   - Covers all 22 languages specified in the Indian Constitution's Eighth Schedule:
     Assamese (as), Bengali (bn), Bodo (brx), Dogri (doi), Gujarati (gu), Hindi (hi), Kannada (kn), Kashmiri (ks), Konkani (kok), Maithili (mai), Malayalam (ml), Manipuri (mni), Marathi (mr), Nepali (ne), Odia (or), Punjabi (pa), Sanskrit (sa), Santali (sat), Sindhi (sd), Tamil (ta), Telugu (te), and Urdu (ur), plus English (en).
   - Right-to-Left (RTL) layout support for Urdu, Sindhi, and Kashmiri.
   - Built-in localized Web Speech read-aloud for accessible audio playback on compatible devices.

2. **Farm & Field Management**:
   - Create and organize multiple farms with state, district, village, and acreage.
   - Subdivide farms into designated plots/fields with unit flexibility (acres, hectares, bighas, gunthas).

3. **Crop Lifecycle Tracking**:
   - Register seasonal crops (Kharif, Rabi, Zaid, Year-round).
   - Track planned, growing, harvested, and cancelled statuses.
   - Sowing and expected/actual harvest dates with yield recording.

4. **Financial Ledger (Expenses & Income)**:
   - Dedicated categorized ledger in Indian Rupees (₹).
   - Categorization: Seeds, Fertilizer, Labour, Irrigation, Equipment, Fuel, Transport, Land Rent, Maintenance, Crop Sale, and Other.
   - Real-time sum calculations without speculative estimations.

5. **Farm Tasks & Calendar**:
   - Actionable agricultural to-dos linked to specific farms, fields, or crops.
   - Overdue badges, completion timestamps, and reusable generic workflow templates.

6. **Inventory & Audited Stock Movements**:
   - Track seed bags, fertilizer quintals, sprays, fuel, and supplies.
   - Real-time low-stock thresholds and alert badges.
   - ACID-safe stock transactions preventing negative inventory anomalies.

7. **Export & Reports**:
   - Visual charts (Recharts) and breakdown tables.
   - Formula-injection-safe CSV export (`'` prefix escaping).
   - Complete JSON backup export.

---

## 🚀 Setup & Supabase Connection

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account.
2. Click **New Project**, choose your project name (e.g. `kisansetu-prod`) and database region (e.g., `ap-south-1` Mumbai for India).
3. In **Project Settings** → **API**, copy:
   - **Project URL**
   - **Project API Keys** → `anon` (public key)

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or set the following in your environment:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
```

### 3. Run the SQL Migration
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Open `supabase/migrations/001_initial_schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. The migration automatically creates:
   - All 8 tables with foreign keys and cascade deletions.
   - Strict Row-Level Security (RLS) policies guaranteeing data isolation.
   - Indexing on user and foreign key lookups.
   - The transaction-safe `record_stock_movement` PL/pgSQL function.
   - Automatic user profile sync trigger on auth signups.

---

## 🔒 Security & Row-Level Security (RLS) Model

- **Zero Service-Role Exposure**: The application only uses the public client anon key. All mutations rely on `auth.uid()`.
- **Database Ownership Enforced**: Every table (`farms`, `fields`, `crop_cycles`, `financial_entries`, `farm_tasks`, `inventory_items`, `stock_movements`) checks `auth.uid() = owner_id` in `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- **Foreign Key Cross-Tenant Protection**: When inserting fields, crops, tasks, or entries, the RLS policies explicitly verify that the parent farm ID also belongs to `auth.uid()`.

---

## 🗣️ Translation Review Checklist (Native Speaker Validation)

While KisanSetu provides complete initial localizations across all 22 Eighth Schedule languages, agricultural dialects and vernacular idioms vary widely across Indian states. Before large-scale public deployment, field reviews should be conducted with native agrarian speakers for:

- [ ] Regional crop names and seasonal terminology (Kharif, Rabi, Zaid, Boro, Aus, Aman)
- [ ] Local land area measurements (Bigha, Guntha, Cent, Ground, Biswa, Kanal, Marla, Kattha)
- [ ] Regional unit spellings for inputs (Quintal, Borah, Pao, Mann, Litre, Bottle)
- [ ] Financial terminology (Karch/Vyay, Aavak/Aamadani, Jama/Baqi, Bikri/Vikray)
- [ ] Regional agricultural tool and irrigation terminology

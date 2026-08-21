# GitHub Issues for Backend Setup

Below is the list of tracked GitHub Issues for the Backend Setup phase.

- [x] **#1: Backend Foundation**
  - **Status:** Closed
  - **Description:** Confirm DB/auth integration, add server-only database utilities and environment validation.
  - **Tasks:**
    - [x] Choose/confirm database integration (Supabase configuration)
    - [x] Add server-only database utilities
    - [x] Configure `.env.local` validation

- [x] **#2: Application Data Model**
  - **Status:** Closed
  - **Description:** Create the `applications` table schema and set up indexes.
  - **Tasks:**
    - [x] Create the migration/table setup script for `applications` with columns: `id`, `created_at`, `experience`, `market`, `challenge`, `process`, `goal`, `commitment`, `status`, `notes`, `reviewed_at`.
    - [x] Add indexes for `created_at` and `status`.

- [x] **#3: Secure Submission Flow & Validation**
  - **Status:** Closed
  - **Description:** Create the backend validation and secure submission handler.
  - **Tasks:**
    - [x] Design a shared Zod schema for validation.
    - [x] Implement a Server Action or route handler for application submission.
    - [x] Trim and length-limit text inputs server-side.
    - [x] Add duplicate-submission handling and basic spam protection.

- [x] **#4: Mobile-First Form Integration**
  - **Status:** Closed
  - **Description:** Update the frontend form to hook into the secure submission flow.
  - **Tasks:**
    - [x] Connect the existing form to the Server Action.
    - [x] Implement inline error display and first-invalid element focus.
    - [x] Disable the submit button during submission state.
    - [x] Show a compact success state, avoiding CTA overlaps.

- [x] **#5: Private Review Dashboard Layout**
  - **Status:** Closed
  - **Description:** Set up the protected admin panel.
  - **Tasks:**
    - [x] Create `app/admin` route.
    - [x] Fetch and display submissions sorted newest-first.
    - [x] Scope queries to authenticated reviewers.

- [x] **#6: Dashboard Status Changes & Mentor Notes**
  - **Status:** Closed
  - **Description:** Add controls for status updates and notes on submissions.
  - **Tasks:**
    - [x] Implement status toggle actions (accepted, declined, reviewing).
    - [x] Add form/action for private mentor notes.
    - [x] Add confirmation modal/step for destructive or status actions.

- [x] **#7: Production Security & Hardening**
  - **Status:** Closed
  - **Description:** Enable RLS, secure queries, rate-limiting, and headers.
  - **Tasks:**
    - [x] Set up row-level security (RLS) policies.
    - [x] Configure security headers in `next.config.mjs`.
    - [x] Add request-size limits and IP-based rate limiting.

- [x] **#8: Notifications System**
  - **Status:** Closed
  - **Description:** Create asynchronous notification handling.
  - **Tasks:**
    - [x] Create schema/table for recording notification delivery.
    - [x] Add support for optional notifications when applications arrive.

- [x] **#9: Verification, Styling, & CI Validation**
  - **Status:** Closed
  - **Description:** Test and verify all requirements.
  - **Tasks:**
    - [x] Test form submission at 300x535 mobile view.
    - [x] Run type check, linter, and next build.

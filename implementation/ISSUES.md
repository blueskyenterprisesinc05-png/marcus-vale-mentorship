# GitHub Issues for Backend Setup

Below is the list of tracked GitHub Issues for the Backend Setup phase.

- [ ] **#1: Backend Foundation**
  - **Status:** In Progress
  - **Description:** Confirm DB/auth integration, add server-only database utilities and environment validation.
  - **Tasks:**
    - Choose/confirm database integration (Supabase configuration)
    - Add server-only database utilities
    - Configure `.env.local` validation

- [ ] **#2: Application Data Model**
  - **Status:** Open
  - **Description:** Create the `applications` table schema and set up indexes.
  - **Tasks:**
    - Create the migration/table setup script for `applications` with columns: `id`, `created_at`, `experience`, `market`, `challenge`, `process`, `goal`, `commitment`, `status`, `notes`, `reviewed_at`.
    - Add indexes for `created_at` and `status`.

- [ ] **#3: Secure Submission Flow & Validation**
  - **Status:** Open
  - **Description:** Create the backend validation and secure submission handler.
  - **Tasks:**
    - Design a shared Zod schema for validation.
    - Implement a Server Action or route handler for application submission.
    - Trim and length-limit text inputs server-side.
    - Add duplicate-submission handling and basic spam protection.

- [ ] **#4: Mobile-First Form Integration**
  - **Status:** Open
  - **Description:** Update the frontend form to hook into the secure submission flow.
  - **Tasks:**
    - Connect the existing form to the Server Action.
    - Implement inline error display and first-invalid element focus.
    - Disable the submit button during submission state.
    - Show a compact success state, avoiding CTA overlaps.

- [ ] **#5: Private Review Dashboard Layout**
  - **Status:** Open
  - **Description:** Set up the protected admin panel.
  - **Tasks:**
    - Create `app/admin` route.
    - Fetch and display submissions sorted newest-first.
    - Scope queries to authenticated reviewers.

- [ ] **#6: Dashboard Status Changes & Mentor Notes**
  - **Status:** Open
  - **Description:** Add controls for status updates and notes on submissions.
  - **Tasks:**
    - Implement status toggle actions (accepted, declined, reviewing).
    - Add form/action for private mentor notes.
    - Add confirmation modal/step for destructive or status actions.

- [ ] **#7: Production Security & Hardening**
  - **Status:** Open
  - **Description:** Enable RLS, secure queries, rate-limiting, and headers.
  - **Tasks:**
    - Set up row-level security (RLS) policies.
    - Configure security headers in `next.config.mjs`.
    - Add request-size limits and IP-based rate limiting.

- [ ] **#8: Notifications System**
  - **Status:** Open
  - **Description:** Create asynchronous notification handling.
  - **Tasks:**
    - Create schema/table for recording notification delivery.
    - Add support for optional notifications when applications arrive.

- [ ] **#9: Verification, Styling, & CI Validation**
  - **Status:** Open
  - **Description:** Test and verify all requirements.
  - **Tasks:**
    - Test form submission at 300x535 mobile view.
    - Run type check, linter, and next build.

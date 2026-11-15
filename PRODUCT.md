# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clinician-researchers in rehabilitation. The same therapists record each client's sessions and also run outcome studies from those records in the interface. No separate analyst audience has been confirmed.

The workflow follows occupational-therapy models (SOAP notes, Person–Environment–Occupation reasoning, COPM) and puts extra weight on vision rehabilitation: oculomotor, visual-field and functional-vision assessment, plus the OcuTrain and UFOV computerized tests. The bundled demonstration cases also cover stroke, traumatic brain injury, upper-limb motor impairment and spinal cord injury.

Users are not technical. They must be able to set up, save, back up, restore and recover records without IT support.

Traditional Chinese (`zh-TW`) is the default interface language. English is a full peer.

## Product Purpose

EzEMR is a rehabilitation record tool that runs in the browser. It holds client details, SOAP notes, symptom ratings, assessments, training results and progress tracking. A therapist documents each visit (baseline assessment, treatment session, post-rehabilitation assessment, follow-up, absence) and follows change across visits on the Patient dashboard, Rehabilitation records and Progress tracking views.

It exists so that a rehabilitation service can keep structured clinical records on its own computers, with no server, installation or network.

Success means two things. A therapist can complete and save a session record without help, in the interface language of their choice. And because the same entered values serve as study data, they come out as consistent results that can be compared across visits, ready for reports and analysis without being typed in again.

## Positioning

Two commitments are confirmed. Future work must not trade either one away.

1. **Local-only and offline.** EzEMR is a single HTML file that opens directly from disk in desktop Chrome or Edge. It has no server, no account and no installation, and it sends no record data over the network. Records live in a local folder that the therapist chooses and authorizes.
2. **Plain language for non-technical users.** Wording is everyday language. Help is available when asked for. Mistakes can be recovered from. Consequences stay visible (where a record is saved, when the last backup was made, what a restore will overwrite). Technical detail is kept out of the way until someone asks for it.

## Operating Context

- **When it is used:** both live and afterward. During a session the therapist enters results as each test or activity finishes, in the order the work happens: measure, activity, re-measure, then response and recovery. After the session they finish the note. Both modes must work.
- **Device:** a desktop or laptop running Chrome or Edge, which can save directly to a folder. Narrow screens are supported for reading (layouts stack, progress tables scroll sideways), but direct folder saving needs a desktop Chromium browser. Browsers without folder access use browser storage, and each save downloads a ZIP.
- **Service framework:** Visual function / Functional vision assessment → PEO reasoning → In-person / Telerehab intervention → qualitative and quantitative reports. Each record's service mode is In-person or Telerehab.
- **Record folder:** `clients.csv` plus one folder per client holding each session as CSV, PDF and TXT. Filenames are fixed after the first save. The folder is remembered per browser and reconnected when permission allows. An optional synced copy folder mirrors every write.
- **Inputs from elsewhere:** source Excel workbooks (intake roster, assessment and rehabilitation sheets), legacy SOAP JSON folders, OcuTrain JSON/CSV exports and UFOV statistics CSV files.
- **Outputs:** per-session CSV, PDF and TXT; per-client and all-client Excel workbooks (sheets such as SOAP notes, Clinical links, Interventions and Training results); `clients.csv`; full JSON backups, plain or password-encrypted.
- **Users per folder:** one machine and one user per record folder today.

## Capabilities and Constraints

**Terminology in use:** client and medical record number; Patient dashboard, Rehabilitation records, Progress tracking, Item settings; Short-term outcomes and Long-term assessments; the five function groups (Visual function, Functional vision, Motor function, Daily living function, Cognitive function); measurement stages Pre 1, Pre 2, Immediate post, Recovery, 24–72 h follow-up; P subsections Remediation, Adaptation, Compensation; clinical links from a symptom to evidence and interventions. `README.md` and `USER_MANUAL.zh-TW.md` define each term and field.

**Technical constraints:**

- Development sources live in `src/`. `node scripts/build.cjs` bundles them into the single generated `EzEMR.html`, embedding every library, style, font and image. Never hand-edit the generated file.
- The base component library is Metro UI 5.1.20. SheetJS handles Excel import and xlsx-js-style handles styled export. All are pinned in `vendor/`.
- A strict Content Security Policy and an early privacy guard block network requests, remote scripts, frames, workers and form submissions. No CDNs and no remote fonts. Noto Sans TC is used when installed locally, with system CJK fonts as the fallback.
- Every interface string is bilingual through `ui()`, `UI_EN` and `LABELS`, and translation gates and bilingual browser tests block a change when any are missing. Clinical text, names, custom item names, results, stored values, identifiers, the CSV schema and filenames are never translated.
- The data contract is in `DATA_FORMAT.md`. The CSV schema, field identifiers and filenames stay stable, and older records stay readable.
- There are light and dark appearances, following the system setting by default.
- Every push runs the full test suite through `.githooks/pre-push` and `node tests/run-ci.cjs`.

**Current behavior as documented in the README:** the app records results without inferring clinical conclusions, efficacy verdicts, severity or clinical thresholds, and it does not invent relationships between older records. Symptom-change colors indicate direction only. Totals and comparisons are suppressed when the sets being compared differ.

**Research boundaries:** the short-term outcome templates implement a supplied research-design summary. They are not a validated instrument. The app assumes no MCID and makes no validity claims. The five-item symptom total is an unweighted sum of the entered ratings and has not been established as a validated scale.

**Security boundaries:** the clinician field is a typed signature. It is not authentication or a digital signature. Only the password-encrypted backup file is encrypted; local CSV, PDF, TXT, Excel, plain JSON and browser-stored records are not. The app claims no roles, no audit trail, no HIPAA or ISO compliance and no medical-device certification.

**Explicitly undecided:**

- Shared computers or folders with several users, roles, consent, audit and signatures. Out of scope until a real need is defined (see "下一階段的啟動條件" in `RESEARCH_IMPROVEMENTS.zh-TW.md`).
- Data exchange with hospital systems (FHIR, openEHR and similar). Nothing is claimed; it needs the receiving system's specification first.

## Brand Commitments

- Name: **EzEMR**. The interface title is "EzEMR | 復健病歷".
- Voice: everyday words. Say what an action does and what follows from it, then give the next step. Raw errors sit under **Technical details** and file-level detail under advanced sections that start collapsed. Claim only what is true: the backup indicator says a download *started*, not that the file was kept.
- Bilingual, with Traditional Chinese as the default.
- MIT License.
- The repository has no logo, mark or image brand assets.

## Evidence on Hand

- `Data/`: eight fictional demonstration clients (DEMO-STROKE, DEMO-TBI, DEMO-DIPLOPIA, DEMO-MONOCULAR, DEMO-FIELD, DEMO-NEGLECT, DEMO-MOTOR, DEMO-SCI) with 24 records as CSV, PDF and TXT. They are for trying the software, not clinical guidance.
- `node tests/clinical-samples.cjs` generates six further fictional cases with 19 records under `.tmp/`.
- `THERAPIST_WORKFLOW_REVIEW.zh-TW.md` (2026-11-11): a walkthrough simulated in the therapist role, with measured scroll distances. It is a structured review, not a study with real therapists.
- `RESEARCH_IMPROVEMENTS.zh-TW.md`: the six-paper literature basis for design trade-offs, plus a ready-to-run usability walkthrough (3–5 therapists, six tasks, SUS) that has **not** been run yet.
- `USER_MANUAL.zh-TW.md` (field-by-field manual) and `DATA_FORMAT.md` (local data contract).
- **Absent, never fabricate:** usability results from real users, testimonials, adoption or clinic counts, validated clinical-outcome or efficacy claims, time-saved or error-reduction figures, compliance certifications.
- Real patient records must never appear in the repository, issues, pull requests or screenshots.

## Product Principles

1. **Records never leave the machine.** A feature that needs a network, a server or an account is out unless this commitment is explicitly changed.
2. **A non-technical therapist can finish alone.** Everyday words come first and detail comes on request. Mistakes can be recovered from, and consequences (save location, backup state, what will be overwritten) are visible before they matter.
3. **Follow the session as it happens.** Support live entry in the order clinical work happens, and completion afterward, without breaking the stored SOAP structure or the report structure. Keep the client, item and stage visible so that moving around the form never loses its context.
4. **Enter once, use for care and for research.** Values stay structured and comparable: blank is distinct from zero, and stages, units and comparable sets are kept. They flow into notes, progress tracking and exports without re-entry. Source data, clinical wording and identifiers are never silently rewritten or translated.

## Accessibility & Inclusion

- Full parity between `zh-TW` and `en` for every label, menu, placeholder, validation message, loading, empty and error state, dialog and accessible name.
- Menus, dialogs, tabs and the **?** help all work from the keyboard. Escape hides help before it closes the dialog underneath.
- Controls keep 44px targets.
- Light and dark appearances follow the same visual hierarchy.
- Symptom-change direction is never carried by color alone: signed values and labels accompany it.

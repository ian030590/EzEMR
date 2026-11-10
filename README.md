# EzEMR

[English](README.md) | [Traditional Chinese](README.zh-TW.md)

[![HTML5](https://img.shields.io/badge/HTML5-single_file-E34F26?logo=html5&logoColor=white)](EzEMR.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)](EzEMR.html)
[![Local files](https://img.shields.io/badge/Storage-local_CSV_%2F_PDF-2C3E50?logo=files&logoColor=white)](EzEMR.html)
[![GitHub issues](https://img.shields.io/github/issues/ian030590/EzEMR?logo=github)](https://github.com/ian030590/EzEMR/issues)
[![Full CI](https://img.shields.io/github/actions/workflow/status/ian030590/EzEMR/check-i18n.yml?branch=main&label=full%20CI&logo=githubactions)](https://github.com/ian030590/EzEMR/actions/workflows/check-i18n.yml)

EzEMR is a browser-based rehabilitation record tool for client information, SOAP notes, symptom scores, assessments, training results, and progress tracking. Open [EzEMR.html](EzEMR.html) directly in desktop Chrome or Edge. No server, build step, or application installation is required.

EzEMR supports English and Traditional Chinese. `EzEMR.html` is the generated distribution; development sources are kept separately in `src/`, with third-party libraries in `vendor/`.

## 🗂 Features

- Manage client details, diagnoses, referral reasons, and eye surgery history; search from the header by name, medical record number, or diagnosis.
- Choose the profile fields required for every patient under **Settings → Profile fields...**.
- Open each client in **Patient dashboard**, with **Rehabilitation records**, **Progress tracking**, and **Item settings** alongside it.
- Record SOAP notes, baseline assessments, treatment sessions, post-rehabilitation assessments, follow-ups, and absences.
- Choose each client's initial assessment items, then tick the assessments and training items actually done in a record; only ticked items open for entry and are saved. Each training activity has its own score.
- Track Eye fatigue, Blurred vision, Dizziness, Headache, and Nausea, with symptom charts and filters by record type and date.
- Compare COPM results with the corresponding baseline and record EyeDot Trainer activities.
- Customize assessment and rehabilitation templates for each client without editing code.
- Save each session as CSV, PDF, and a plain-text copy of the note; export Excel workbooks, the client roster, and full JSON backups.
- Import supported assessment and rehabilitation Excel workbooks or legacy SOAP JSON folders, retaining source details.
- Import score files from OcuTrain and the peripheral visual field (UFOV) training program. Each OcuTrain module and each UFOV subtest is its own item with its own score and test settings.
- Switch between light and dark appearance, with keyboard menus and shortcuts.
- Choose English or Traditional Chinese without changing the language of your own notes and custom item names.

## ▶ Quick start

1. Download `EzEMR.html` to a local folder on your computer and open it in desktop Chrome or Edge from your file manager.
2. Select **English** in the language selector. Traditional Chinese is the default, and the browser remembers your choice. Switching languages preserves the current SOAP draft.
3. The first screen asks where to keep your records. For a new collection, choose **Use a Data folder beside the HTML**. When first saving a client, select the folder containing the HTML and allow file editing; the app creates `Data` inside that folder. For existing records, choose **Open an existing record folder** and select the folder containing `clients.csv`. You can change this later under **File → Storage location...**.
4. Choose **New client** and enter the name, medical record number, and other details. To look around first, choose **Load example client (demonstration data)** on the welcome screen.
5. Select the client, then choose **New record** beside the patient's name in the main area. Fill in the SOAP note and symptom scores. Under **Assessments** and **Rehabilitation items**, tick what was done this visit to open its fields, then enter the results.
6. Choose **Save**, or press `Ctrl+S` / `⌘S`. The session CSV, PDF, and TXT files are written to that client's folder.
7. When reopening the HTML, the app reconnects to the previously selected record folder if the browser still grants access. Otherwise, the first screen offers to reconnect that folder or choose another one.

The browser requires you to select and authorize a folder. It cannot infer the HTML file's directory and write beside it automatically. The default `Data` folder is created inside the location you select at the first save.

### Patient data

`EzEMR.html` and this repository contain no client records; the example client and all test data are synthetic. Records are written only to the local folder you select, and the app sends no record data over the network. If you keep the default `Data` folder inside a clone of this repository, `.gitignore` excludes it so records are not committed by accident. Do not attach real records, exports, or backups to issues or pull requests.

## ⌨ Menus and keyboard shortcuts

| Control | Purpose |
| --- | --- |
| File | Save, import CSV/Excel/backups/test score files or a legacy SOAP folder, choose a storage location, open or reload a record folder, and configure a second copy folder. |
| Client | Create or edit clients and add rehabilitation records. |
| Settings | Choose required profile fields, switch appearance, and open storage settings. |
| Patient header | Add a record or edit the selected client's details. |
| Toolbar | Import and open the export menu. Save, copy-note, and cancel actions appear while editing. |
| Export | Export one client's Excel workbook, all clients' Excel workbook, `clients.csv`, or a full JSON backup. |
| Ctrl+S / ⌘S | Save the current record. Disabled when there is no record to save. |
| Ctrl+O / ⌘O | Open a record folder. |
| Arrow keys, Enter, Escape, Tab | Navigate menus; Escape closes a menu or dialog. |

The header stays available while scrolling and contains client search alongside the title, menus, tools, and language selector. There is no sidebar or full client roster. Enter a name, medical record number, or diagnosis to show up to eight matches; an empty search shows none. Use Up/Down and Enter to select a result, or Escape to close the results. Switching clients protects unsaved drafts, and a late response from an earlier selection cannot replace the current client's records. Controls use 13px text and shared 2px vertical padding while retaining 44px targets. The header leaves 8px around controls and is 61px high on desktop. Adjacent actions have equal sizes and gaps. Storage details are available under **File → Storage location...** instead of occupying header space.

The client summary shows identity and diagnosis, the total record count, the latest record date, and the next session date from the latest record. Background details and source documents are folded below it. **Patient dashboard** opens when you select a client, with symptom scores before the selected visit's symptoms, clinical reasoning and evidence, and interventions. It defaults to the latest attended visit; its record selector excludes absences and marks older selections. A warning identifies the latest record when it is an absence, including clients with no attended records. Each selected visit keeps its own results and reasoning.

**Rehabilitation records** shows the symptom chart and the record history, newest first; on wide screens the chart sits beside the history, and on narrow screens above it. Each record aligns before-session score, after-session score, and change in three labelled columns. Subtest scores, assessment count, recovery, tolerance, and training items have separate groups; absence records use labelled reason, notification, and rescheduling fields. The editor's symptom and COPM summaries also use labelled score groups. Filters by record type and date change only the listed records, not the summary. **Progress tracking** shows symptom changes, assessment results, COPM comparisons, and training records. **Item settings** manages the client's assessment and rehabilitation templates.

Under **Settings**, the initial appearance follows the system setting; manual changes are remembered in the current browser. Both appearances use the same visual hierarchy. Noto Sans TC uses an installed font, with system fonts as a fallback; Metro icon fonts are embedded.

### Required profile fields

Open **Settings → Profile fields...** to select required fields for every patient in the current record folder, or every patient in browser storage. The catalog has 14 fields: name, medical record number, national ID number, date of birth, sex, smoking, alcohol use, betel nut use, occupation, religion, chronic conditions, phone, address, and allergies. Name and medical record number are selected by default.

Selected fields are required when saving patient details or rehabilitation records. Existing records remain readable after a new requirement is added; an incomplete patient profile must be completed before writing records. Unselected fields are hidden from entry and existing values are retained. An unnamed patient is shown with a generated display label; this does not replace stored data. Folder settings are saved in `settings.json`; browser storage keeps its own settings. Full JSON backups include the settings. CSV retains the existing column schema and stores added profile values in its existing extra-fields payload.

## Clinical reasoning and record structure

### Patient dashboard and linked clinical reasoning

The dashboard follows the supplied Visual Rehabilitation Service Framework: **Visual function / Functional vision assessment → Person–Environment–Occupation (PEO) reasoning → In-person / Telerehab intervention → qualitative and quantitative reports**. In the A section of a record, add a clinical link for each main symptom or functional difficulty. Choose its assessment category, enter the clinical reasoning, mark the PEO areas involved, link that record's assessment results as evidence, and select the related Remediation, Adaptation, or Compensation strategies. Free-text evidence and intervention notes retain the clinician's original wording. The dashboard places these links side by side so their relationship is explicit.

Linked evidence uses the results in the selected record, including its saved assessment definitions. A link whose assessment was not recorded shows a missing-evidence message. Switching service mode preserves previously selected strategies. Older records without clinical links show their recorded symptoms, reasoning, and interventions separately; the app does not invent relationships between them. No clinical inference or intervention selection is automated. The framework has no separate symptom taxonomy: Visual function and Functional vision are used as the link categories. Its in-person Remediation entry pairs the Chinese term for visual perception with the inconsistent English label “Visual field training”; this application uses **Visual perception** for that entry.

Clinical links are stored in the session's `clinicalLinks` array, including stable assessment and intervention IDs. The existing CSV schema and JSON backups preserve these fields. TXT, PDF and the Excel SOAP form include the link text; the Excel workbook adds a **Clinical links** sheet with one row per symptom. Draft links retained in absent visits are excluded from clinical reports. Assessment results and clinical notes are never translated when the interface language changes.

The editor follows the clinic's assessment-to-intervention flow while keeping SOAP: **S Subjective**, **O Assessment** (observations, symptom NRS, assessments), **A PEO clinical reasoning**, and **P Intervention and plan**. Person, Environment, and Occupation findings guide clinical judgement and intervention planning. P contains **Remediation** (the existing rehabilitation items, activity scores, test runs, EyeDot, and other treatment/home program), **Adaptation**, **Compensation**, tolerance, next steps, and the next session date.

Choose **In-person** or **Telerehab** in the basic information. New records default to In-person; older records without a mode show **Not specified** until you choose one. Adaptation and Compensation each have mode-specific checkboxes and notes. Changing mode retains checked strategies from the other mode, marked with that mode's name, and preserves the rest of the draft. In P, Remediation records training activities and results. The symptom links in A document the framework's intervention categories and the treatment or plan for each symptom.

Sessions store `mode` as `inperson`, `telerehab`, or an unset value; `peo` contains optional string fields `person`, `environment`, and `occupation`. `interventions.adaptation` and `interventions.compensation` each hold `picks` (stable ASCII strategy IDs) and optional `notes`. Missing new fields stay missing when an old record is loaded; saving in the editor can add these fields, with mode remaining unset unless selected. Unknown valid strategy IDs remain readable as their original IDs. Language switching changes labels only, preserving clinical text and stored values.

The existing local-folder CSV schema serializes these nested fields without additional columns; CSV reload and full JSON backups retain them. TXT, PDF, and the SOAP form workbook follow the same clinical flow. The Excel **SOAP notes** sheet appends service mode, PEO, adaptation, and compensation columns after the existing columns. Its **Interventions** sheet provides one row per checked strategy with client, session, mode, approach, strategy ID, and translated label for quantitative reporting.

### Symptom scores and provenance

Eye fatigue, Blurred vision, Dizziness, Headache and Nausea, with their 0-to-10 questions, already appear in the first application commit (`af3ec91`). The code refers to symptom rating instructions, but the tracked project includes neither that document nor a citation for this exact five-item combination. The supplied service-framework slide does not specify these five symptoms. The aggregate is an unweighted sum of entered ratings: blank items are excluded, and all-blank ratings produce no total. The available project history does not establish this aggregate as a validated scale.

Dashboard scores compare the first and last rated timepoints within the selected visit, excluding recovery ratings. Signed differences are green when lower, red when higher, and neutral when unchanged; **Visit change** identifies their scope. Missing ratings remain blank markers and have no calculated difference. These colors indicate direction, without assigning severity or inferring a clinical conclusion. Record cards retain **Change from first** for the difference between the first rating and the end-of-session rating; the prism-diopter symbol stays on the clinical measurement fields.

## Customize assessments and rehabilitation items

Select a client and open **Item settings**:

1. Choose **Add assessment** or **Add rehabilitation item**, then start with a built-in or blank template.
2. Enter a name. For assessments, configure the category, domain, instructions, and assessment timing. COPM stays in Functional vision. For rehabilitation items, enter activities, one per line.
3. Add result fields using text, number, long text, or dropdown types. Numbers support units, minimums, maximums, and steps; dropdown options use one option per line.
4. Choose **Save item**. The item can now be selected in the SOAP form. You can also add items from an open SOAP form without losing its draft.

### Assessment groups

O starts with observations, then **Visual function** (symptom NRS first) and **Functional vision**. Each group has its own assessment picks and due/other lists. TXT/PDF, the SOAP form workbook, and progress tracking use the same two groups; the Excel **Assessments** and **Data collection plan** sheets append a translated **Category** column.

The standard template adds Medical record review, Optometry record, OT assessment record, Visual acuity, Refraction, Near visual acuity, Visual field, Contrast sensitivity, Color vision, and Stereopsis to Visual function. Functional vision includes Self-report questionnaire, OT assessment, Daily task performance, Participation needs, and the existing COPM and Work-related functional vision task. Record reviews and the questionnaire use milestone timing; the other new items use assessment timing. New clients using the standard template or created by Excel import start with no initial assessment items ticked; choose them under **Item settings**. Existing clients and items without a stored choice stay included; a client created from another client keeps that client's choices.

Existing clients keep their stored templates. To add a new built-in item, open **Item settings → Add assessment → Start from template**, choose the item, and save. Its category is carried into the new item and can be changed in the item dialog. Category IDs are `visual` or `functional`; older items without a category default to Visual function, except COPM, the work-related functional task, and the new functional items. Language changes do not alter stored definitions, results, or local-folder CSV filenames or schema.

### Visual field entry

The built-in **Visual field** assessment follows NTUHLowvision's cross-shaped entry layout. As you face the patient, OD is on the left of the screen and OS on the right, with nasal fields toward the middle and temporal fields toward the outside. OU sits below; the patient's right is on the left of the screen. Each eye has four direction fields, for twelve free-text entries in total. Enter degrees or a qualitative description; blank means not recorded, and `0` is retained as a result. On narrow screens, the three crosses stack vertically.

The test/method, legacy OD and OS entries, summary, and custom fields remain available. Imported source-workbook visual fields use the same layout while retaining their original field IDs and results. Language switching preserves entered text. The app does not interpret the visual field or generate clinical conclusions.

### Initial assessment items

**Initial assessment items** at the top of **Item settings** lists the client's enabled assessments as tick boxes. New clients using the standard template or created by Excel import start with none ticked. Tick the items to test at the initial (baseline) assessment; each change is saved immediately. Existing clients keep their stored choices, and items without a stored choice stay included. A client created from another client keeps that client's initial assessment choices.

In a record, the assessment section shows the items as tick boxes, following the outpatient form in NTUHLowvision:

- **Baseline assessment** records list the initial assessment items first, then **Other items**.
- **Post-rehabilitation** and **Follow-up** assessments list the initial items due by their assessment timing as **Due this visit**; the rest appear under **Other items**.
- Treatment visits list all available assessments without a due group. COPM appears only at baseline and post-rehabilitation assessments.

Ticking an item opens its result fields; unticking closes it and keeps what you typed until you leave the record. Only ticked items are saved, so an untested item never appears in the note, PDF, Excel export, or progress tracking. Results already saved in an older record for an unticked item are kept.

### Rehabilitation items and activity scores

Rehabilitation items work the same way: tick the items done this visit to open them. Inside an item, tick each activity performed; every ticked activity gets its own score box, for example `85%`, `12 reps`, or `40 s`. Shared fields for program/equipment, duration, level/settings, perceived difficulty (0 to 10), and observations follow, then any custom result fields. An item without an activity list has a single **Performance** box instead. Older records that used the shared performance box keep it as **Overall performance**.

Activity scores appear in the note, PDF, and TXT (`Selective attention: 92%`), as rows in the Excel **Training results** sheet, and as one column per activity in **Progress tracking**, where ✓ marks an activity done without a score. Perceived difficulty and overall session tolerance use 0 to 10 number boxes; an empty box means not rated, and values outside 0 to 10 block saving. COPM retains its dedicated table, assessment timing, and baseline comparison.

### Computerized visual tests (OcuTrain and UFOV)

The built-in computerized tests follow the modules of OcuTrain and the subtests of the peripheral visual field training program. Each module or subtest is a separate item, so smooth pursuit and fixation are never recorded together:

| Item | Main score | Other results | Test settings |
| --- | --- | --- | --- |
| Smooth pursuit (OcuTrain PURSUIT) | Gaze accuracy rate (%) | Completed targets, on-target time, valid gaze time, test duration, diplopia onset by direction | Test mode, stimulus type and size, movement speed, target spans, directions, hit threshold, viewing distance, eye tracker |
| Fixation (OcuTrain FIXATION) | Gaze accuracy rate (%) | Same as smooth pursuit | As smooth pursuit, plus edge hold time |
| Saccade (OcuTrain SACCADE) | Gaze accuracy rate (%) | Mean time to first fixation (TFF), TFF targets, and the results above | Test mode, stimulus, target dwell time, spans, directions, threshold, distance, eye tracker |
| Vestibulo-ocular reflex (OcuTrain VOR) | Gaze accuracy rate (%) | On-target time, valid gaze time, test duration, diplopia | VOR multiplier, VOR direction, stimulus size, threshold, distance, eye tracker |
| UFOV subtests 1 to 3 (processing speed, divided attention, selective attention) | Threshold at 80% correct (ms) | Overall accuracy, mean response time, formal and correct trials, fastest correct duration; subtests 2 and 3 add central and peripheral accuracy and accuracy by direction | Stop condition, contrast, vehicle size, viewing distance, refresh rate; subtests 2 and 3 add peripheral eccentricity and enabled directions |

The main score comes first. Test settings sit in a folded **Test settings** section under the results; its heading shows how many settings are filled. Field identifiers match the keys in the programs' exported files, so imported values land in the same boxes. The note, PDF, and progress tracking show the settings as one summary line.

Training records can hold test runs too. When **Computer-based oculomotor training** or **Peripheral awareness** is ticked, **Test records** lists one card per run. Choose the module or subtest and **Add test record** to enter a run by hand. Each card has its own results and settings, so a pursuit run and a fixation run done in the same visit stay separate. Runs appear in the note and PDF, as rows in the Excel **Training results** sheet, and in progress tracking under their own heading.

Existing clients keep the items in their stored templates. Older items such as the combined fixation and pursuit items stay available, and their saved results are unchanged. Add the new items from **Item settings**, or let a score import add them.

Items can be edited, duplicated, disabled, and re-enabled. Saved records retain their original item names and field definitions, so later template changes do not rewrite historical results. For legacy records without saved definitions, the app preserves the original templates from client data when settings are first changed.

When creating a client, **Assessment and rehabilitation templates** can copy another client's item definitions. This copies settings only, without notes or scores; each client's later changes are independent.

## 💾 Storage and file formats

No absolute record-folder path is hard-coded in the HTML, and selecting a storage location does not modify the HTML file. Records are saved beside the HTML or in another local folder you choose.

Example folder layout when using the default `Data` location. `<record-type>` represents the record-type label saved in the filename:

```text
EzEMR/
  EzEMR.html
  Data/
    clients.csv
    MRN-001/
      2026-10-30_S01_<record-type>.csv
      2026-10-30_S01_<record-type>.pdf
      2026-10-30_S01_<record-type>.txt
      2026-10-31_S02_<record-type>.csv
      2026-10-31_S02_<record-type>.pdf
      2026-10-31_S02_<record-type>.txt
```

Client folders use the medical record number, or the name if no number is provided. Session filenames use the date, session number, and record-type label. Existing filenames stay unchanged when the interface language changes.

| File | Contents and behavior |
| --- | --- |
| `clients.csv` | One row per client: ID, folder name, name, medical record number, dates of birth and onset, diagnosis, referral reason, surgery history, assessment and rehabilitation templates, creation date, and extra fields. Nested values occupy a single CSV cell as JSON. |
| Session `.csv` | One row per field with columns `schema_version`, `section`, `field`, `type`, and `value`. Preserves numbers, nulls, checkbox states, symptoms, assessments, COPM, and training data for re-import. For example, section `session` and field `/subjective` store the subjective note. |
| Session `.pdf` | A4 image-based document with line wrapping and pagination for reading and printing. Text cannot be selected or searched; use CSV for searching and analysis. |
| Session `.txt` | The same note as plain text, written in the interface language used when saving. It is rewritten with every save and is not read back; use CSV for re-import. |

CSV files use UTF-8 with a BOM for Chinese text and Excel compatibility. Creating, editing, configuring, or deleting a client updates `clients.csv`; no separate JSON database is required.

A new session creates CSV, PDF, and TXT files. Editing a session updates those files. Filenames remain fixed after the first save, even if the date or session number changes; the file contents contain the current values. Different records with the same base filename receive a numeric suffix to avoid overwriting each other.

### Remembered folder access

The browser remembers the selected main and optional copy folders in IndexedDB as file-system handles. These folder references are not written into `EzEMR.html` or included in JSON backups. At startup, the app reopens a remembered main folder when access is still granted; otherwise, the first screen offers to reconnect it. Use **File → Open record folder** to switch folders.

`Data` is a fixed default subfolder name, not a fixed path. The app creates or opens it inside the parent folder you select at the first save. To place it beside the HTML, select the folder containing `EzEMR.html`. To reopen existing records, select `Data` itself, or whichever folder contains `clients.csv`.

Another browser, browser profile, or computer needs its own folder selection and permission. Clearing browser data removes remembered folder access and records kept in browser storage, but leaves saved files in your local record folders intact.

### Change the storage location

Open **File → Storage location**. You may select the folder containing the HTML to keep `clients.csv` beside it, use `Data`, or select another local folder. Select the folder containing `clients.csv` for existing records, or an empty folder for a new collection. Switching locations reads the new folder and leaves the old files in place; it does not move or copy records automatically.

### Reload local records

The app reads and writes files in the local folder you select. After modifying those files outside the app, choose **File → Reload folder** to load the changes.

### Update the app or move records

To update the app, save any draft and keep the complete record folder, or export a full JSON backup if you use browser storage. Replace `EzEMR.html`, then reconnect the existing record folder or restore the backup if needed. Moving the HTML does not move local record folders.

To move records to another folder or computer, save any open draft and use either method:

- Copy the complete record folder, including `clients.csv` and all client subfolders. On another computer, also copy `EzEMR.html`. Open the HTML and choose **File → Open record folder**, selecting the copied folder containing `clients.csv`. This preserves the existing files and filenames.
- Export **Back up all data (JSON)**, then copy the backup and, if needed, `EzEMR.html` to the destination. Open the HTML, select an empty destination record folder, and use **Import** to restore the JSON. Restoration writes client data and creates session CSV, PDF, and TXT files in the selected folder.

If you use a second copy folder, configure it again in the destination browser.

## Import, export, and backups

- Use **Import**, or the import command under **File**, to import multiple CSV files produced by this app, a client roster, a single full JSON backup, supported `.xlsb` / `.xlsx` source workbooks, or test score files. Import Excel, CSV, JSON, and test score files separately.
- Use **Export → Export client roster CSV** to download `clients.csv`, **Export client Excel** / **Export all clients Excel** for workbooks, or **Back up all data (JSON)** for a complete data backup.
- Custom assessments, rehabilitation items, and result fields are included in progress tracking, CSV, PDF, Excel, and full backups. COPM comparisons still use the corresponding baseline in the full history when the visible list is filtered to post-rehabilitation records.
- In folder mode, **File → Set copy folder** can maintain a second local copy. Existing records are copied when connected; later writes, renames, and deletions are mirrored. Keep separate JSON backups when you need a copy unaffected by later deletions.

### Test score files

Select a client first, then choose **Import** and pick one or more score files. The files are recognized by their contents, not their names:

- OcuTrain JSON exports, including files that hold several runs, and OcuTrain CSV exports with `# Key: Value` header lines. Pursuit, fixation, saccade, and VOR runs are supported.
- The statistics CSV of the peripheral visual field (UFOV) training program: one row per parameter, keyed by codes such as `subtest_code`, `test_mode`, and `final_threshold_rt_ms`.

A preview lists one card per test run, with its date and time, item, test mode, main score, file name, and an **Import as** choice: **Assessment**, **Rehabilitation training**, or **Do not import**. The defaults are:

- OcuTrain runs in Evaluation mode go to assessments; Predictable and Random runs go to rehabilitation training.
- UFOV runs go to assessments when the client has an assessment record on the same date, and to rehabilitation training otherwise.
- Runs that were not completed, UFOV practice or instruction runs, and runs already imported are set to **Do not import**. You can change any choice before importing.

An assessment run fills the item's boxes in the record of that date. A training run is added as a test record under the matching training item, and its main score becomes that activity's score. If no record exists for the date, the import creates an assessment or treatment record. Existing results are never overwritten: a run whose values differ from results already saved is skipped and reported. The same run exported as both JSON and CSV is listed once.

The import stops if a file's subject ID matches the medical record number of a different client. A UFOV raw-score CSV contains only per-trial rows, and the UFOV JSON export does not record the test mode, so both are listed as notes and not imported; import the statistics CSV of the same run instead. A diplopia questionnaire saved with a run fills that run's diplopia field; a file holding only a questionnaire is not imported. Each imported run keeps its file name, subject ID, test date and time, and import key in the record's source details.

### Source workbooks and legacy SOAP folders

Excel import expects the source workbook's intake roster, assessment records, and rehabilitation records sheets and their existing column layout. It is not a general importer for arbitrary Excel files. Imported data retains worksheet names, row numbers, and original field values; client and record views show source details and medical history where available.

The legacy SOAP folder command under **File** reads JSON records grouped with their `client.json`. Select the parent folder containing the client subfolders. The importer skips `_archive`, keeps the latest `updated` version of duplicate session IDs, merges matching clients and sessions, and reports conflicting data. Equal names with different medical record numbers remain separate. When a number is missing, name matching must identify exactly one client with no conflicting birth date; the first known number fills a blank legacy number, and a reused internal client ID with a different number stops the import. JSON backup restore rejects duplicate client IDs or repeated session IDs within one client before the first write. Back up the destination before merging source data.

### Legacy records

Legacy `client.json` files and JSON session records can still be read. If no roster exists, saving a client creates `clients.csv`. When a roster exists, it is authoritative; an invalid roster stops loading to avoid overwriting it. Malformed or unreadable legacy JSON reports a filename and stops loading; a missing optional JSON file still falls back normally. Editing a client's medical record number keeps the existing folder and its files.

Editing an old record creates CSV, PDF, and TXT files and retains the original JSON. When both CSV and JSON represent the same session, CSV takes precedence.

## Offline use and browser storage

The generated HTML embeds Metro UI 5.1.20, its CSS, fonts and icons, SheetJS Community Edition 0.20.3 for Excel imports, and xlsx-js-style 1.2.0 for styled exports. Local vendor files, licenses and provenance are checked before building. No CDN or application package installation is needed. Record editing, supported imports and exports work offline.

A restrictive content policy and early privacy guard block network requests, remote scripts, frames, workers and form submissions. Downloads use local Blob URLs. The EyeDot mode-help dialog can copy its documentation URL; the app does not navigate to an external site. There is no remote fallback when an embedded library is unavailable.

Browsers without folder access use browser storage instead. Each saved session then downloads a ZIP containing its CSV and PDF inside a folder named after the medical record number, the client name, or the internal client identifier when both are blank. Extract and merge these files into your record folders manually; this mode does not update a fixed folder on disk.

Browser storage is not a replacement for downloaded files or backups. Clearing browser data removes the records kept there.

## License

EzEMR is released under the [MIT License](LICENSE).

## Repository and verification

```text
.gitignore             Excludes temporary test files and local Data folders
.gitattributes         Keeps Git hook line endings compatible across platforms
.githooks/pre-push     Builds the distribution, then runs full CI before pushing
.github/workflows/     Builds, verifies and uploads the single-file distribution
AGENTS.md              Development and push rules
src/index.html         Development markup with local script/style references
src/styles.css         Application styles
src/app.js             Application logic and bilingual source labels
src/privacy.js         Early outbound-network guard
src/theme.js           Early stored-theme initialization
src/excel-reader-init.js  Captures the isolated Excel reader before the writer loads
src/metro-init.js      Inert Metro HTML parsing compatible with the offline policy
vendor/                Pinned Metro and Excel libraries, licenses and provenance
scripts/build.cjs      Offline single-file build and consistency check
EzEMR.html             Generated distribution; do not hand-edit
LICENSE                MIT License
README.md              English documentation
README.zh-TW.md        Traditional Chinese documentation
tests/                 Browser tests and PDF/ZIP checks
  VERIFICATION.md      Test setup, coverage, and limitations
  run-ci.cjs           Shared full-suite runner for Git hooks and GitHub Actions
  lib/app.cjs          Builds isolated test artifacts from current sources
  build.cjs            Source separation, build integrity and offline-file checks
  metro-ui.cjs         Native Metro components and keyboard/viewport behavior
  offline-privacy.cjs  Outbound-request blocking and local record operations
  profile-settings.cjs  Required profile fields, validation and bilingual forms
  profile-storage.cjs  Folder/browser settings, backups and preserved profile data
  ci-runner.cjs        Failure handling and stop-on-error checks
  rehab-note.cjs       Record workflow, storage, and export tests
  storage.cjs          Client roster and folder tests
  toolbar.cjs          Menu, toolbar, and shortcut tests
  templates.cjs        Custom item and appearance tests
  assessment-picks.cjs Initial assessment items, tick-to-open sections, and per-activity scores in both languages
  language.cjs         Language switching and data preservation tests
  score-imports.cjs    OcuTrain and UFOV score imports, test settings, and test records in both languages
  imports.cjs          Empty startup, offline Excel and legacy SOAP imports in both languages
  import-identity.cjs  Patient identity matching, duplicate backup IDs, legacy read failures, and fixed folders
  excel-libraries.cjs  Excel reader isolation, XLSB imports and styled exports in both languages
  workspace.cjs        Offline file opening, client summaries, filters, keyboard tabs, and layout checks
  check_i18n.cjs       Source translation and English documentation gate
  check_exports.py     Independent PDF and ZIP validation
```

No package installation is needed to use the generated application. Development builds require only Node.js; no package installation or network access is needed to build. Edit `src/` and keep upstream dependencies in `vendor/`; never edit generated `EzEMR.html`. Open `src/index.html` for local-folder development, or build a standalone file:

```sh
node scripts/build.cjs
node scripts/build.cjs --check
node scripts/build.cjs --output .tmp/preview/EzEMR.html
```

The first command publishes the root `EzEMR.html`. `--check` reports whether it matches current sources without writing it. `--output` builds an isolated preview under `.tmp/`. Tests always build current sources into isolated artifacts and do not require a previously published file to be current. Development checks also require Acorn, Playwright with Chromium, and Python with `pypdf` and `PyMuPDF`; see [tests/VERIFICATION.md](tests/VERIFICATION.md).

After installing the test dependencies, enable the Git hook once per checkout:

```sh
git config --local core.hooksPath .githooks
```

Every `git push` then builds `EzEMR.html` before running `node tests/run-ci.cjs`. GitHub Actions follows the same build-and-test sequence and uploads the resulting HTML artifact. Sources are authoritative; CI does not require a committed generated file to match before building. Any failure stops the remaining steps and blocks the local push. New `.cjs` and `.py` scripts directly under `tests/` are included automatically. The runner builds one `.tmp/ci/EzEMR.html` snapshot for the suite; focused tests build their own process-local copy through `tests/lib/app.cjs`. The Excel test component is extracted from the verified local bundle without downloading it.

Every interface feature must include both Traditional Chinese and English. The translation gate rejects untranslated source text, new one-language labels, incomplete built-in label pairs, and Chinese text in this English README. New feature screens and states must also be covered by the bilingual browser tests, as required by [AGENTS.md](AGENTS.md).

`.tmp/` is ignored by Git. It holds generated test applications, previews, results, screenshots and exported synthetic files; these files are not required to use the distribution.

The tests fail if client records are embedded in `EzEMR.html`. They create synthetic clients in isolated browser contexts. `imports.cjs` also opens the published HTML directly from disk, then uses separate folders for synthetic Excel and legacy SOAP imports. Its bilingual checks cover import reports, errors, source labels, dates, duplicate records, and archive exclusion. Native operating-system folder dialogs and clinical suitability are outside automated coverage.

The translation gate excludes non-executable JSON data and verifies embedded Metro and Excel libraries against pinned SHA-256 hashes. Application scripts, import messages, accessible names, and built-in assessment label pairs remain subject to translation checks. Sheet names and column headers of the source workbook are data identifiers and stay unchanged in both languages. Regression probes confirm that untranslated UI and modified vendor scripts still fail the gate.

# EzEMR

[English](README.md) | [Traditional Chinese](README.zh-TW.md)

[![HTML5](https://img.shields.io/badge/HTML5-single_file-E34F26?logo=html5&logoColor=white)](EzEMR.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)](EzEMR.html)
[![Local files](https://img.shields.io/badge/Storage-local_CSV_%2F_PDF-2C3E50?logo=files&logoColor=white)](EzEMR.html)
[![GitHub issues](https://img.shields.io/github/issues/ian030590/EzEMR?logo=github)](https://github.com/ian030590/EzEMR/issues)
[![Full CI](https://img.shields.io/github/actions/workflow/status/ian030590/EzEMR/check-i18n.yml?branch=main&label=full%20CI&logo=githubactions)](https://github.com/ian030590/EzEMR/actions/workflows/check-i18n.yml)

EzEMR is a browser-based rehabilitation record tool for client information, SOAP notes, symptom scores, assessments, training results, and progress tracking. Open [EzEMR.html](EzEMR.html) directly in desktop Chrome or Edge. No server, build step, or application installation is required.

EzEMR supports English and Traditional Chinese. The application entry file is `EzEMR.html`.

## 🗂 Features

- Manage client details, diagnoses, referral reasons, and eye surgery history; filter the client list by name, medical record number, or diagnosis.
- Work in three tabs for each client: **Rehabilitation records**, **Progress tracking**, and **Item settings**.
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
5. Select the client, then choose **New record** from the toolbar. Fill in the SOAP note and symptom scores. Under **Assessments** and **Rehabilitation items**, tick what was done this visit to open its fields, then enter the results.
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
| View | Switch between light and dark appearance. |
| Toolbar | Add a record, save, import, and open the export menu. Copy-note and cancel actions appear while editing. |
| Export | Export one client's Excel workbook, all clients' Excel workbook, `clients.csv`, or a full JSON backup. |
| Ctrl+S / ⌘S | Save the current record. Disabled when there is no record to save. |
| Ctrl+O / ⌘O | Open a record folder. |
| Arrow keys, Enter, Escape, Tab | Navigate menus; Escape closes a menu or dialog. |

On wider screens, the toolbar stays visible while scrolling; on narrow screens, it scrolls with the page. Use **Filter clients** in the client list to find a client, and the arrow keys, Home, and End to move between the client's tabs.

The client summary shows the total record count, the latest record date, and the next session date from the latest record. **Rehabilitation records** shows the symptom chart and the record history, newest first; on wide screens the chart sits beside the history, and on narrow screens above it. Filters by record type and date change only the listed records, not the summary. **Progress tracking** shows symptom changes, assessment results, COPM comparisons, and training records. **Item settings** manages the client's assessment and rehabilitation templates.

Under **View**, the initial appearance follows the system setting; manual changes are remembered in the current browser. The light appearance uses white work surfaces, a pale gray background, teal accents, and thin separators. The dark appearance uses the same visual hierarchy. Noto Sans TC uses an installed font or the optional local file `EzEMR-assets/NotoSansTC-VF.ttf`, with system fonts as a fallback.

## Customize assessments and rehabilitation items

Select a client and open **Item settings**:

1. Choose **Add assessment** or **Add rehabilitation item**, then start with a built-in or blank template.
2. Enter a name. For assessments, configure the domain, instructions, and assessment timing. For rehabilitation items, enter activities, one per line.
3. Add result fields using text, number, long text, or dropdown types. Numbers support units, minimums, maximums, and steps; dropdown options use one option per line.
4. Choose **Save item**. The item can now be selected in the SOAP form. You can also add items from an open SOAP form without losing its draft.

### Initial assessment items

**Initial assessment items** at the top of **Item settings** lists the client's enabled assessments as tick boxes. Tick the items to test at the initial (baseline) assessment; each change is saved immediately. Items you have not changed stay included, so existing clients keep their previous behavior.

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

The legacy SOAP folder command under **File** reads JSON records grouped with their `client.json`. Select the parent folder containing the client subfolders. The importer skips `_archive`, keeps the latest `updated` version of duplicate session IDs, merges matching clients and sessions, and reports conflicting data. Back up the destination before merging source data.

### Legacy records

Legacy `client.json` files and JSON session records can still be read. If no roster exists, saving a client creates `clients.csv`. When a roster exists, it is authoritative; an invalid roster stops loading to avoid overwriting it.

Editing an old record creates CSV, PDF, and TXT files and retains the original JSON. When both CSV and JSON represent the same session, CSV takes precedence.

## Offline use and browser storage

The HTML embeds SheetJS Community Edition 0.20.3 (Apache-2.0) for reading Excel imports and xlsx-js-style 1.2.0 for styled Excel export, both pinned by SHA-256. Record editing, CSV/PDF saving, supported Excel import, and Excel export work offline. Fonts use local or system files. The app retains a jsDelivr fallback for loading the export library if `window.XLSX` is unavailable.

Browsers without folder access use browser storage instead. Each saved session then downloads a ZIP containing its CSV and PDF inside a folder named after the medical record number, or the client name if no number is provided. Extract and merge these files into your record folders manually; this mode does not update a fixed folder on disk.

Browser storage is not a replacement for downloaded files or backups. Clearing browser data removes the records kept there.

## License

EzEMR is released under the [MIT License](LICENSE).

## Repository and verification

```text
.gitignore             Excludes temporary test files and local Data folders
.gitattributes         Keeps Git hook line endings compatible across platforms
.githooks/pre-push     Runs full CI before every push
.github/workflows/     Full CI on pushes and pull requests
AGENTS.md              Development and push rules
EzEMR.html             Application and embedded Excel import/export libraries
LICENSE                MIT License
README.md              English documentation
README.zh-TW.md        Traditional Chinese documentation
tests/                 Browser tests and PDF/ZIP checks
  VERIFICATION.md      Test setup, coverage, and limitations
  run-ci.cjs           Shared full-suite runner for Git hooks and GitHub Actions
  ci-runner.cjs        Failure handling and stop-on-error checks
  rehab-note.cjs       Record workflow, storage, and export tests
  storage.cjs          Client roster and folder tests
  toolbar.cjs          Menu, toolbar, and shortcut tests
  templates.cjs        Custom item and appearance tests
  assessment-picks.cjs Initial assessment items, tick-to-open sections, and per-activity scores in both languages
  language.cjs         Language switching and data preservation tests
  score-imports.cjs    OcuTrain and UFOV score imports, test settings, and test records in both languages
  imports.cjs          Empty startup, offline Excel and legacy SOAP imports in both languages
  excel-libraries.cjs  Excel reader isolation, XLSB imports and styled exports in both languages
  workspace.cjs        Offline file opening, client summaries, filters, keyboard tabs, and layout checks
  check_i18n.cjs       Source translation and English documentation gate
  check_exports.py     Independent PDF and ZIP validation
```

No package installation is needed to use the application. Development checks require Node.js, Acorn, Playwright with Chromium, and Python with `pypdf` and `PyMuPDF`. See [tests/VERIFICATION.md](tests/VERIFICATION.md) for setup and commands.

After installing the test dependencies, enable the Git hook once per checkout:

```sh
git config --local core.hooksPath .githooks
```

Every `git push` then runs `node tests/run-ci.cjs`. The same command runs in GitHub Actions on pushes and pull requests. It checks translations, record workflows, storage, menus, templates, language switching, imports, test score imports, layouts, PDF/ZIP exports, and runner failure handling. Any failure stops the remaining steps and blocks the local push. New `.cjs` and `.py` test scripts in `tests/` are included automatically. The pinned Excel test component is downloaded on first use and reused from `.tmp/`.

Every interface feature must include both Traditional Chinese and English. The translation gate rejects untranslated source text, new one-language labels, incomplete built-in label pairs, and Chinese text in this English README. New feature screens and states must also be covered by the bilingual browser tests, as required by [AGENTS.md](AGENTS.md).

`.tmp/` is ignored by Git. It holds generated test results, screenshots, exported test files, and the downloaded Excel test component; these files are not required to use the application.

The tests fail if client records are embedded in `EzEMR.html`. They create synthetic clients in isolated browser contexts. `imports.cjs` also opens the published HTML directly from disk, then uses separate folders for synthetic Excel and legacy SOAP imports. Its bilingual checks cover import reports, errors, source labels, dates, duplicate records, and archive exclusion. Native operating-system folder dialogs and clinical suitability are outside automated coverage.

The translation gate excludes non-executable JSON data and checks both embedded Excel libraries against pinned SHA-256 hashes. Application scripts, import messages, accessible names, and built-in assessment label pairs remain subject to translation checks. Sheet names and column headers of the source workbook are data identifiers and stay unchanged in both languages. Regression probes confirm that untranslated UI and modified vendor scripts still fail the gate.

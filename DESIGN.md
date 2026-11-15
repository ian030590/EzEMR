---
name: EzEMR
description: Local-only rehabilitation records, laid out like a well-kept clinical form.
colors:
  clinic-teal: "#176b65"
  on-teal: "#ffffff"
  teal-wash: "#e8f3f1"
  baseline-ochre: "#806122"
  ochre-wash: "#f6efdf"
  signal-green: "#1d7448"
  green-wash: "#e1f2e8"
  alert-red: "#b3261e"
  red-wash: "#fbe6e4"
  caution-amber: "#9a5a06"
  amber-wash: "#fbf0dc"
  chart-ink: "#203337"
  label-slate: "#586d72"
  field-outline: "#809397"
  rule-line: "#dce5e6"
  form-white: "#ffffff"
  well-grey: "#f6f8f8"
  mist-ground: "#f3f6f6"
  clinic-teal-dark: "#7dd4c5"
  on-teal-dark: "#102b26"
  teal-wash-dark: "#1c3532"
  baseline-ochre-dark: "#d9b56a"
  ochre-wash-dark: "#2a2416"
  signal-green-dark: "#63c992"
  green-wash-dark: "#15291f"
  alert-red-dark: "#f08a80"
  red-wash-dark: "#33191a"
  caution-amber-dark: "#f0b05e"
  amber-wash-dark: "#2f2412"
  chart-ink-dark: "#e2e9ed"
  label-slate-dark: "#95a6b0"
  field-outline-dark: "#718591"
  rule-line-dark: "#29363f"
  form-white-dark: "#161f25"
  well-grey-dark: "#121a1f"
  mist-ground-dark: "#0e1418"
typography:
  display:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + .4vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  subtitle:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  table:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  control:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: ".875rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif"
    fontSize: ".875rem"
    fontWeight: 600
    lineHeight: 1.45
rounded:
  tag: "2px"
  key: "3px"
  tile: "4px"
  control: "6px"
  panel: "8px"
  preview: "10px"
  dialog: "14px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.clinic-teal}"
    textColor: "{colors.on-teal}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "2px 10px"
    height: "44px"
  button-default:
    backgroundColor: "{colors.form-white}"
    textColor: "{colors.chart-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "2px 10px"
    height: "44px"
  button-default-hover:
    backgroundColor: "{colors.well-grey}"
  button-danger:
    backgroundColor: "{colors.form-white}"
    textColor: "{colors.alert-red}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    height: "44px"
  button-link:
    textColor: "{colors.clinic-teal}"
    typography: "{typography.control}"
    padding: "4px 6px"
  toolbar-save:
    backgroundColor: "{colors.clinic-teal}"
    textColor: "{colors.on-teal}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "2px 10px"
    height: "44px"
  tool-button-hover:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.clinic-teal}"
  input-field:
    backgroundColor: "{colors.form-white}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.control}"
    padding: "2px 10px"
    height: "44px"
  input-search:
    backgroundColor: "{colors.well-grey}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.control}"
    padding: "2px 10px"
    height: "44px"
  pick-tile:
    backgroundColor: "{colors.form-white}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.control}"
    padding: "6px 8px"
    height: "44px"
  pick-tile-selected:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.clinic-teal}"
  tab:
    textColor: "{colors.label-slate}"
    typography: "{typography.control}"
    padding: "6px 10px"
    height: "44px"
  tab-selected:
    textColor: "{colors.clinic-teal}"
  chip:
    backgroundColor: "{colors.well-grey}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
  chip-before:
    backgroundColor: "{colors.ochre-wash}"
    textColor: "{colors.baseline-ochre}"
  chip-after:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.clinic-teal}"
  panel:
    backgroundColor: "{colors.form-white}"
    rounded: "{rounded.panel}"
    padding: "16px"
  soap-letter:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.clinic-teal}"
    rounded: "{rounded.panel}"
    size: "44px"
  score-tile:
    backgroundColor: "{colors.well-grey}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.tile}"
    padding: "8px 10px"
  dialog:
    backgroundColor: "{colors.form-white}"
    rounded: "{rounded.dialog}"
    padding: "28px"
  toast:
    backgroundColor: "{colors.chart-ink}"
    textColor: "{colors.mist-ground}"
    rounded: "{rounded.panel}"
    padding: "10px 16px"
---

# Design System: EzEMR

## Overview

**Creative North Star: "The Ruled Clinical Form"**

EzEMR looks like a well-kept outpatient form. Sections are printed boxes on a pale ground. Hairline rules separate them. Every field has a label above it and a plain outlined box below it. Values sit in tabular figures, so columns of scores line up the way handwritten numbers do on a ruled sheet. The structure does the work: a therapist recognises S, O, A and P, the stage of a measurement and the current client without reading any decoration.

It should feel precise, quiet and trustworthy. Precise: numbers align, signed changes show their sign, and every stage has a fixed color. Quiet: one teal accent, flat surfaces, no ornament, and emphasis spent only where something is selected, current or needs attention. Trustworthy: the screen states what it knows and nothing more. Change colors show direction without implying a verdict, warnings stay visible, and the same control looks the same everywhere.

The density is that of a working clinical tool. Desktop forms run edge to edge in fluid grids, and sticky chrome keeps the client and the current place in view while long records scroll. Nothing animates beyond a 150ms border or background change. The system is built on Metro UI 5.1.20, whose variables are mapped onto these tokens. Everything is embedded in a single offline HTML file.

**Key Characteristics:**

- One family (Noto Sans TC with CJK system fallbacks), with weight and size carrying the hierarchy.
- One accent (Clinic Teal), plus a fixed vocabulary of state colors.
- Flat white panels on a mist ground, separated by 1px rules. Shadows appear only on floating layers.
- A 44px minimum target on every interactive control, at every width.
- Tabular figures for every score, measurement and date column.
- Light and dark appearances that share one hierarchy.

## Colors

The palette is mostly cool grey-greens, with a single teal accent and a small, fixed set of state colors whose meanings never change. Every token has a light and a dark value (the `-dark` keys). Both live in `src/styles.css` as CSS custom properties on `:root`, which are redefined under `prefers-color-scheme: dark` and `[data-theme="dark"]`.

### Primary

- **Clinic Teal** (`--accent`): the only accent. Used for the solid primary action in an area (Save, New record, Done, Add assessment), the selected tab underline, the selected pick tile's text and border, focus rings, links, the current workflow step, the S/O/A/P letters and the end-of-session score. In dark mode it becomes a light mint so it keeps its contrast.
- **On Teal** (`--accent-ink`): text and icons on solid Clinic Teal.
- **Teal Wash** (`--accent-soft`): tinted backgrounds for selected pick tiles, menu and tool-button hover, the current workflow step, S/O/A/P letter badges and end-of-session score tiles.

### Secondary

- **Baseline Ochre** (`--pre`): marks before-session (pre-test) measurements: the "before" score tile, the ochre stage bar on a symptom-table row, the "before" chart legend chip, and the first short-term stage legend. The name refers to the starting value within a session. It does **not** mean the *Baseline assessment* record type.
- **Ochre Wash** (`--pre-soft`): background of before-session tiles and chips.

### Tertiary (state)

- **Signal Green** (`--good`) / **Green Wash**: the favorable direction of a comparable signed change (a lower symptom score, a COPM gain) and the recovery-stage bar.
- **Alert Red** (`--bad`) / **Red Wash**: the unfavorable direction of a comparable change, out-of-range input flags, destructive actions, absence records, and the edge bar on failure messages.
- **Caution Amber** (`--warn`) / **Amber Wash**: comparison and consistency warnings, incomplete-profile notices, historical-record state and missing evidence.

### Neutral

- **Chart Ink** (`--ink`): all primary text and values. Also the toast background.
- **Label Slate** (`--muted`): field labels, captions, inactive tabs, notes and table headers.
- **Field Outline** (`--control-line`): borders on inputs, selects and pick tiles. Also used for stronger separators, such as between clinical-map rows.
- **Rule Line** (`--line`): 1px hairlines between sections, table rows, panels and menu groups.
- **Form White** (`--surface`): panels, dialogs, menus and input fields.
- **Well Grey** (`--sunk`): recessed fills for score tiles, table headers, search and password inputs, folded settings, the visual-field entry and the first clinical-map column.
- **Mist Ground** (`--bg`): the page behind panels.

### Named Rules

**The One Teal Rule.** Clinic Teal is the only accent hue. A solid teal fill marks the single primary action of an area. Elsewhere teal appears only as text, an outline or a wash, to show what is selected, focused or current.

**The Stage Color Rule.** Before-session is Baseline Ochre, end-of-session is Clinic Teal, and recovery is Signal Green. A stage keeps its color in score tiles, table row bars, chart lines and legends.

**The Direction-Not-Verdict Rule.** Green and red mark only the direction of a comparable signed change, and always appear next to the number and its explicit sign (`+1`, `−2`). When the compared sets differ, the change is suppressed and no color is shown.

## Typography

**Display Font:** Noto Sans TC (with Microsoft JhengHei, PingFang TC, system-ui, sans-serif)
**Body Font:** Noto Sans TC (same stack)

**Character:** A single humanist CJK sans serves both scripts, with Latin text, numbers and Han characters in one voice. Hierarchy comes from weight (400 body, 600 labels and controls, 700 headings) and a short size ladder, never from a second family. The font loads from the local install only. With no remote font allowed, the system CJK fonts are the fallback.

### Hierarchy

- **Display** (700, `clamp(1.6rem, 2.4vw, 2rem)`, 1.25): the welcome-screen title only, capped at 25ch.
- **Headline** (700, `clamp(1.5rem, 1.3rem + .4vw, 1.75rem)`, 1.25): screen titles such as the connect screen, the editor heading and the client's name in the summary.
- **Title** (700, 1.25rem, 1.25): section titles inside panels and SOAP section headings.
- **Subtitle** (700, 1.125rem, 1.25): dashboard headings, session dates on record cards, the brand mark, and symptom names in the clinical map.
- **Body** (400, 1rem, 1.45; 1.4 in English): notes, clinical text and descriptions. Prose blocks cap at 52–75ch.
- **Table** (400, .9375rem, tabular figures): symptom and outcome tables and dashboard score heads.
- **Control** (600 for buttons and tabs, 400 for field text; .875rem, 1.5): every button, input, select, menu item and tab.
- **Label** (600, .875rem, Label Slate): field labels above inputs, captions, chip text and table headers.

### Named Rules

**The Tabular Numbers Rule.** Scores, measurements, counts and date columns use `font-variant-numeric: tabular-nums`, so values align down a column.

**The Fourteen-Pixel Floor.** No running text goes below .875rem (14px). Help tooltips, chips, labels and captions all sit at that floor.

**The No-Remote-Font Rule.** Fonts come only from the local install or embedded data URIs. The offline Content Security Policy forbids any other source.

## Layout

The page is a fluid, full-width working surface with no centered max-width container. A sticky application bar (61px tall on desktop, one row at 1200px and wider) holds the brand, File/Client/Settings/Help menus, the import/export toolbar, client search, New client and the language selector. Between 861px and 1199px it moves the toolbar to a second row while a record is being edited. At 860px and below it rearranges into two or three rows. The main area is padded 12px 16px 32px (10px 8px 24px at 560px and below) and stacks panels with a 12px gap.

Inside panels, fields use auto-fit grids (`minmax(180px, 1fr)`, 16px gap) with each label above its control. Score tiles use auto-fit at 140–150px. A SOAP section is a two-column grid: a 44px letter badge, then the content. It stacks at 560px. Rehabilitation records show the history and the symptom chart side by side at 1200px and wider (`1fr` and `minmax(300px, .75fr)`), and stacked below that. Dialogs are 520px wide by default and 900px for assessment and training entry, with a sticky action row at the bottom.

While editing, the workflow bar sticks below the application bar. It keeps the client, record number, visit date and type, edit state and the current SOAP/item/stage path visible. Near the top of the editor its steps wrap onto further lines, so every step stays visible in both languages. Once it is stuck it collapses to one compact row (no taller than 64px on desktop): identity, path, save state, a Sections toggle, the assessment picker and Return to previous entry. Its space in the page flow stays constant, so collapsing never shifts the content. At 860px and below the application bar scrolls away while editing; only the workflow bar sticks, and its compact form carries its own Save.

Wide tables scroll sideways inside a bordered, focusable wrapper with a sticky first column. Inside a panel that already has a border, as in Progress tracking, the wrapper drops its own border. Below 560px they add a scroll hint. In the client summary, the two history disclosures sit side by side at 700px and wider.

Spacing follows a 4px base: 4, 8, 12, 16, 20, 24 and 32px, with 8px as the standard control gap. Breakpoints observed: 350, 450, 480, 560, 600, 700, 760, 860, 1100 and 1200px.

### Named Rules

**The 44px Target Rule.** Every interactive control (buttons, inputs, selects, tabs, pick tiles, menu items, summaries) keeps a minimum 44px target at every width. Small help triggers extend an invisible 44px hit area.

**The Sticky Context Rule.** On long forms, where the user is stays visible. The application bar and the editor's workflow bar stick to the top, so client, visit and current section are never lost while scrolling. On narrow screens the workflow bar alone carries this context, so the sticky area stays small.

## Elevation & Depth

The system is flat. Panels, cards, record items and tiles rest on the page with no shadow and are separated only by 1px Rule Line borders and tonal fills: Form White on Mist Ground, Well Grey for recessed areas. Depth is reserved for layers that actually float above the page: command menus, the search results popup, help tooltips and dialogs. Dialogs also dim the page behind them.

### Shadow Vocabulary

- **Float** (`box-shadow: 0 12px 36px rgba(20, 46, 49, .14)`): menus, the client search popup, help tooltips and dialogs.
- **Scrim** (`background: rgba(10, 18, 24, .45)`): the overlay behind a dialog.
- **Edge bar** (`box-shadow: inset 3px 0 0 <stage color>` or a 3–4px left border): not elevation. A colored edge marks only a measurement-stage row, a failure message or a warning callout.

### Named Rules

**The Float-Only Shadow Rule.** A shadow means "this layer floats above the page". Content at rest never carries one.

## Shapes

Corners are gently rounded and grow with the size of the object. Small marks are nearly square: chips 2px, keyboard keys 3px, score tiles and list rows 4px. Controls (buttons, inputs, selects, pick tiles, menus) use 6px. Containers (panels, record cards, folded sections, the workflow bar) use 8px. The folder preview uses 10px and dialogs 14px. The only full circle is the small "?" help trigger. Borders are 1px throughout. Field Outline borders controls, and Rule Line borders containers. A selected tile switches its border to Clinic Teal.

Icons are inline SVG line drawings: 18px in the toolbar and 14px for the plus on add actions. They use a 1.7–1.8 stroke with square caps and mitred joins, so their straight terminals match the ruled lines. Metro's icon font is embedded for library components.

## Components

### Buttons

Plain and dependable: standard shapes, generous targets, and one obvious action per area.

- **Shape:** gently rounded (6px), at least 44px tall, padded 2px 10px, 600-weight control text.
- **Primary:** solid Clinic Teal with On Teal text. Used once per area: New record, Done, Add assessment, the toolbar Save while editing, and the compact workflow bar's Save at 860px and below.
- **Default:** Form White with a resting 1px Field Outline border, so it reads as a button and not as bold text. On hover the border turns Clinic Teal and the fill becomes Well Grey.
- **Danger:** the default outline with Alert Red text, and a red border on hover. Used for actions that remove data, such as Clear results. The solid red variant is used only to confirm destructive steps.
- **Disabled:** Label Slate text on Well Grey with a Rule Line border, at full opacity, with a not-allowed cursor. When the reason is not obvious, the control says why in its description, as Return to previous entry does.
- **Borderless kinds:** links, close buttons, toolbar buttons, menu items, tabs and workflow steps carry no resting outline. The small help trigger keeps its own 1px Field Outline circle.
- **Link:** borderless Clinic Teal text for inline actions.
- **Toolbar buttons:** icon plus label. On hover they take Teal Wash with teal text. Disabled toolbar and menu items keep Label Slate text, with no opacity fade. Editing tools (Save, Copy note, Cancel editing) each carry an 18px line icon.
- **Focus:** a 2px solid Clinic Teal outline with a 2px offset, on every control.

### Chips

- **Style:** Well Grey fill, 2px corners, padding 3px 7px, .875rem text.
- **State variants:** before-session (Ochre Wash / Baseline Ochre), after-session (Teal Wash / Clinic Teal), favorable (Green Wash / Signal Green), unfavorable (Red Wash / Alert Red). Chips label things. They are not buttons.

### Cards / Containers

- **Corner Style:** 8px.
- **Background:** Form White on Mist Ground. Folded sections (`details`) and visual-field entry use Well Grey.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Rule Line. Record history cards use Field Outline, so each record reads as a distinct sheet.
- **Internal Padding:** 16px (12px at 560px and below).

### Inputs / Fields

- **Style:** Form White fill, 1px Field Outline border, 6px corners, at least 44px tall, 400-weight text at .875rem. Search and password fields use a Well Grey fill. The label sits above the field in 600-weight Label Slate.
- **Focus:** the border turns Clinic Teal and the 2px teal focus ring appears.
- **Error / Disabled:** out-of-range numbers turn Alert Red with a Red Wash fill and 600 weight. Disabled buttons follow the Buttons section.

### Pick Tiles

Checkbox tiles used to select assessments, rehabilitation items and strategies.

- **Style:** an outlined 6px tile with the checkbox and label inline, at least 44px tall, wrapping in a row with an 8px gap.
- **Selected:** Teal Wash fill, Clinic Teal border and text, 600 weight. The browser checkbox uses `accent-color` Clinic Teal.

### Navigation

- **Menubar:** text-only menu triggers (File, Client, Settings, Help) at control size. Hover and open states take Teal Wash and teal text. Menus are 280px floating panels with 44px rows, group labels, separators and shortcut keys shown as small outlined keycaps.
- **Tabs:** Label Slate 600-weight text with a 2px transparent underline. The selected tab turns Clinic Teal with a teal underline. Arrow keys move between tabs.
- **Workflow steps:** a wrapping strip of quiet, borderless steps styled like tabs. The current step takes Teal Wash, Clinic Teal text, a 3px teal bottom border and 700 weight. In the compact bar the strip folds behind the Sections toggle and opens again when keyboard focus enters it.

### Trend Charts

- **Where:** in Progress tracking, above a measure's table, once it has numeric values on at least two dates. Values are never invented or interpolated; a missing value breaks the line.
- **Marks:** a single series is a 2px Clinic Teal line with 4px points. A staged short-term item plots Pre 1 as a dashed Baseline Ochre line and Immediate post as Clinic Teal (Stage Color Rule). Gridlines are Rule Line, and labels are 14px tabular Label Slate. The start and end dates are localized, and each point has a title with date, record type and value.
- **Change line:** beside the chart, Chart Ink text states first → latest with a signed difference and unit, for example "71.2 → 86.9 (+15.7) %". It is never green or red (Direction-Not-Verdict Rule).
- **Size:** 152px tall. The chart fits its panel from 360px up by adapting its width; text is never scaled down.

### Signature: SOAP Section Letter

A 44px square badge (8px corners) in Teal Wash, holding a single Clinic Teal letter at 1.25rem/600: S, O, A or P. It anchors each section's left column the way printed section codes anchor a paper form. The wash tile is the whole mark, with no edge stripe.

### Signature: Score Tiles and Stage Bars

Symptom and outcome summaries are small Well Grey tiles (4px corners, 8px 10px padding). Each has a Label Slate caption over a 600-weight tabular value written as `before → after` and a signed change. Before-session tiles take Ochre Wash with Baseline Ochre values, and end-of-session tiles take Teal Wash with Clinic Teal values. In symptom tables, a 3px inset bar in the stage color marks each timepoint row.

### Signature: Visual-Field Cross

Each eye is a cross of four direction fields around a centre label, drawn over 2px Field Outline axes on a Well Grey panel. OD is on the left and OS on the right, with OU below. The crosses stack on narrow screens.

## Do's and Don'ts

### Do:

- **Do** define every new color as a custom property in all three theme blocks in `src/styles.css`: the light `:root`, the `prefers-color-scheme: dark` block and `[data-theme="dark"]`.
- **Do** keep every interactive control at least 44px tall and wide, including at 560px and below.
- **Do** separate content with 1px Rule Line borders and tonal fills (Form White, Well Grey, Mist Ground) rather than shadows.
- **Do** reserve the 3–4px colored left edge for measurement-stage rows and failure or warning callouts.
- **Do** set scores, measurements and date columns in tabular figures, and write signed changes with an explicit sign.
- **Do** keep the 2px solid Clinic Teal focus ring with a 2px offset on every focusable element.
- **Do** limit motion to 150ms border-color and background transitions inside `prefers-reduced-motion: no-preference`.

### Don't:

- **Don't** load fonts, icons, images or stylesheets from a network source. Embed them in the build.
- **Don't** put a shadow on panels, cards or tiles at rest. Shadows belong only to menus, popups, tooltips and dialogs.
- **Don't** introduce a second accent hue, or use Signal Green, Alert Red, Caution Amber or Baseline Ochre for decoration.
- **Don't** signal the direction of a change with color alone. Show the number and its sign.
- **Don't** set running text below .875rem (14px).
- **Don't** use more than one solid Clinic Teal action in the same area.
- **Don't** put a colored edge stripe on loading states, references, navigation bars or badges.

# Project rules

- Every new or changed automated test must run through `.githooks/pre-push` and `node tests/run-ci.cjs`. Confirm automatic discovery includes it, or update the runner in the same change. A failed test must block the push; never use `--no-verify`, disable the hook, or skip failing tests to publish a change.

- Keep the application in `EzEMR.html`; it must open directly in a desktop browser without a server or runtime package installation.
- Every new or changed interface feature must support both Traditional Chinese (`zh-TW`) and English (`en`), including labels, menus, placeholders, validation, loading, empty and error states, dialogs, and accessible names.
- Use Chinese source literals through `ui('…')` or the `ui` template tag, and add the English text to `UI_EN`. Add both labels for built-in assessment/training items to `LABELS`. Keep shared acronyms in the explicit localization-check allowlist only when the same text serves both languages.
- Translate source literals only. Keep names, clinical notes, custom item names, results, canonical option values, identifiers, CSV schema, and existing filenames unchanged when switching languages.
- Before committing or pushing an interface feature, run `node tests/check_i18n.cjs` and `node tests/language.cjs`, plus the affected existing tests. Add the feature's new screens and states to the bilingual browser checks. Missing translations or a failed language check must block the change.
- Every push must run the complete suite through `.githooks/pre-push` and `node tests/run-ci.cjs`. Enable it once per checkout with `git config --local core.hooksPath .githooks`. Do not bypass or disable the hook. GitHub Actions uses the same runner; new `.cjs` and `.py` test scripts under `tests/` are included automatically.
- Keep the English `README.md` entirely in English; maintain `README.zh-TW.md` alongside it. Document local-folder use and keep test output under ignored `.tmp/`.

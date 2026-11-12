async function completeAssessment(page) {
  if (!await page.locator('#assessmentResultForm').count()) return;
  await page.locator('#assessment-done').click();
  await page.waitForSelector('#assessmentResultForm', { state: 'detached' });
}

async function openAssessment(page, id) {
  if (await page.locator(`#assessmentResultForm [data-entry="${id}"]`).count()) return;
  await completeAssessment(page);
  const checkbox = page.locator('#ac-' + id);
  if (await checkbox.isChecked()) await page.locator(`[data-action="assessment-edit"][data-id="${id}"]`).click();
  else await checkbox.check();
  await page.waitForSelector(`#assessmentResultForm [data-entry="${id}"]`);
}

async function selectAssessment(page, id) {
  await openAssessment(page, id);
  await completeAssessment(page);
}

module.exports = { openAssessment, completeAssessment, selectAssessment };

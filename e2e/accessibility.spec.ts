import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const expectNoWcagViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze()
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.flatMap((node) => node.target),
  }))

  expect(summary).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
})

test('meets automated WCAG checks in the primary workspace', async ({ page }) => {
  await page.goto('./')
  await expectNoWcagViolations(page)
})

test('keeps the export dialog free of automated WCAG violations', async ({ page }) => {
  await page.goto('./')

  await page.getByRole('button', { name: 'Export current project' }).click()
  await expectNoWcagViolations(page)
})

test('keeps the share dialog free of automated WCAG violations', async ({ page }) => {
  await page.goto('./')

  await page.getByRole('button', { name: 'Share current project' }).click()
  await expectNoWcagViolations(page)
})

test('meets automated WCAG checks in the mobile workspace', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await expectNoWcagViolations(page)
})

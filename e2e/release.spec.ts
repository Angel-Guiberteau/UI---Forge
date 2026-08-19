import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
})

test('loads the production workspace without browser errors', async ({ page }) => {
  const browserErrors: string[] = []

  page.on('pageerror', (error) => browserErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') {
      browserErrors.push(message.text())
    }
  })

  await page.goto('./')

  await expect(page).toHaveTitle('UI Forge — Shape a system')
  await expect(page.getByRole('heading', { name: 'Choose a character' })).toBeVisible()
  await expect(page.locator('.specimen__logo')).toContainText('Northstar')
  await expect(page.getByRole('link', { name: 'UI Forge home' })).toHaveAttribute('href', '/UI---Forge/')
  expect(browserErrors).toEqual([])
})

test('updates the live system across preset, token, mode, and viewport changes', async ({ page }) => {
  await page.goto('./')

  const specimen = page.locator('.specimen')

  await page.getByRole('button', { name: /Playful/ }).click()
  await expect(page.getByRole('button', { name: /Playful/ })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: 'Colors' }).click()
  const primaryValue = page.getByRole('textbox', { name: 'Primary hexadecimal value' })
  await primaryValue.fill('#3366ff')
  await primaryValue.press('Enter')

  await expect(primaryValue).toHaveValue('#3366FF')
  await expect(specimen).toHaveCSS('--color-primary', '#3366FF')

  await page.getByRole('button', { name: 'Dark' }).click()
  await expect(specimen).toHaveAttribute('data-mode', 'dark')

  await page.getByRole('button', { name: 'Mobile preview' }).click()
  await expect(specimen).toHaveAttribute('data-viewport', 'mobile')
  await expect(page.getByText('mobile · dark')).toBeVisible()
})

test('keeps export and share handoffs keyboard accessible', async ({ page }) => {
  await page.goto('./')

  const exportTrigger = page.getByRole('button', { name: 'Export' })
  await exportTrigger.click()

  const exportDialog = page.getByRole('dialog', { name: 'Export production tokens' })
  await expect(exportDialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close export dialog' })).toBeFocused()
  await page.getByRole('tab', { name: /Tailwind v4/ }).click()
  await expect(page.getByLabel('TAILWIND export preview')).toContainText('@theme')
  await page.keyboard.press('Escape')
  await expect(exportDialog).toBeHidden()
  await expect(exportTrigger).toBeFocused()

  const shareTrigger = page.getByRole('button', { name: 'Share current project' })
  await shareTrigger.click()

  const shareDialog = page.getByRole('dialog', { name: 'Share this system' })
  await expect(shareDialog).toBeVisible()
  await expect(page.getByLabel('Private share link')).toHaveValue(/#share=/)
  await page.keyboard.press('Escape')
  await expect(shareDialog).toBeHidden()
  await expect(shareTrigger).toBeFocused()
})

test('provides an intentional mobile workspace flow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')

  const workspaceNavigation = page.getByRole('navigation', { name: 'Workspace sections' })
  await expect(workspaceNavigation).toBeVisible()
  await expect(page.getByRole('button', { name: 'Preview', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.specimen')).toHaveAttribute('data-viewport', 'mobile')

  await page.getByRole('button', { name: 'Design', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Design', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('heading', { name: 'Choose a character' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

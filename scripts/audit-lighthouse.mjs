import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'

const url = 'http://127.0.0.1:4173/UI---Forge/'
const scoreBudgets = {
  performance: 0.9,
  accessibility: 1,
  'best-practices': 1,
  seo: 1,
}
const metricBudgets = {
  'first-contentful-paint': 2_000,
  'largest-contentful-paint': 2_500,
  'total-blocking-time': 200,
  'cumulative-layout-shift': 0.1,
  'speed-index': 4_500,
}

const previewCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const preview = spawn(previewCommand, [
  'run',
  'preview',
  '--',
  '--base',
  '/UI---Forge/',
  '--host',
  '127.0.0.1',
  '--port',
  '4173',
], { stdio: 'ignore' })

const waitForPreview = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url)

      if (response.ok) {
        return
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }

  throw new Error('The production preview did not become ready.')
}

let chrome

try {
  await waitForPreview()
  chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })
  const result = await lighthouse(url, {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
    onlyCategories: Object.keys(scoreBudgets),
  })

  if (!result) {
    throw new Error('Lighthouse did not return a report.')
  }

  await mkdir('.lighthouse', { recursive: true })
  await writeFile('.lighthouse/report.json', result.report)

  const scoreFailures = Object.entries(scoreBudgets).flatMap(([category, minimum]) => {
    const score = result.lhr.categories[category]?.score ?? 0
    return score >= minimum ? [] : [`${category}: ${Math.round(score * 100)} < ${Math.round(minimum * 100)}`]
  })
  const metricFailures = Object.entries(metricBudgets).flatMap(([audit, maximum]) => {
    const value = result.lhr.audits[audit]?.numericValue ?? Number.POSITIVE_INFINITY
    const measuredValue = audit === 'cumulative-layout-shift' ? value.toFixed(3) : Math.round(value)
    return value <= maximum ? [] : [`${audit}: ${measuredValue} > ${maximum}`]
  })
  const scores = Object.keys(scoreBudgets).map((category) => {
    const score = result.lhr.categories[category]?.score ?? 0
    return `${category} ${Math.round(score * 100)}`
  })

  process.stdout.write(`Lighthouse: ${scores.join(' · ')}\n`)

  if (scoreFailures.length > 0 || metricFailures.length > 0) {
    throw new Error(`Quality budgets failed:\n${[...scoreFailures, ...metricFailures].join('\n')}`)
  }
} finally {
  await chrome?.kill()
  preview.kill('SIGTERM')
}

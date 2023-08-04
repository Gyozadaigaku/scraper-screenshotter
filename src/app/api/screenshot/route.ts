import { NextResponse } from 'next/server'
import puppeteer, { Browser, Page } from 'puppeteer'
const devices = require('puppeteer').devices
import pMap from 'p-map'

// Share one browser instance
const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]

const browserPromise: Promise<Browser> = puppeteer.launch({ headless: true, args: minimal_args })

export async function GET(req: Request) {
  const url = new URL(req.url)
  const href = url.searchParams.get('searchQuery')

  if (!href) {
    return new Response('Invalid href', { status: 400 })
  }

  try {
    const browserInstance = await browserPromise

    const urls = await scrapeGoogle(href, browserInstance)

    if (urls.length === 0) {
      return new Response('Not found', { status: 404 })
    }

    // Use pMap to control the concurrency of screenshot generation
    const fileNames = await pMap(urls, (url) => takeScreenshot(url, browserInstance), {
      concurrency: 10,
    }) // Adjust concurrency as necessary

    const urlsInfo = urls.map((url, index) => ({ fileName: fileNames[index], url }))

    return NextResponse.json({ message: 'success', files: urlsInfo }, { status: 200 })
  } catch (error) {
    console.error('Error:', (error as Error).message)
    return new Response('An error occurred', { status: 500 })
  }
}

async function takeScreenshot(url: string, browserInstance: Browser): Promise<string> {
  try {
    const iPhone = devices['iPhone X']
    const page = await createPage(browserInstance, iPhone)

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 })

    const screenshotBuffer = await page.screenshot({ fullPage: false, type: 'webp' })
    await page.close()

    const screenshotBase64 = screenshotBuffer.toString('base64')
    console.log('takeScreenshot finished')
    return screenshotBase64
  } catch (error) {
    console.error(`Error taking screenshot of ${url}:`, (error as Error).message)
    return '' // return an empty string or some placeholder
  }
}

async function createPage(
  browserInstance: Browser,
  device: puppeteer.DeviceDescriptor,
): Promise<Page> {
  try {
    const page = await browserInstance.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.emulate(device)
    return page
  } catch (error) {
    console.error('Error creating page:', (error as Error).message)
    throw error
  }
}

async function scrapeGoogle(searchQuery: string, browserInstance: Browser): Promise<string[]> {
  try {
    const page = await createPage(browserInstance, devices['iPhone X'])

    await page.goto(`https://www.google.com/search?q=${encodeURI(searchQuery)}`)

    const searchResults = await page.$$eval('.v5yQqb > a', (links) =>
      links.map((link) => link.href),
    )
    console.log('scrapeGoogle finished')
    return searchResults.slice(0, 10)
  } catch (error) {
    console.error('Error scraping Google:', (error as Error).message)
    throw error
  }
}

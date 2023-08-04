import { NextResponse } from 'next/server'
import puppeteer, { Browser } from 'puppeteer'
const devices = require('puppeteer').devices

// Share one browser instance
let browserInstance: Browser | null = null

export async function GET(req: Request) {
  const url = new URL(req.url)
  const href = url.searchParams.get('searchQuery')

  if (!href) {
    return new Response('Invalid href', { status: 400 })
  }

  try {
    const urls = await scrapeGoogle(href)

    if (urls.length === 0) {
      return new Response('Not found', { status: 404 })
    }

    let fileNames = []
    let urlsInfo = []
    for (let url of urls) {
      const fileName = await takeScreenshot(url)
      fileNames.push(fileName)
      urlsInfo.push({ fileName, url })
    }

    return NextResponse.json({ message: 'success', files: urlsInfo }, { status: 200 })
  } catch (error) {
    console.error('Error:', (error as Error).message)
    return new Response('An error occurred', { status: 500 })
  }
}

async function takeScreenshot(url: string) {
  try {
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({ headless: 'new' })
    }

    const iPhone = devices['iPhone X']
    const page = await browserInstance.newPage()
    page.setDefaultNavigationTimeout(120000)
    await page.emulate(iPhone)
    await page.goto(url, { waitUntil: 'load', timeout: 120000 })

    const screenshotBuffer = await page.screenshot({ fullPage: true })
    await page.close()

    const screenshotBase64 = screenshotBuffer.toString('base64')
    return screenshotBase64
  } catch (error) {
    console.error('Error taking screenshot:', (error as Error).message)
    throw error
  }
}

async function scrapeGoogle(searchQuery: string) {
  try {
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({ headless: 'new' })
    }

    const page = await browserInstance.newPage()
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    const viewport = { width: 375, height: 812 }
    await page.setUserAgent(userAgent)
    await page.setViewport(viewport)

    await page.goto(`https://www.google.com/search?q=${encodeURI(searchQuery)}`)

    let searchResults = await page.$$eval('.v5yQqb > a', (links) => links.map((link) => link.href))

    searchResults = searchResults.slice(0, 2)
    return searchResults
  } catch (error) {
    console.error('Error scraping Google:', (error as Error).message)
    throw error
  }
}

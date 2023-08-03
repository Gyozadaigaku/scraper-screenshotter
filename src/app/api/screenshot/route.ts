import puppeteer from "puppeteer";
const devices = require("puppeteer").devices;
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("searchQuery");

  if (!href) {
    return new Response("Invalid href", { status: 400 });
  }

  const urls = await scrapeGoogle(href);

  // take screenshot of the urls
  let fileNames = [];
  let urlsInfo = [];
  for (let url of urls) {
    const fileName = await takeScreenshot(url);
    fileNames.push(fileName);
    urlsInfo.push({ fileName, url });
  }

  return NextResponse.json(
    { message: "success", files: urlsInfo },
    { status: 200 }
  );
}

async function takeScreenshot(url) {
  const iPhone = devices["iPhone X"];
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto(url, { waitUntil: "load", timeout: 0 });

  // Take a screenshot and get it as a Buffer
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  await browser.close();

  // Convert the Buffer to a base64 string
  const screenshotBase64 = screenshotBuffer.toString("base64");

  return screenshotBase64;
}

async function scrapeGoogle(searchQuery) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const userAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
  const viewport = { width: 375, height: 812 };
  await page.setUserAgent(userAgent);
  await page.setViewport(viewport);

  await page.goto(`https://www.google.com/search?q=${encodeURI(searchQuery)}`);

  let searchResults = await page.$$eval(".v5yQqb > a", (links) =>
    links.map((link) => {
      const url = link.href;
      // const hashIndex = url.indexOf("#");
      // if (hashIndex > -1) {
      //   return url.slice(0, hashIndex);
      // }
      return url;
    })
  );

  searchResults = searchResults.slice(0, 2); // Limit the number of URLs retrieved

  await browser.close();

  return searchResults;
}

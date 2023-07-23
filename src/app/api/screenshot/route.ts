import puppeteer from "puppeteer";
// import devices from "puppeteer/DeviceDescriptors";
const devices = require("puppeteer").devices;
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const imgDirectory = "./public/img"; // store images in Next.js public directory

export async function GET(req: Request) {
  clearDirectory(imgDirectory);
  console.log("aaaaaa");
  const url = new URL(req.url);
  console.log(url);
  const href = url.searchParams.get("searchQuery");
  console.log("bbbbb");
  console.log(href);

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
  // res.status(200).json({ success: true });
}

function clearDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

async function takeScreenshot(url) {
  // const devices = puppeteer.devices;
  const iPhone = devices["iPhone X"];
  // const iPhone = puppeteer.devices["iPhone X"];
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  // await page.goto(url, { timeout: 120000 });
  // await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.goto(url, { waitUntil: "load", timeout: 0 });

  const safeFileName = url.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const screenshotPath = path.join(imgDirectory, `${safeFileName}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  return `${safeFileName}.png`; // Return the filename
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

  let searchResults = await page.$$eval(".yuRUbf > a", (links) =>
    links.map((link) => {
      const url = link.href;
      const hashIndex = url.indexOf("#");
      if (hashIndex > -1) {
        return url.slice(0, hashIndex);
      }
      return url;
    })
  );

  searchResults = searchResults.slice(0, 2); // Limit the number of URLs retrieved

  await browser.close();

  return searchResults;
}

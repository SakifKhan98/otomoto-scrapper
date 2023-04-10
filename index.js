const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto(
    "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc"
  );
  await page.waitForSelector("#onetrust-button-group");
  await page.click("#onetrust-accept-btn-handler");

  // const allListings = [];

  // const allAdsLink = await page.$$eval(
  //   "article[data-testid='listing-ad'] > div > h2 > a",
  //   (ads) => ads.map((ad) => ad.href)
  // );
  // const allAdsId = await page.$$eval(
  //   "article[data-testid='listing-ad']",
  //   (ads) => ads.map((ad) => ad.id)
  // );
  getTotalAdsCount(page);
  // addItems(page);

  // console.log(courses);
  // ads.map((ad) => ad.id)
  // await page.waitForSelector("#page-header > div > div.ooa-s5xdrg > div", {
  //   waitUntil: "domcontentloaded",
  // });
  // await page.waitForNavigation({ waitUntil: "networkidle2" });

  // await page.screenshot({ path: "otomoto.png" });
  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  });

  const $ = cheerio.load(pageData.html);
  // const element = $("link");
  // console.log(allAdsLink);
  // console.log(adListings);
  // await browser.close();
})();

const addItems = async (page) => {
  await page.$$eval("article[data-testid='listing-ad']", (elements) =>
    elements.map((e) => ({
      url: e.querySelector("h2[data-testid='ad-title'] a").href,
      itemId: e.id,
    }))
  );
};

const getTotalAdsCount = async (page) => {
  return await page.$$eval(
    "article[data-testid='listing-ad']",
    (ads) => ads.length
  );
};

const getNextPageUrl = async (page) => {
  while (
    await page.$(
      "ul.pagination-list > li[title='Next Page'][aria-disabled='false']"
    )
  ) {
    await page.waitForSelector("ul.pagination-list > li[title='Next Page']", {
      waitUntil: "domcontentloaded",
    });
    await page.click("ul.pagination-list > li[title='Next Page']");
  }
};

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
let fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto(
    "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc",
    { timeout: 8000 }
  );
  await page.waitForSelector("#onetrust-button-group");
  await page.click("#onetrust-accept-btn-handler");

  /** Code for using the Single Scrapper Function to scrap single items **/
  const allAdsLinks = await page.$$eval(
    "article[data-testid='listing-ad'] > div > h2 > a",
    (ads) => ads.map((ad) => ad.href)
  );

  const scrapedData = [];
  try {
    for (let link of allAdsLinks) {
      const data = await scrapeTruckItem(link);
      scrapedData.push(data);
    }
  } catch (error) {
    console.log(error);
  }

  /** Code for exporting data to Excel Sheet **/
  const ab = xlsx.utils.book_new();
  const as = xlsx.utils.json_to_sheet(scrapedData);
  xlsx.utils.book_append_sheet(ab, as);
  xlsx.writeFile(ab, "truckItems.xlsx");

  /** Code for usecase of addItems function **/
  const listItems = await addItems(page);
  let json = JSON.stringify(listItems);
  let rand = Math.floor(Math.random() * 1001);
  // code for exporting data to a json file
  fs.writeFile(`listItems_${rand}.json`, json, "utf8", (err) => {
    if (err) throw err;
    console.log("JSON Exporting Completed!");
  });

  /** Code for usecase of getTotalAdsCount function **/
  const adsAvailable = await getTotalAdsCount(page);

  /** Code for usecase of getNextPageUrl function **/
  await getNextPageUrl(page);

  /** Console logs are for checking the  **/
  // console.log(adsAvailable);
  // console.log(listItems);
  // await browser.close();
})();

/** addItems function will go through the loaded page and scrap all the ad listings url along with their distinct itemid **/

const addItems = async (page) => {
  return await page.$$eval("article[data-testid='listing-ad']", (elements) =>
    elements.map((e) => ({
      url: e.querySelector("h2[data-testid='ad-title'] a").href,
      itemId: e.id,
    }))
  );
};

/** getTotalAdsCount returns the total number of ad-listing present in the loaded page **/

const getTotalAdsCount = async (page) => {
  return await page.$$eval(
    "article[data-testid='listing-ad']",
    (ads) => ads.length
  );
};

/** scrapeTruckItem returns the itemId, title, price, registrationDate, productionDate, mileage & power from the page of single loaded ad **/

const scrapeTruckItem = async (url) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto(url, { timeout: 8000 });

  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });
  const $ = cheerio.load(pageData.html);

  const getNextSiblingData = (parentElement, parentElementValue) => {
    return $(parentElement)
      .filter(function () {
        return $(this).text().trim() === parentElementValue;
      })
      .next()
      .text()
      .replace(/\s\s+/g, " ");
  };

  const truckItemDetails = {
    itemId: $("#ad_id").text(),
    title: $("span.offer-title").text().replace(/\s\s+/g, " "),
    price: $(".offer-price").attr("data-price"),
    registrationDate: getNextSiblingData(
      "span",
      "Data pierwszej rejestracji w historii pojazdu"
    ),
    productionDate: getNextSiblingData("span", "Rok produkcji"),
    mileage: getNextSiblingData("span", "Przebieg"),
    power: getNextSiblingData("span", "Moc"),
  };

  await browser.close();

  return truckItemDetails;
};

/** getNextPageUrl navigates to the next page **/

const getNextPageUrl = async (page) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};

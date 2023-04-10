# Project Title

Otomot Scrapper

---

## Project Description

---

This is a basic implementation of a scrapper which will scrap primarily starting from the following url:

https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc

It will use Puppeteer for handling events in the browser level and cheerio for parsing HTML output in some cases to extract desired data.

---

## Requirements

For development, you will only need Node.js and a node global package, NPM, installed in your environement.

External packages used:

    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^19.8.5",
    "xlsx": "^0.18.5"

---

## Install

    $ git clone https://github.com/SakifKhan98/otomoto-scrapper.git
    $ cd otomot-scrapper
    $ npm install

## Running the project

    $ node index.js

## Function Description:

<br/><br/>

> ### addItems (page) -->
>
> It fetches item urls + item ids (unique ids that the portal uses) from list page.

> ### getTotalAdsCount (page) -->
>
> Shows how many total ads exist for the provided initial url

> ### scrapeTruckItem (page) -->
>
> It scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power.

> ### getNextPageUrl (page) -->
>
> It navigate to the next page. It has some sort of bug because of the behaviour of the page loading.

<br/><br/>

## Following are thoughts or questions/answers:

1. Used Try-Catch block wehre seemed necessary. Can use it in more places to making the error handling process smoother. Also used bulting timeout parameter when loading page to avoid long delay and other errors.

2. I was not 100% sure about what was meant by "Accessing more ads from this link than the limit allows (max 50 pages)?". But I think we can replicate the API call format used by otomoto to access more data then we are allowed to access.

3. CI/CD with github is set.

4. I've researched a bit and found that we can use mitm proxy tool for scrapping mobile applications (like otomot) but not 100% sure how to do that. But can give that a try later if needed.

5. The performance can be improved by adding some waiting function. (like waitForUntil and its various values)

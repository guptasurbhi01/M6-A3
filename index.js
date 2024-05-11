const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const fs = require("node:fs");

const pageUrl =
  "https://www.amazon.in/s?k=mobile+phones&crid=3P3KGSJE5GDO6&sprefix=mobile+phones%2Caps%2C377&ref=nb_sb_noss_1";

const headers = {
  "content-type": "text/html",
};

const getWebPageData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers,
    });
    const strData = response.data;
    fs.writeFileSync("webpagedata.txt", strData);
  } catch (err) {
    console.log("ERROR_OCCURED", err);
  }
};


const getDataFromFile = () => {
  return fs.readFileSync("webpagedata.txt", { encoding: "utf-8" });
};

const pageHtmlString = getDataFromFile();

const $ = cheerio.load(pageHtmlString);
const products = [];
const productCards = $("div[data-asin]")
  .find("span.a-size-medium.a-color-base.a-text-normal")
  .each((index, element) => {
    products.push({
      name: $(element).text(), 
    });
  });

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(products);

xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
xlsx.writeFile(workbook, "products.xlsx");

# Apify Tutorial II



## Quiz answers
<!-- toc start -->
- Where and how can you use JQuery with the SDK?
  - Did not see JQuery usage only Cheerio in CheerioCrawler
- What is the main difference between Cheerio and JQuery?
  - JQuery working directly with browser
  - Cheerio sending HTTP requests and working with response HTML
- When would you use CheerioCrawler and what are its limitations?
  - I would use Cheerio to find specific  elements and extract their data
  - Limitations
    - Does not work for all websites
    - May easily overload the target website with requests
    - Does not enable any manipulation of the website before scraping
- What are the main classes for managing requests and when and why would you use one instead of another?
  - Main classes : CheerioCrawler , PuppeteerCrawler , BasicCrawler ,PlaywrightCrawler
  - BasicCrawler : is crawler without features i would use it for specific tasks where i need to implement the crawling logic
  - CheerioCrawler : i would use for scraping data from simple websites cause it can do it faster than other crawlers
  - PuppeteerCrawler : i would use for scrape websites that require to execute JavaScript
  - PlaywrightCrawler : its logic is the same as PuppeteerCrawler , i would use if i need to work with headless Firefox and Webkit browsers cause PuppeteerCrawler only works with headless Chromium
- How can you extract data from a page in Puppeteer without using JQuery?
  - By using Page instance
 <!-- toc end -->




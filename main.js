/**
 * This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

const Apify = require('apify');
const { handleStart, handleOffers, handleProduct } = require('./src/routes');

const { utils: { log } } = Apify;

Apify.main(async () => {

    const requestQueue = await Apify.openRequestQueue();
    const input = await Apify.getInput();
    await requestQueue.addRequest({ url : `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${input.keyword}` ,
        userData : {label : 'START'}} );

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchContext: {
            // Chrome with stealth should work for most websites.
            // If it doesn't, feel free to remove this.
            useChrome: true,
            stealth: true,
        },
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request;
            log.info('Page opened.', { label, url });
            switch (label) {
                case 'START':
                    return handleStart(context , requestQueue);
                case 'OFFERS':
                    return handleOffers(context , requestQueue);
                case 'PRODUCT':
                    return handleProduct(context , requestQueue)

            }
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');
});

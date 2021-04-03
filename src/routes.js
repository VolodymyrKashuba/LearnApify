const Apify = require('apify');

const { utils: { log } } = Apify;
exports.handleStart = async (context , requestQueue) => {
    const { page} = context;
    let ASINs = await page.$$eval('div.s-asin' , asin => {
        return asin.map(asin => asin.getAttribute("data-asin"))
    })
    for await (const asin of ASINs){
        await requestQueue.addRequest({url: `https://www.amazon.com/dp/${asin}`, userData : {label : 'PRODUCT'}});
    }
};

exports.handleProduct = async (context , requestQueue) => {
    const {request , page} = context;

    log.info(`Start point collecting data and enqueue links`);
    await page.waitForSelector('body');
    if(await page.$('#productTitle')){
        const asin = request.url.split('/').pop()
        console.log(asin)
        let title = await page.evaluate(() => {
            return document.querySelector('#productTitle').innerText
        })

        title = title.replace(/\n/g , '')
        console.log(title)
        let description = [];
        const descriptionArray = await page.$$eval('ul.a-unordered-list.a-vertical.a-spacing-mini > li > span.a-list-item' , span => {
            return span.map(element => element.textContent)
        })
        descriptionArray.forEach(el => {
            description.push(el.replace(/\n/g , ''));
        });
        const offersUrl = `https://www.amazon.com/gp/offer-listing/${asin}`;

        await requestQueue.addRequest({url: offersUrl , userData:{
                label : 'OFFERS',
                data: {
                    url : request.url,
                    title : title,
                    description : description.join('\n')
                }
            }} , {forefront : false});
    }
};

exports.handleOffers = async (context , requestQueue) => {
    const {request , page} = context;

    log.info('Crawling offers pages')
    let formatedData;
    await page.waitForSelector('#aod-offer-list');
    console.log(request.url)
    if(await page.$('#aod-offer')){
        const data = await page.$$eval('#aod-offer' , element => {


            const scrapedData = [];
            element.forEach(el => {
                let price = el.querySelector('div#aod-offer span.a-price > .a-offscreen').innerText;
                let sellerName = el.querySelector('.a-col-right > a.a-link-normal').innerText;
                let shippingPrice = '';
                if(!(el.querySelector('#delivery-message .a-color-error'))){
                    shippingPrice = el.querySelector('.a-size-base > .a-color-secondary.a-size-base').innerText;
                }


                scrapedData.push({
                    price: price,
                    sellerName: sellerName,
                    shippingPrice : shippingPrice

                });
            });
            return scrapedData;
        });
        if(data.length > 0){
            formatedData = data.map(el => {
                return Object.assign({} ,request.userData.data, el )
            })
            await Apify.pushData(formatedData);
        }else {
            await Apify.pushData(Object.assign({} , request.userData.data , {orderInfo : 'not exist'}))
        }

        console.log(data)
    }

};



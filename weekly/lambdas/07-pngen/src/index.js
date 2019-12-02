const chromium = require('chrome-aws-lambda');
const aws = require("aws-sdk");
const fs = require("fs");

const { uploadScreenshot } = require("./uploadScreenshot");

const dir = '/tmp/s3/';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

exports.handler = async (event, context) => {
    let browser = null;
    
    const s3 = new aws.S3({
        apiVersion: "2006-03-01"
    });
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    async function readFileS3(file, key){
        return new Promise((resolve, reject) => {
            let params = {Bucket: event.bucket, Key: key};
            s3.getObject(params).createReadStream()
            .on('end', () => { 
                return resolve(); 
            })
            .on('error', (error) => { 
                return reject(error); 
            })
            .pipe(file)
        });
    };

    // await readFileS3(fs.createWriteStream('/tmp/s3/datasets.js'), event.task.dataset_key);
    // await readFileS3(fs.createWriteStream('/tmp/s3/mapConfig.js'), event.task.config_key);
    // await readFileS3(fs.createWriteStream('/tmp/s3/kepler.html'), event.task.KeplerHTML);

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
        
        let page = await browser.newPage();
        await page.setViewport({
            // width: 1382,
            // height: 744
            width: 1100,
            height: 750
          });
        await page.goto('file:///tmp/s3/kepler.html', {
            waitUntil: ["domcontentloaded", "networkidle2"]
        });        
        if (event.city == "São Paulo") {            
            await sleep(10000);
        }
        await sleep(10000);        
        const path = '/tmp/s3/example1.png'
        await page.screenshot({path: path});

        // await uploadScreenshot(path, event.bucket, event.task.png_key);

    } catch (error) {
        return context.fail(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
    
    return context.succeed();
};
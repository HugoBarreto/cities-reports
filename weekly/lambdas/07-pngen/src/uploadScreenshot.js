const aws = require("aws-sdk");
const fs = require("fs");

// Your S3 bucket from earlier. Make sure you use the same name
const BUCKET = "techletter.app";

// uploadScreenshot takes a temporary file path and returns a URL
exports.uploadScreenshot = async function uploadScreenshot(
    path,
    bucket,
    png_key
    ) {
    // aws-sdk is all callback-based so we have to wrap in Promises, yuck
    return new Promise((resolve, reject) => {
        const s3 = new aws.S3({
            apiVersion: "2006-03-01"
        });

        (async function() {
            const buffer = await new Promise((resolve, reject) => {
                // reading the file
                fs.readFile(path, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });

            // uploading the file buffer
            const { Location } = await s3
                .upload({
                    Bucket: bucket,
                    Key: png_key,
                    Body: buffer                    
                })
                .promise();

            resolve(Location);
        })();
    });
};
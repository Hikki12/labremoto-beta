const fs = require('fs');
const path = require('path');


const getVideosList = (mockupID, callback) => {
    const rootPath = path.join(__dirname, "..", "uploads", mockupID);
    const videosFolder = path.join(rootPath, "videos");
    console.log("videosFolder:", videosFolder);
    fs.readdir(videosFolder, (err, files) => {
        if(callback){
            if(err){
                return callback(err);
            }
            callback(rootPath, files);
        }
    });
}
module.exports = getVideosList;

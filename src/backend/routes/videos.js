const getVideosList = require('../scripts/videos-manager');
const express = require('express');     
const router = new express.Router();
const fs = require('fs');
const path = require('path');

/**
 * @endpoint : /list/videos/:mockupname
 * @method : GET 
**/
router.get("/list/videos/:mockupname", (req, res) => {
    var mockupName = req.params.mockupname;
    console.log("Mockup id : ", mockupName);

    getVideosList(mockupName, (rootPath, files) => {
        console.log("Path: ", rootPath);
        console.log("Files: ", files );
        res.status(200).send(files)
    });
    //res.end();
});

/**
 * @endpoint : /stream/video/:mockupname/:filename
 * @method : GET 
**/

router.get("/stream/video/:mockupname/:filename", (req, res) => {
    var mockupName = req.params.mockupname;
    var videoName = req.params.filename;
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    const rootPath = path.join(__dirname, "..", "uploads", mockupName);
    const videosFolder = path.join(rootPath, "videos");
    const videoPath = path.join(videosFolder, videoName);

    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);    
    // console.log("Video size: ", videoSize);

    // console.log("*** Video para streaming solicitado ***");
    // console.log(mockupName, videoName);

});


/**
 * @endpoint : /upload-video:name
 * @method : GET 
**/

router.post('/upload-video/:mockuname', async (req,res) => {
    console.log("A video was uploaded by: ");
    res.end();
});

/**
 * @endpoint : /download-video/:mockupname/:filename
 * @method : GET 
**/
router.get('/download-video/:mockupname/:filename', (req, res) => {
    console.log("end video");
    res.end();
})

module.exports = router;
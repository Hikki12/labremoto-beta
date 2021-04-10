const getVideosList = require('../scripts/videos-manager');
const express = require('express');     
const router = new express.Router();
const fs = require('fs');
const path = require('path');

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const field = file.fieldname;
      const filename = file.originalname;
      const rootPath = path.join(__dirname, "..", "uploads");
      const mockupname = req.params.mockupname;
      const rootVideo = path.join(rootPath, mockupname, "videos");
      const rootFiles = path.join(rootPath, mockupname, "files");
  
      if(field === "video"){
            cb(null, rootVideo);
      }
      if(field === "file"){
            cb(null, rootFiles);
      }
      
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
   
  var upload = multer({ storage: storage })
/**
 * @endpoint : /list/videos/:mockupname
 * @method : GET 
**/
router.get("/list/videos/:mockupname", (req, res) => {
    var mockupName = req.params.mockupname;
    console.log("Mockup id : ", mockupName);

    getVideosList(mockupName, (rootPath, files) => {
        if(files){
            res.status(200).send(files);
        }else{
            res.status(200).send([])
        }
        
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
});


/**
 * @endpoint : /upload-video:name
 * @method : GET 
**/

router.post('/upload-video/:mockuname', (req,res) => {
    console.log("A video was uploaded by: ");
    res.end();
});

/**
 * @endpoint : /download-video/:mockupname/:filename
 * @method : GET 
**/
router.get('/download-video/:mockupname/:filename', (req, res) => {
    const rootPath = path.join(__dirname, "..", "uploads");
    const filename = req.params.filename;
    const mockupname = req.params.mockupname;
    const filePath = path.join(rootPath, mockupname,"videos",filename);
    console.log("Downloading: ",filename );
    fs.access(filePath, (err)=>{
        if(!err){
            res.download(filePath, filename);
        }else{
            res.end();
            //console.log("File doesn't exist");
        }
    });
    
});


/**
 * @endpoint : /download-file/:mockupname/:filename
 * @method : GET 
**/
router.get('/download-file/:mockupname/:filename', (req, res) => {
    const rootPath = path.join(__dirname, "..", "uploads");
    const videoname = req.params.filename;
    const filename = videoname.substring(0, videoname.length - 4) + ".xlsx";
    const mockupname = req.params.mockupname;
    const filePath = path.join(rootPath, mockupname, "files", filename);
    console.log("Downloading: ",filename );
    fs.access(filePath, (err)=>{
        if(!err){
            res.download(filePath, filename);
        }else{
            res.end();
        }
    });
    
});


/**
 * @endpoint : /delete-video/:mockupname/:filename
 * @method : DELETE
**/

router.delete('/delete-video/:mockupname/:filename', (req, res) => {
    const rootPath = path.join(__dirname, "..", "uploads");
    const videoname = req.params.filename;
    const mockupname = req.params.mockupname;
    const filename = videoname.substring(0, videoname.length - 4) + ".xlsx";
    const rootVideo = path.join(rootPath, mockupname, "videos");
    const rootFiles = path.join(rootPath, mockupname, "files");
    const videoPath = path.join(rootVideo, videoname);
    const filePath = path.join(rootFiles, filename);
    console.log("video path: ", videoPath);
    console.log("file path: ", filePath);


    fs.unlink(filePath, (error) => {
        if(error){
            console.log("error file");
        }
    });

    fs.unlink(videoPath, (error) => {
        if(error){
            console.log("error video");
            res.end();
        }else{
            res.end();
        }
    });
});

/* 
 * @endpoint : /upload/:mockupname/:filename
 * @method : DELETE
*/

router.post('/upload/:mockupname', upload.any(), (req, res, next) =>{
    res.end();
});

module.exports = router;
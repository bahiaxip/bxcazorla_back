"use strict"

const express = require("express");
const CardRentController = require("../controllers/cardrent");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest:'./uploads/'})
var fs = require("fs");
const storage = multer.diskStorage({
   destination: function(req,file,cb){
   		let path = './uploads/'+req.params.id;
   		//si no añadimos el siguiente condicional genera una imagen 
   		//corrupta si son varias imágenes 
   		if(!fs.existsSync(path)){
   			fs.mkdirSync(path);	
   		}
        cb(null,path);
        //console.log("desde route: ",file)
   },
   filename: function(req,file,cb){
           const randomname=Math.random().toString(20).slice(2);
           const ext = file.originalname.split('\.')[1];
           cb(null,randomname+'.'+ext);
   }
})
const md_upload=multer({storage:storage});
router.get("/cardrents",CardRentController.getCards);
router.post("/cardrent",CardRentController.saveCardRent);
router.post("/images/:id",md_upload.array("files"),CardRentController.uploadImages);
router.get("/images/:id",CardRentController.getImagesById);
router.delete("/cardrents",CardRentController.deleteCardRents);
router.delete("/images",CardRentController.deleteImagesCardRent);
router.delete("/image/:id",CardRentController.deleteCardRentById);
module.exports = router;
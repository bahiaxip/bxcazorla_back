"use strict"
var CardRent = require('../models/cardrent');
var PriceRent=require('../models/pricerent');
var ImageCardRent = require("../models/image");
var Feedbackrent = require("../models/feedbackrent");
var path = require("path");
var fs = require("fs")
var controller = {
	hola:(req,res) => {
		
		return res.status(200).send({message: "hola"})
	},
	saveCardRent:(req,res) => {
		console.log("llega al saveCardRent")		
		var params = req.body;
		//el boolean req._body permite saber si existe objecto body (de bodyParser)
		if(req._body){
			console.log(req._body)	
		}
		
		if(!params || !params.title || !params.capacity || !params.type || !params.phone) 
			return res.status(200).send({message: "Faltan datos",status:"error"});
		var cardrent = new CardRent();		
		cardrent.title=params.title;
		if(params.title){
			//validar string
			let data=checkString(params.title);			
		}
		//para las pruebas en postman generar un array mediante repetición del parámetro
		if(Array.isArray(params.capacity)){			
			cardrent.capacity=params.capacity;
		}
		//tarifas
		//if(params.capacities.length>0){
			/*
			let pricesByCapacity=params.capacities;					
			let list=[];
			let counter=0;
			params.capacities.map((param)=> {
				console.log(counter)
				console.log(param)
				list.push({
					capacity:2,
					type:"casa",
					minNights:2,
					priceBase:2,
					priceNight:2
					})
				counter++;
			})
			console.log("list: ",list)

			cardrent.capacities=list;
			*/
			//console.log("capacities: ",params.capacities)
			cardrent.capacities=params.capacities;
			
		//}
		//pricerent.minNight = params.capacity[0];
		/*
		params.pricerents.maps((num)=> {
			var pricerent=new PriceRent();
			pricerent.capacity=params.capacity;
			if(params.type.length==1){
				pricerent.type=params.type;	
			}else{

			}
			
			//pricerent.minNight=
		})
		*/
		//console.log("params:",params);
	//minNights
		if(params.capacities && params.capacities.length>0){
			//lista minNights: array de capacidades de todas las tarifas			
			let listMinNights=[],listMinCapacity=[];
			params.capacities.forEach((rate)=>{
				listMinNights.push(rate.capacity);				
			})
			//smallerMinNights: el número menor de la lista (listMinNights)
			let smallerMinNights=Math.min(...listMinNights);
			//por si hubiera 2 con la misma capacidad mínima utilizamos
			//el método find para obtener el primero y no más
			//firstMinRate es el objeto de menor capacidad que servirá para
			//mostrar por defecto
			let firstMinRate=params.capacities.find(rate => rate.capacity==smallerMinNights);

			

			cardrent.minNights=firstMinRate.minNights;
			cardrent.minPrice=firstMinRate.priceBase;
			cardrent.minCapacity=firstMinRate.capacity;
		}else{
			cardrent.minPrice=null;
			cardrent.minNights=null;
			cardrent.minCapacity=null;
		}
	//si images contiene algo quiere decir que es uno de los registros de alojamientos
	//que tenemos creados por defecto en cardrentdata(frontend), con sus imágenes
	//correspondientes alojadas en assets/images/... (frontend) y sus correspondientes 
	//feedbacks en feedbackrentdata (frontend), esto nos permite limpiar y recargar la db
	//mediante el método fillDB() que se encuentra en el servicio (cardrent.service).

//Para asignar la ruta correcta, ya que las imágenes de los registros por defecto
//son diferentesde las imágenes alojadas en el server establecemos a las que son por defecto
//el valor original en el campo image y a las del server no asignamos nada
		if(params.images && params.images.length>0)
			cardrent.image="original";
		else
			cardrent.image=null;

		cardrent.images=params.images;
		cardrent.logo=null;
		cardrent.selectedImage=null;		
		cardrent.thumbnail=null;
		if(Array.isArray(params.type)){
			cardrent.type=params.type;
		}
		cardrent.services=params.services;
		cardrent.web=params.web;
		cardrent.phone=params.phone;
		cardrent.numLevelFeedback=0;
		if(params.numLevelLocation)
			cardrent.numLevelLocation=params.numLevelLocation;
		else
			cardrent.numLevelLocation=null;
		cardrent.maps=params.maps;
		cardrent.text=params.text
		cardrent.save((err,cardrentStored)=> {
			if(err) return res.status({message: "Error al crear cardrent"})
			if(!cardrent) return res.status(200).send({message: "No se ha podido crear cardrent"})
				
			if(cardrentStored){

		//imágenes de migraciones
				//Activando el método fillDB() del frontend generamos algo similar a una migración,
				//pasando el array de objetos incluido en el archivo cardrentdata.ts del frontend.
				//De esa forma generamos un conjunto de documentos en las distintas colecciones
				//(cardrent, image, pricerent, feedbackrent), esto se hace activando solo la 
				//primera vez el método fillDB(), método comentado en el archivo card-content.component
				//así, aunque se editen o se eliminen siempre podemos volver a vaciar la db y
				//disponer de un conjunto de alojamientos, la diferencia es que las imágenes 
				//vienen incluidas en el array images y las imágenes deben estar almacenadas en
				//el directorio assets/... del frontend. Para ello comprobamos si el array imágenes
				//no viene vacío y en ese caso crear un documento ImageCardRent por cada elemento del array
				console.log("params: ",params)
				if(params.images && params.images.length>0){
					console.log("existen images")
					let imas=params.images;
					console.log("las imágenes: ",params.images)
					imas.map((ima)=>{
						let imagecardrent = new ImageCardRent();
						let splitname=path.basename(ima).split('\.');
						let dirname=path.dirname(ima);
						console.log("split: ",splitname) 
						console.log("dirname: ",dirname);
						imagecardrent.name=path.basename(ima);
						imagecardrent.originalName=path.basename(ima);
						imagecardrent.path='assets/images/'+dirname+'/';				
						imagecardrent.ext=splitname[1];
						imagecardrent.rentId=cardrentStored._id;
						imagecardrent.save((err, imaStored) => {
							if(err) return res.status(500).send({message: "hubo un error al guardar la imagen"})

						})
						
					})
				}
				


				//cardrent.capacities=params.capacities
				//anulamos crear una db con los precios y los mantenemos 
				//en el mismo array "capacities"
				/*
				let data=params.capacities;
				
				data.map((cap)=> {
					var pricerent=new PriceRent();					
					pricerent.capacity=cap.capacity;
					pricerent.services=cap.services;
					pricerent.type=cap.subtype;
					pricerent.minNights=cap.minNights;
					pricerent.priceBase=cap.priceBase;
					pricerent.priceNight=cap.priceNight;
					pricerent.rentId=cardrentStored._id;
					pricerent.save((err,pricerentStored) => {
						if(err) return res.status(200).send({message: "error con tarifas"})
						if(!pricerentStored) return res.status(200).send({message: "No existe"})
							
					})
				})
				*/
				return res.status(200).send({message: "cardrent creado",id:cardrentStored._id})
				/*cardrent.capacities.map((cap)=>{
					
					pricerent.save((err,pricerentStored) => {
						if(err) return res.status(200).send({message: "error con tarifas"})
						if(!pricerentStored) return res.status(200).send({message: "No existe"})
							return res.status(200).send({message: "cardrent creado"})
					})
					
				})
				
				
				

			}
			*/
			}
			//console.log("cardrent: ",data.length)
			console.log("params: ",params)
			
		})
		

	},
	getCard:(req,res) => {

		

	},
	getCards:(req,res) => {
		CardRent.find({},function(err,cardrents){
			if(err) return res.status(200).send({message: "Error al recuperar alojamientos"});
			if(!cardrents) return res.status(200).send({message: "No existe ninguna"})
			return res.status(200).send({cardrents})

		});
	},

	getImages(){
		ImageCardRent.find({},(err,images) => {
			if(err) return res.status(500).send({message: "Hubo un error al obtener todas las imágenes"});
			if(!images) return res.status(404).send({message: "No existen imágenes"})
			return res.status(200).send({
				images
			})
		})
	},

	getImagesById:function(req,res){
		let id;
		if(req.params && req.params.id){
			id=req.params.id
		}
		ImageCardRent.findById(id,(err,images) => {
			if(err) return res.status(500).send({message: "Error obteniendo imágenes"})
			if(!images) return res.status(404).send({message: "No existen imágenes"})
			return res.status(200).send({
				images
			})
		})
	},

	uploadImages:(req,res) => {
		console.log("files: ",req.files);
		
		
		let id;
		let files=[];
		let message="",warningSize="",warningType;

		if(req.params && req.params.id){
			id=req.params.id;
		}else{
			//mensaje de error
			//Si no existe id no es posible asignar la imagen
		}

		var promise = 
		new Promise((res,rej) => {
			req.files.forEach((file,index) => {
				let splitname=path.basename(file.originalname).split('\.');
				//extension
				let ext = splitname[1];
				let type= file.mimetype;
				//validamos la extensión y peso (máximo 2MB) y 
		//1048576bytes=1024Kbytes=1MB
				 
				if(type == "image/jpeg" || type=="image/png" || type=="image/gif"){
					if(file.size < (1048576 * 2)){
						let image = new ImageCardRent();
						image.name=file.filename;
						image.originalName=file.originalname;					
						//image.path=file.destination+'/'+id+'/';
						image.path=file.destination+'/';
						image.ext=ext;
						image.size=file.size;
						image.type=type;
						image.rentId=id;

						image.save((err,imageStored) => {
							console.log("llega al save de imágenes: ",id)
							if(err) return res.status(500).send({message: "Error al guardar imagen"})
							CardRent.findByIdAndUpdate(id,{$push:{"images":file.filename}},(err,cardrent) => {
									console.log("guarda la imagen")		
									if(err) return res.status(500).send({message: "Hubo un error al registrar la imagen almacenada en cardrent"})
										console.log("cardrent: ",cardrent)
									if (index === req.files.length -1) res();
									//cardrent.images.push(file.destination+file.filename);
								})
						})


					}else{
						//establecemos mensaje				
						warningSize="Alguna de las imágenes no ha sido incluida, es superior a 2MB";
						//eliminamos imagen (síncrono)
						controller.removeUploadedFile(file.path);
					}
					
				}else{
					//establecemos mensaje				
					warningType="Alguna de las imágenes no ha sido incluida, no es una imagen válida";
					//eliminamos imagen (síncrono)
					controller.removeUploadedFile(file.path+file.filename);
				}
			})
		})
		
		//mensajes de warning si alguna de las imágenes sobrepasa los 2MB
		//o no es imagen	
		let data={};
		if(req.files.length == 1)
			data.message="La imagen ha sido guardada";			
		else
			data.message="Las imágenes han sido guardadas";
		if(warningSize){
			data.warningSize=warningSize;
		}
		if(warningType){
			data.warningType=warningType;
		}
		promise.then(()=> {
			//return res.status(200).send({message: message});
			return res.status(200).send(data);	
		})
		
	},
	removeUploadedFile:function(file_path){
		fs.unlinkSync(file_path);
	},

	deleteCardRents:(req,res) => {
		CardRent.deleteMany({},(err,cardrents) => {
			if(err) return res.status(500).send({message: "No se pudieron eliminar los alojamientos"})
			if(!cardrents) return res.status(404).send({message: "No existen alojamientos que eliminar"});
			return res.status(200).send({message: "Todos los alojamientos han sido eliminados"})
		})
	},
//necesario eliminar todos los directorios dentro de uploads
	deleteImagesCardRent:(req,res) => {
		//en lugar de listar archivos y eliminarlos, al ser el directorio principal(siempre es uploads) 
		//eliminamos el directorio recursivamente y creamos de nuevo
		fs.rmdir('./uploads',{recursive:true},()=> {
			console.log("eliminando directorio principal")
			fs.mkdirSync("./uploads");
		});

		ImageCardRent.deleteMany({},(err,images) => {
			if(err) return res.status(500).send({message: "No se pudieron eliminar las imágenes"})
			if(!images) return res.status(404).send({message: "No existen imágenes que eliminar"})
			return res.status(200).send({message: "Todas las imágenes han sido eliminadas"})
		})
	},
	//Eliminar CardRent, (test feedbacks and delete, test images and delete, delete cardrent)
	deleteCardRentById:(req,res)=> {
		let id=null;
		if(req.params && req.params.id){
			id=req.params.id;	
		}
		if(id){
			Feedbackrent.deleteMany({"rentId":id})
			.then((data) => {
				console.log( "Todas las valoraciones han sido eliminadas: ",data.deletedCount)
			}).then(()=> {				
				ImageCardRent.find({rentId:id},(err,images) => {
					if(err) return res.status(500).send({message: "Hubo un error eliminado las imágenes"})
					if(!images) return res.status(404).send({message: "No existen imágenes"})
					//console.log("images: ",images)
			//en lugar de utilizar un map y eliminar archivo a archivo,
			//utilizamos el existsSync para comprobar el directorio y
			//el rmdir (recursive:true) para eliminar el directorio con todo su contenido
					if(images[0] && images[0].path && images[0].path.substring(0,14) != "assets/images/"){
						let path_id='./uploads/'+id;
						if(fs.existsSync(path_id))
						fs.rmdir(path_id,{recursive:true},()=> {
							console.log("directorio de imágenes borrado")
						})
					}
					/*
					images.map((image) => {
						//si el directorio es assets/images/ (ruta de imágenes de los cardrent por defecto)
						//no se elimina, el resto se eliminan una a una
						if(image.path.substring(0,14) != "assets/images/"){
							console.log("llega al condicional")
							//eliminamos la última barra (/) del directorio 
							let pathLessLastChar=image.path.substring(0,image.path.length-1);
							console.log(pathLessLastChar)
							console.log(image.path+image.name)
							//en lugar de eliminar archivo por archivo se puede eliminar todo el directorio
							//(fs.rm(path,{options},callback))
							if(fs.existsSync(pathLessLastChar) && fs.existsSync(image.path+image.name)){
								console.log("ha pasado: ",image.path+image.name)
								//fs.unlinkSync(image.path+image.name);
								
								//eliminar directorio completo
								fs.rmdir(pathLessLastChar,{recursive:true},()=> {
									console.log("directorio borrado")
								})
								
							}
						}
					})
					*/
				})
			}).then(()=> {				
				//eliminamos registros de la db de images 
				ImageCardRent.deleteMany({rentId:id});
				//eliminamos registros de la db de cardrent 
				CardRent.findByIdAndDelete(id,(err,deletedCardRent) => {
					if(err) return res.status(500).send({message: "Hubo un error al eliminar el alojamiento"});
					if(!deletedCardRent) return res.status(404).send({message: "No se encontró el alojamiento"});					
					return res.status(200).send({message: "El alojamiento se ha eliminado correctamente"})
				});


			})
			/*
			CardRent.findByIdAndDelete(id,(err,cardrent) => {
				if(err) return status(500).send({message: "Hubo un error  en la eliminación del alojamiento"});
				if(!cardrent) return res.status(404).send({message: "No se encontró el alojamiento"})
				return res.status(200).send({message: "Alojamiento eliminado correctamente"});
			})
			*/	
		}
		
	}

}

function checkString(value){
	return typeof value === 'string' || value instanceof String;
}

module.exports = controller;
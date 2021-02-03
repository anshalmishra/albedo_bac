/* var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/albedo' , {useNewUrlParser: true , useUnifiedTopology: true }); 
var cors = require('cors');
router.all('*',cors());
var bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var multer  = require('multer');
const xlsxFile = require('read-excel-file/node');
var nodemailer = require('nodemailer');
const moment= require('moment');

const store = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null,'Data.xlsx');
    }
});

router.post('/api/importRoles',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
				var newUser = new User({
					User_id: new ObjectID(),
					User_name: col[0],
					Start_Date: col[1],
					End_Date: col[2],
					Created_by: col[3],
					Updated_by: col[4],
					Role_Id: col[5]
				});
				
				newUser.save(function(err, User){
					 if(err)
						res.json({message: 'Error' , status: 1});
				}); 
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'Roles Added' , status: 0});
		}
	})
})

router.post('/api/importOrganization',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
				var newOrganization = new Organization({
					Organization_id: new ObjectID(),
					Organization_Code: col[0],
					Location: col[1],
					Plant: col[2],
					organizationName: col[3],
					department: col[4],
					Shopfloor: col[5]
				});
				
				newOrganization.save(function(err, Organization){
					 if(err)
						res.json({message: 'Error' , status: 1});
				}); 
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'Organization Added' , status: 0});
		}
	})
})

router.post('/api/importInventoryCalendar',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
				var newInventory = new InventoryCalender({
					Inventory_id: new ObjectID(),
					Year: col[0],
					Start_Date: col[1],
					End_Date: col[2],
					Period: col[3],
					P_Start_Date: col[4],
					P_End_Date: col[5],
					Schedule: col[6],
					Shift: col[7],
					scheduleStartDate: col[8],
					scheduleEndDate: col[9]
				});
				
				newInventory.save(function(err, InventoryCalender){
				 if(err)
					res.json({message: 'Error' , status: 1});
				}); 
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'Inventory Calender Added' , status: 0});
		}
	})
})

router.post('/api/importEmployee',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
				var newEmployee = new Employee({
					Employee_id: new ObjectID(),
					employeeCode: col[0],
					First_Name: col[1],
					Last_Name: col[2],
					email_address: col[3],
					Phone: col[4],
					Mobile: col[5],
					supervisorName: col[6],
					Oraganization_Id: col[7]
				});
				
				newEmployee.save(function(err, Employee){
					if(err)
						res.json({message: 'Error' , status: 1});
				});  
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'Employee Added' , status: 0});
		}
	})
})

router.post('/api/importWorkstation',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
				var newWorkStation = new Workstation({
					workstation_id: new ObjectID(),
					Workstation: col[0],
					Machine_Type: col[1],
					Manufacture: col[2],
					ShopFloor: col[3],
					IP_Address: col[4],
					host_name: col[5],
					Description: col[6]
				});
				
				newWorkStation.save(function(err, Workstation){
					if(err)
						res.json({message: 'Error' , status: 1});
				});  
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'Workstation Added' , status: 0});
		}
	})
})

router.post('/api/importReason',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
			var newReason = new Reason({
				Reason_id: new ObjectID(),
				TagCode: col[0],
				TagName: col[1],
				TagColor: col[2],
				TagState: col[3],
				ParentCode: col[4],
				TagLevel: col[5],
				TagCategories: col[6],
				errorDescription: col[7]
			});
				
				newReason.save(function(err, Reason){
					if(err)
						res.json({message: 'Error' , status: 1});
				});  
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'Reason Added' , status: 0});
		}
	})
})

router.post('/api/importItemMaster',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
			var newItemMaster = new ItemMaster({
				Item_id: new ObjectID(),
				Item_Code: col[0],
				Status: col[1],
				Unit: col[2],
				Start_Date: col[3],
				End_Date: col[4],
				Min_Produce_Hr: col[5],
				Max_Produce_Hr: col[6],
				Averag_Produce_Hr: col[7],
				ItemDescription: col[8]
			});
				
				newItemMaster.save(function(err, ItemMaster){
					if(err)
						res.json({message: 'Error' , status: 1});
				});  
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'ItemMaster Added' , status: 0});
		}
	})
})

router.post('/api/importAspJob',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
			var newAspJob = new AspJob({
				Job_id: new ObjectID(),
				job: col[0],
				jobDetails: col[1],
				scheduleStartTime: col[2],
				scheduleEndTime: col[3],
				item: col[4],
				scheduleDownStartTime: col[5],
				scheduleDownEndTime: col[6],
				totalProdue: col[7]
			});
				
				newAspJob.save(function(err, AspJob){
					if(err)
						res.json({message: 'Error' , status: 1});
				});  
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'AspJob Added' , status: 0});
		}
	})
})

router.post('/api/importPrdDtHrs',multer({storage:store}).single('fileKey'), function(req, res, next) {

	var FileInfo = req.body;
	
	
	xlsxFile('./uploads/Data.xlsx').then((rows) => {
		if(rows.length ==0)
			res.json({message: 'No Data' , status: 1});
		
		else{
			rows.forEach((col)=>{
				
			var newPrdDataHr = new PrdDataHr({
				Job_id: new ObjectID(),
				job: col[0],
				date: col[1],
				shift: col[2],
				hours: col[3],
				workstation: col[4],
				operator: col[5],
				supervisor: col[6],
				stCountPerHr: col[7],
				acCountPerHr: col[8],
				speedOfRun: col[9],
				dtCode: col[10],
				dtReason: col[11],
				dtStop: col[12],
				dtMin: col[13],
				noOfStops: col[14],
				sndMail: col[15]
			});
				
				newPrdDataHr.save(function(err, PrdDataHr){
					if(err)
						res.json({message: 'Error' , status: 1});
				});
			})
			fs.unlinkSync('./uploads/Data.xlsx');
			res.json({message: 'PrdDataHr Added' , status: 0});
		}
	})
}) */
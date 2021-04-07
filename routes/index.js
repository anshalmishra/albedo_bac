var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose
  .connect(
    'mongodb+srv://anshal123:atgenx123@albedo.fsemv.mongodb.net/Albedo?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('Database connected');
  });
var cors = require('cors');
router.all('*', cors());
var bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var multer = require('multer');
const xlsxFile = require('read-excel-file/node');
require('dotenv').config();
var nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const moment = require('moment');
const { stringify } = require('querystring');

const store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'Data.xlsx');
  },
});

var userSchema = mongoose.Schema({
  User_id: String,
  Employee_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Employee_number: String,
  User_name: { type: String, unique: true },
  Client: String,
  Creation_date: String,
  Updated_date: String,
  Role_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
  Role_name: String,
  Created_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ALB_User' }],
  Updated_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ALB_User' }],
  Email_Id: { type: String, unique: true },
  Password: String,
  Start_Date: String,
  End_Date: String,
  Organization_id: String,
  status: Number,
  First_Login: Number,

  // Attribute1: String,
  // Attribute2: String,
  // Attribute3: String,
  // Attribute4: String,
  // Attribute5: String,
  // Attribute6: String,
  // Attribute7: String,
  // Attribute8: String,
  // Attribute9: String,
  // Attribute10: String,
});
userSchema.plugin(uniqueValidator, {
  message: 'User name or Email ID already exists',
});
userSchema.pre('save', function (next) {
  // userSchema.plugin(uniqueValidator);

  this.User_id = this._id;
  next();
});

var roleSchema = mongoose.Schema({
  Role_Id: String,
  Role_Name: String,
  Main_menu: String,
  UI_access: String,
  SystemAdmin: Boolean,
  APSMaster: Boolean,
  APSDataScreen: Boolean,
  status: Number,
});
roleSchema.pre('save', function (next) {
  this.Role_Id = this._id;
  next();
});

var organisationSchema = mongoose.Schema({
  Organization_id: String, //nv
  Organization_Code: String,
  Location: String,
  Client: String,
  costCenter: String,
  Plant: String,
  businessUnit: String,
  //organizationName: String,
  Workstation: String, //nv
  //department: String,
  Shopfloor: String,
  status: Number,
});
organisationSchema.pre('save', function (next) {
  this.Organization_id = this._id;
  //this.Workstation = randomString();
  next();
});

var inventoryCalenderSchema = mongoose.Schema({
  Inventory_id: String,
  Inventory_Cal_Name: String,
  Year: Number,
  Start_Date: String,
  End_Date: String,
  Period: String,
  P_Start_Date: String,
  P_End_Date: String,
  Schedule: String,
  Shift: String,
  Shift_Hour: Number,
  status: Number,
});
var employeeSchema = mongoose.Schema({
  Employee_id: String,
  Employee: String,
  First_Name: String,
  Last_Name: String,
  Employee_ref: String,
  email_address: String,
  Role_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
  Phone: String,
  Mobile: String,
  Manager_number: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Oraganization_Id: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  ],
  status: Number,
});
employeeSchema.pre('save', function (next) {
  this.Employee_id = this._id;
  next();
});

var workstationSchema = mongoose.Schema({
  workstation_id: String,
  Workstation: String,
  Machine_Type: String,
  Manufacture: String,
  ShopFloor: String,
  IP_Address: String,
  host_name: String,
  Description: String,
  status: Number,
});
workstationSchema.pre('save', function (next) {
  this.workstation_id = this._id;
  next();
});

var reasonSchema = mongoose.Schema({
  Reason_id: String,
  Reason: String,
  TagCode: String,
  TagName: String,
  TagColor: String,
  TagState: String,
  ParentCode: String,
  TagLevel: String,
  TagCategories: String,
  errorDescription: String,
  status: Number,
});
reasonSchema.pre('save', function (next) {
  this.Reason_id = this._id;
  next();
});

var itemMasterSchema = mongoose.Schema({
  Item_id: String,
  Item_Code: String,
  Unit: String,
  Start_Date: String,
  End_Date: String,
  Min_Produce_Hr: String,
  Max_Produce_Hr: String,
  Averag_Produce_Hr: String,
  ItemDescription: String,
  Organization_id: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  ],
  status: Number,
});
itemMasterSchema.pre('save', function (next) {
  this.Item_id = this._id;
  next();
});

var aspJobSchema = mongoose.Schema({
  job_Id: String,
  job: String,
  jobDetails: String,
  scheduleStartTime: String,
  scheduleEndTime: String,
  item: String,
  scheduleDownStartTime: String,
  scheduleDownEndTime: String,
  totalProdue: String,
  status: Number,
});
var prdDataHrSchema = mongoose.Schema({
  job_Id: String,
  job: String,
  date: String,
  shift: String,
  hours: String,
  workstation: String,
  operator: String,
  supervisor: String,
  stCountPerHr: String,
  acCountPerHr: String,
  speedOfRun: String,
  dtCode: String,
  dtReason: String,
  dtStop: String,
  dtMin: String,
  noOfStops: String,
  sndMail: String,
  status: Number,
});

var downtimeSchema = mongoose.Schema({
  Downtime_id: String,
  DT_Code: String,
  DT_Reason: String,
  DT_Stop: String,
  DT_min: String,
  Nstops: String,
  OEE_DT_Dec: String,
  OEE_Hr: String,
  Comments: String,
  DTCorrective_Action: String,
  status: Number,
});
downtimeSchema.pre('save', function (next) {
  this.Downtime_id = this._id;
  next();
});

var jobSchedulerSchema = mongoose.Schema({
  JobScheduler_id: String,
  Operator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Supervisor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  WorkStation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workstation' }],
  Job_Batch_name: String,
  WorkOrderDetails: String,
  ScheduleStartTime: String,
  ScheduleEndTime: String,
  ScheduleDownTimeStart: String,
  ScheduleDownTimeEnd: String,
  SceduleHr: String,
  Item_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemMaster' }],
  status: Number,
});
jobSchedulerSchema.pre('save', function (next) {
  this.Item_id = this._id;
  next();
});

var User = mongoose.model('User', userSchema, 'ALB_User');
var Roles = mongoose.model('Roles', roleSchema, 'ALB_Role');
var Organization = mongoose.model(
  'Organization',
  organisationSchema,
  'ALB_Organization'
);
var Employee = mongoose.model('Employee', employeeSchema, 'ALB_Employees');
var InventoryCalender = mongoose.model(
  'InventoryCalender',
  inventoryCalenderSchema,
  'ALB_Inventory_Calendar'
);
var Workstation = mongoose.model(
  'Workstation',
  workstationSchema,
  'ALB_Workstation'
);
var Reason = mongoose.model('Reason', reasonSchema, 'ALB_Reason');
var Downtime = mongoose.model('Downtime', downtimeSchema, 'ALB_Downtime');
var ItemMaster = mongoose.model(
  'ItemMaster',
  itemMasterSchema,
  'ALB_Item_Master'
);
var AspJob = mongoose.model('AspJob', aspJobSchema, 'aspJob');
var PrdDataHr = mongoose.model('PrdDataHr', prdDataHrSchema, 'prdDataHr');
var JobScheduler = mongoose.model(
  'JobScheduler',
  jobSchedulerSchema,
  'ALB_JobScheduler'
);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//=========================================================
function randomString() {
  var str =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+?';
  var randomStr = '';
  for (var i = 0; i < 8; i++) {
    var random = Math.floor(Math.random() * 76);
    randomStr = randomStr.concat(str[random]);
  }

  return randomStr;
}
//=========================================================

router.post('/api/login', function (req, res, next) {
  var LoginInfo = req.body;
  var flag = 0;

  User.find({ Email_Id: LoginInfo.email, status: 1 }, function (err, response) {
    if (err) res.json({ message: 'Error', status: 0 });
    else if (response.length == 0)
      res.json({ message: 'Invalid user id', status: 0 });
    else {
      var role = response[0].Role_Id;
      var id = response[0].User_id;
      var firstLogin = response[0].First_Login;
      var token = response[0].authenticationToken;
      var hash = response[0].Password;
      console.log(response[0].Password);
      bcrypt.compare(LoginInfo.password, hash, function (err, success) {
        if (err) {
          res.json({ message: 'Error', status: 0 });
        } else {
          if (success == false) {
            res.json({ message: 'Invalid Password', status: 0 });
          } else {
            res.json({
              message: 'Login Successful',
              id: id,
              token: token,
              role: role,
              first_Login: firstLogin,
              status: 1,
            });
          }
        }
      });
    }
  });
});

router.post('/api/reset', function (req, res, next) {
  var resetInfo = req.body;
  var msg = '';
  var stat = -1;
  const saltRounds = 10;
  console.log(req.body);

  if (resetInfo.password == resetInfo.confirmPassword) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        res.json({ message: 'Salt generation error', status: 0 });
      } else {
        bcrypt.hash(resetInfo.password, salt, function (err, hash) {
          if (err) {
            res.json({ message: 'Hash error', status: 0 });
          } else {
            var myquery = { User_id: resetInfo.UserId };
            var newvalues = { $set: { Password: hash, First_Login: 0 } };
            User.updateOne(myquery, newvalues, function (err, result) {
              if (err) {
                result.json({ message: 'Error', status: 0 });
              } else {
                res.json({
                  message: 'Password Reset',
                  id: resetInfo.UserId,
                  status: 1,
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.json({ message: 'Password reset failed', status: 0 });
  }

  //res.json({message: msg , status: stat});
});

router.post('/api/addUser', function (req, res, next) {
  console.log('Data; ' + req.body.pwd);
  // if(userSchema.plugin(uniqueValidator)){
  // 	res.json({message: 'User Name or Email Id already exists' , status: 1});
  // }
  var userInfo = req.body;
  var startDate = moment(userInfo.startdate).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(userInfo.enddate).format('YYYY-MM-DD HH:mm:ss');
  var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  var userId = userInfo.UserId;

  if (userId == '1234') {
    userId = new ObjectID();
  }

  var roleName = '';
  const saltRounds = 10;

  Roles.findOne({ _id: userInfo.role }, function (err, response) {
    if (err) {
      res.json({ message: 'RoleName error', status: 1 });
    } else {
      console.log('Response: ' + response);
      roleName = response.Role_Name;

      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          res.json({ message: 'Salt generation error', status: 1 });
        } else {
          bcrypt.hash(userInfo.pwd, salt, function (err, hash) {
            if (err) {
              res.json({ message: 'Hash error', status: 1 });
            } else {
              console.log('Hash; ' + hash);
              var newUser = new User({
                User_id: new ObjectID(),
                User_name: userInfo.username,
                Employee_id: userInfo.employeeId,
                Employee_number: userInfo.empNumber,
                Client: 'Test',
                Start_Date: startDate,
                End_Date: endDate,
                Creation_date: currentDate,
                Updated_date: currentDate,
                Created_by: userId,
                Updated_by: userId,
                Role_id: userInfo.role,
                Role_name: roleName,
                Email_Id: userInfo.email,
                Organization_id: userInfo.organizationId,
                Password: hash,
                First_Login: 1,
                status: 1,
              });
              newUser.save(function (err, User) {
                if (err) {
                  if (
                    err.errors.User_name != undefined &&
                    err.errors.User_name.kind === 'unique'
                  ) {
                    res.json({
                      message: 'User name already exists',
                      status: 1,
                    });
                  } else if (
                    err.errors.Email_Id != undefined &&
                    err.errors.Email_Id.kind === 'unique'
                  ) {
                    res.json({ message: 'Email ID already exists', status: 1 });
                  } else {
                    res.json({ message: 'Save Error', status: 1 });
                  }
                } else {
                  const clientId = '438648115554-tscqb14rcunjp9c821bmbveh95mmipvb.apps.googleusercontent.com';
                  const secret = 'LYZQF5rIq536pBGu_kHKIqY7';
                  const email = 'atgenx@gmail.com';
                  const oauth2Client = new OAuth2(
                      clientId,
                      secret,
                      "https://developers.google.com/oauthplayground"
                  );
                  const refreshToken = '1//04hjZ0D5Ujv7wCgYIARAAGAQSNwF-L9Irxl_WaMyf7bEA0Y3RSh-HN2uEaPSGp2Xcy1raaTiKtbHSNGW-LNl_yIDCS96ZvljBcm8';

                  oauth2Client.setCredentials({
                    refresh_token: refreshToken
                  });




                  async function sendMail() {
                    try {
                      const accessToken = await oauth2Client.getAccessToken();

                      const transport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          type: 'OAuth2',
                          user: email,
                          clientId: clientId,
                          clientSecret: secret,
                          refreshToken: '1//04hjZ0D5Ujv7wCgYIARAAGAQSNwF-L9Irxl_WaMyf7bEA0Y3RSh-HN2uEaPSGp2Xcy1raaTiKtbHSNGW-LNl_yIDCS96ZvljBcm8',
                          accessToken: accessToken,
                        },
                      });

                      const mailOptions = {
                        from: email,
                        to: userInfo.email,
                        subject: 'Welcome to Albedo',
                        text: 'Your temporary password is:  ' + userInfo.pwd,
                        html: '<h1>Welcome to Albedo</h1>',
                      };
                      const result = await transport.sendMail(mailOptions);
                      return result;
                    } catch (error) {
                      return error;
                    }
                  }

                  sendMail()
                      .then((result) => {
                        console.log('Email sent...', result);
                        res.json({ message: 'User added', status: 0 });
                      }

                      )
                      .catch((error) => {
                        console.log(error.message);
                        res.json({ message: 'Email error', status: 1 });
                      });



                  // const createTransporter = async () => {
                  //   const oauth2Client = new OAuth2(
                  //       process.env.CLIENT_ID,
                  //       process.env.CLIENT_SECRET,
                  //       "https://developers.google.com/oauthplayground"
                  //   );
                  //
                  //   oauth2Client.setCredentials({
                  //     refresh_token: process.env.REFRESH_TOKEN
                  //   });
                  //
                  // }

                  //   const accessToken = await new Promise((resolve, reject) => {
                  //     oauth2Client.getAccessToken((err, token) => {
                  //       if(err) {
                  //         reject();
                  //       }
                  //       resolve(token);
                  //     });
                  //   });
                  //
                  //   const transporter = nodemailer.createTransport({
                  //     service: "gmail",
                  //     host: 'smtp.gmail.com',
                  //     port: 465,
                  //     secure: true,
                  //     auth: {
                  //       type: "OAuth2",
                  //       user: process.env.EMAIL,
                  //       accessToken,
                  //       clientId: process.env.CLIENT_ID,
                  //       clientSecret: process.env.CLIENT_SECRET,
                  //       refreshToken: process.env.REFRESH_TOKEN
                  //     }
                  //   });
                  //
                  //   return transporter;
                  // };
                  //
                  // const sendEmail = async (emailOptions) => {
                  //   let emailTransporter = await createTransporter();
                  //   await emailTransporter.sendMail(emailOptions);
                  // };
                  //
                  // sendEmail({
                  //   from: process.env.EMAIL,
                  //   to: userInfo.email,
                  //   subject: 'Welcome to Albedo',
                  //   text: 'Your temporary password is:  ' + userInfo.pwd,
                  // }, (err) => {
                  //   console.log("From Mail");
                  //   console.log(err);
                  // });




                  // var transporter = nodemailer.createTransport({
                  //   host: 'smtp.gmail.com',
                  //   port: 587,
                  //   secure: false,
                  //   auth: {
                  //     //user: 'foodonlineimca@gmail.com',
                  //     user: 'atgenx@gmail.com',
                  //     //pass: 'imca@123'
                  //     pass: '@genX2021',
                  //   },
                  // });

                  // var mailOptions = {
                  //   from: 'atgenx@gmail.com',
                  //   to: userInfo.email,
                  //   subject: 'Welcome to albedo',
                  //   text: 'Your temporary password is:  ' + userInfo.pwd,
                  // };

                  // transporter.sendMail(mailOptions, function (error, info) {
                  //   console.log(error);
                  //   if (error) {
                  //     console.log('Error' + error);
                  //     res.json({ message: 'Email error', status: 1 });
                  //   } else {
                  //     res.json({ message: 'User added', status: 0 });
                  //   }
                  // });
                }
              });
            }
          });
        }
      });
    }
  });
});
router.post('/api/addOrganization', function (req, res, next) {
  //console.log("Data; " + req.body.organizationCode);
  let organizationInfo = req.body;
  let organizationCode = organizationInfo.Organization_Code;
  let client = organizationInfo.Client;
  let location = organizationInfo.Location;
  let costCenter = organizationInfo.costCenter;
  let plant = organizationInfo.Plant;
  let shopFloor = organizationInfo.Shopfloor;
  let businessUnit = organizationInfo.businessUnit;

  var newOrganization = new Organization({
    Oraganization_Id: new ObjectID(),
    Organization_Code: organizationCode,
    Location: location,
    Client: client,
    costCenter: costCenter,
    Plant: plant,
    businessUnit: businessUnit,
    //organizationName: String,
    Workstation: randomString(), //nv
    //department: String,
    Shopfloor: shopFloor,
    status: 1,
  });

  newOrganization.save(function (err, Roles) {
    if (err) res.json({ message: 'Error', status: 1 });
    else res.json({ message: 'Roles added successfully', status: 0 });
  });
  // var userInfo = req.body;
  // var startDate = moment(userInfo.startdate).format("YYYY-MM-DD HH:mm:ss");
  // var endDate = moment(userInfo.enddate).format("YYYY-MM-DD HH:mm:ss");
  // var currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  // var userId = userInfo.UserId;

  // if(userId == "1234"){
  // 	userId = new ObjectID();
  // }

  // var  roleName= "";
  // const saltRounds = 10;

  // Roles.findOne({ _id: userInfo.role },function(err, response){
  // 	if (err) {
  // 		res.json({message: 'RoleName error' , status: 1});
  // 	} else {
  // 		console.log("Response: " + response)
  // 		roleName = response.Role_Name;

  // 		bcrypt.genSalt(saltRounds, function (err, salt) {
  // 			if (err) {
  // 				res.json({message: 'Salt generation error' , status: 1});
  // 			} else {
  // 				bcrypt.hash(userInfo.pwd, salt, function(err, hash) {
  // 					if (err) {
  // 						res.json({message: 'Hash error' , status: 1});
  // 					} else {
  // 						console.log("Hash; " + hash);
  // 						var newUser = new User({
  // 							User_id: new ObjectID(),
  // 							  User_name: userInfo.username,
  // 							  Employee_number: userInfo.empNumber,
  // 							  Start_Date: startDate,
  // 							  End_Date: endDate,
  // 							  Creation_date: currentDate,
  // 							  Updated_date: currentDate,
  // 							  Created_by: userId,
  // 							  Updated_by: userId,
  // 							  Role_id: userInfo.role,
  // 							  Role_name: roleName,
  // 							  Email_Id: userInfo.email,
  // 							  Password: hash,
  // 							  First_Login: 1,
  // 							  status: 1,
  // 						});
  // 						newUser.save(function(err, User){
  // 							if(err)
  // 								res.json({message: 'Save Error' , status: 1});
  // 							else{

  // 								var transporter = nodemailer.createTransport({

  // 								  host: 'smtp.yandex.com',
  // 								  port: 465,
  // 								  auth: {
  // 									//user: 'foodonlineimca@gmail.com',
  // 									user: 'kxl@kradlex.com',
  // 									//pass: 'imca@123'
  // 									pass: '4*h&h%^mAnf7'
  // 								  }
  // 								});

  // 								var mailOptions = {
  // 								  from: 'kxl@kradlex.com',
  // 								  to: userInfo.email ,
  // 								  subject: 'Welcome to albedo',
  // 								  text: 'Your temporary password is: ' + userInfo.pwd
  // 								};

  // 								transporter.sendMail(mailOptions, function(error, info){
  // 								  if (error) {
  // 									res.json({message: 'Email error' , status: 1});
  // 								  } else {
  // 									res.json({message: 'User added' , status: 0});
  // 								  }
  // 								});

  // 							}
  // 						});
  // 					}
  // 				})
  // 			}
  // 		})
  // 	}
  //  });
});

router.post('/api/addRoles', function (req, res, next) {
  var rolesInfo = req.body;
  var userId = rolesInfo.UserId;
  var token = rolesInfo.Token;

  var newRoles = new Roles({
    Role_Id: new ObjectID(),
    Role_Name: rolesInfo.rolename,
    Main_menu: 'Not Specified',
    UI_access: rolesInfo.uiAccess,
    SystemAdmin: false,
    APSMaster: false,
    APSDataScreen: false,
    status: 1,
  });

  newRoles.save(function (err, Roles) {
    if (err) res.json({ message: 'Error', status: 1 });
    else res.json({ message: 'Roles added successfully', status: 0 });
  });
});

router.post('/api/addItemMaster', function (req, res, next) {
  var itemMasterInfo = req.body;

  var userId = itemMasterInfo.UserId;
  var startDate = moment(itemMasterInfo.startDate).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  var endDate = moment(itemMasterInfo.endDate).format('YYYY-MM-DD HH:mm:ss');

  var newItemMaster = new ItemMaster({
    Item_id: new ObjectID(),
    Item_Code: itemMasterInfo.itemCode,
    Unit: itemMasterInfo.unit,
    Start_Date: startDate,
    End_Date: endDate,
    Min_Produce_Hr: itemMasterInfo.minProduce,
    Max_Produce_Hr: itemMasterInfo.maxProduce,
    Averag_Produce_Hr: itemMasterInfo.averageProduce,
    ItemDescription: itemMasterInfo.itemDescription,
    Organization_id: itemMasterInfo.organizationId,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newItemMaster.save(function (err, ItemMaster) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'ItemMaster added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/organization', function (req, res, next) {
  var organizationInfo = req.body;

  var userId = organizationInfo.UserId;

  var newOrganization = new Organization({
    Organization_id: new ObjectID(),
    Organization_Code: organizationInfo.organizationCode,
    Location: organizationInfo.location,
    Plant: organizationInfo.plant,
    organizationName: organizationInfo.organizationName,
    department: organizationInfo.department,
    Shopfloor: organizationInfo.shoopfloor,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newOrganization.save(function (err, Organization) {
        if (err) res.json({ message: 'Error', status: 1 });
        else
          res.json({
            message: 'Organizatioonal Details added successfully',
            status: 0,
          });
      });
    }
  });
});

router.post('/api/addInventory', function (req, res, next) {
  var inventoryInfo = req.body;

  var userId = inventoryInfo.UserId;
  var startDate = moment(inventoryInfo.yearStartDate).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  var endDate = moment(inventoryInfo.yearEndDate).format('YYYY-MM-DD HH:mm:ss');
  var PrStartDate = moment(inventoryInfo.pereiodStartDate).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  var PrEndDate = moment(inventoryInfo.periodEndDate).format(
    'YYYY-MM-DD HH:mm:ss'
  );

  var newInventory = new InventoryCalender({
    Inventory_id: new ObjectID(),
    Inventory_Cal_Name: inventoryInfo.name,
    Year: inventoryInfo.year,
    Start_Date: startDate,
    End_Date: endDate,
    Period: inventoryInfo.inventoryPeriod,
    P_Start_Date: PrStartDate,
    P_End_Date: PrEndDate,
    Schedule: inventoryInfo.schedule,
    Shift: inventoryInfo.shift,
    Shift_Hour: inventoryInfo.hour,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newInventory.save(function (err, InventoryCalender) {
        if (err) res.json({ message: 'Error', status: 1 });
        else
          res.json({
            message: 'Inventory Calender added successfully',
            status: 0,
          });
      });
    }
  });
});

router.post('/api/addEmployee', function (req, res, next) {
  var employeeInfo = req.body;

  var userId = employeeInfo.UserId;

  var newEmployee = new Employee({
    Employee_id: new ObjectID(),
    Employee: employeeInfo.employee,
    First_Name: employeeInfo.employeeFname,
    Last_Name: employeeInfo.employeeLname,
    Employee_ref: employeeInfo.employeeRef,
    email_address: employeeInfo.email,
    Role_id: employeeInfo.roleId,
    Phone: employeeInfo.phnNumber,
    Mobile: employeeInfo.cellNumber,
    Manager_number: employeeInfo.managerNumber,
    Oraganization_Id: employeeInfo.organizationId,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newEmployee.save(function (err, Employee) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'Employee added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/addWorkstation', function (req, res, next) {
  var workstationInfo = req.body;

  //<<<<<<< HEAD
  var userId = workstationInfo.UserId;

  var newWorkStation = new Workstation({
    workstation_id: new ObjectID(),
    Workstation: workstationInfo.workstationName,
    Machine_Type: workstationInfo.machineType,
    Manufacture: workstationInfo.manufacture,
    ShopFloor: workstationInfo.shopFloor,
    IP_Address: workstationInfo.ipAddress,
    host_name: workstationInfo.hostName,
    Description: workstationInfo.description,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newWorkStation.save(function (err, Workstation) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'Workstation added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/addReason', function (req, res, next) {
  var reasonInfo = req.body;

  var userId = reasonInfo.UserId;

  var newReason = new Reason({
    Reason_id: new ObjectID(),
    Reason: reasonInfo.reason,
    TagCode: reasonInfo.tagCode,
    TagName: reasonInfo.tagName,
    TagColor: reasonInfo.tagColor,
    TagState: reasonInfo.tagState,
    ParentCode: reasonInfo.parentCode,
    TagLevel: reasonInfo.tagLevel,
    TagCategories: reasonInfo.tagCategory,
    errorDescription: reasonInfo.errorDescription,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newReason.save(function (err, Reason) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'Reason added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/aspjob', function (req, res, next) {
  console.log(req.body);

  var aspJobInfo = req.body;

  var userId = aspJobInfo.UserId;

  var newAspJob = new AspJob({
    job_Id: new ObjectID(),
    job: aspJobInfo.job,
    jobDetails: aspJobInfo.jobDetails,
    scheduleStartTime: aspJobInfo.scheduleStartTime,
    scheduleEndTime: aspJobInfo.scheduleEndTime,
    item: aspJobInfo.item,
    scheduleDownStartTime: aspJobInfo.scheduleDownStartTime,
    scheduleDownEndTime: aspJobInfo.scheduleDownEndTime,
    totalProdue: aspJobInfo.totalProdue,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newAspJob.save(function (err, AspJob) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'AspJob added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/prdDataHr', function (req, res, next) {
  var prdDataHrInfo = req.body;

  var userId = prdDataHrInfo.UserId;
  var ddate = moment(prdDataHrInfo.date).format('YYYY-MM-DD HH:mm:ss');

  var newPrdDataHr = new PrdDataHr({
    job_Id: new ObjectID(),
    job: prdDataHrInfo.job,
    date: ddate,
    shift: prdDataHrInfo.shift,
    hours: prdDataHrInfo.hours,
    workstation: prdDataHrInfo.workstation,
    operator: prdDataHrInfo.operator,
    supervisor: prdDataHrInfo.supervisor,
    stCountPerHr: prdDataHrInfo.stCountPerHr,
    acCountPerHr: prdDataHrInfo.acCountPerHr,
    speedOfRun: prdDataHrInfo.speedOfRun,
    dtCode: prdDataHrInfo.dtCode,
    dtReason: prdDataHrInfo.dtReason,
    dtStop: prdDataHrInfo.dtStop,
    dtMin: prdDataHrInfo.dtMin,
    noOfStops: prdDataHrInfo.noOfStops,
    sndMail: prdDataHrInfo.sndMail,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newPrdDataHr.save(function (err, PrdDataHr) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'PrdDataHr added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/addDowntime', function (req, res, next) {
  var downtimeInfo = req.body;

  var userId = downtimeInfo.UserId;

  var newDowntime = new Downtime({
    Downtime_id: new ObjectID(),
    DT_Code: downtimeInfo.dtCode,
    DT_Reason: downtimeInfo.dtReason,
    DT_Stop: downtimeInfo.dtStop,
    DT_min: downtimeInfo.dtMin,
    Nstops: downtimeInfo.nStops,
    OEE_DT_Dec: downtimeInfo.oeedtdec,
    OEE_Hr: downtimeInfo.oeeHr,
    Comments: downtimeInfo.comments,
    DTCorrective_Action: downtimeInfo.action,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newDowntime.save(function (err, Downtime) {
        if (err) res.json({ message: 'Error', status: 1 });
        else res.json({ message: 'Downtime added successfully', status: 0 });
      });
    }
  });
});

router.post('/api/addJobScheduler', function (req, res, next) {
  var jobSchedulerInfo = req.body;

  var userId = jobSchedulerInfo.UserId;
  var startTime = moment(jobSchedulerInfo.startTime).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  var endTime = moment(jobSchedulerInfo.endTime).format('YYYY-MM-DD HH:mm:ss');
  var start = moment(jobSchedulerInfo.start).format('YYYY-MM-DD HH:mm:ss');
  var end = moment(jobSchedulerInfo.end).format('YYYY-MM-DD HH:mm:ss');

  var newJobScheduler = new JobScheduler({
    JobScheduler_id: new ObjectID(),
    Operator: jobSchedulerInfo.operator,
    Supervisor: jobSchedulerInfo.supervisor,
    WorkStation: jobSchedulerInfo.workStation,
    Job_Batch_name: jobSchedulerInfo.batchName,
    WorkOrderDetails: jobSchedulerInfo.orderDetails,
    ScheduleStartTime: startTime,
    ScheduleEndTime: endTime,
    ScheduleDownTimeStart: start,
    ScheduleDownTimeEnd: end,
    SceduleHr: jobSchedulerInfo.scheduleHr,
    Item_id: jobSchedulerInfo.itemId,
    status: 1,
  });

  User.find({ User_id: userId }, function (err, response) {
    if (err || response.length == 0)
      res.json({ message: 'User Not Authenticated', status: 1 });
    else {
      newJobScheduler.save(function (err, JobScheduler) {
        if (err) res.json({ message: 'Error', status: 1 });
        else
          res.json({ message: 'Job Scheduler added successfully', status: 0 });
      });
    }
  });
});

//=========================================================

router.get('/api/fetchUsers', function (req, res, next) {
  User.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchRoles', function (req, res, next) {
  Roles.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchItemMaster', function (req, res, next) {
  ItemMaster.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchWorkstation', function (req, res, next) {
  Workstation.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchReason', function (req, res, next) {
  Reason.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchEmployee', function (req, res, next) {
  Employee.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchOrganization', function (req, res, next) {
  Organization.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchInventory', function (req, res, next) {
  InventoryCalender.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchDowntime', function (req, res, next) {
  Downtime.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchJob', function (req, res, next) {
  AspJob.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchProduction', function (req, res, next) {
  PrdDataHr.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

router.get('/api/fetchJobScheduler', function (req, res, next) {
  JobScheduler.find({ status: 1 }, function (err, response) {
    res.json(response);
  });
});

//=========================================================

router.post(
  '/api/importUsers',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;
    var tempPass = randomString();
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        res.json({ message: 'Salt generation error', status: 1 });
      } else {
        bcrypt.hash(tempPass, salt, function (err, hash) {
          if (err) {
            res.json({ message: 'Hash error', status: 1 });
          } else {
            xlsxFile('./uploads/Data.xlsx').then((rows) => {
              if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
              else {
                rows.forEach((col) => {
                  var startDate = moment(col[1]).format('YYYY-MM-DD HH:mm:ss');
                  var endDate = moment(col[2]).format('YYYY-MM-DD HH:mm:ss');

                  var newUser = new User({
                    User_name: col[0],
                    Start_Date: startDate,
                    End_Date: endDate,
                    Created_by: col[3],
                    Updated_by: col[4],
                    Email_Id: col[5],
                    Role_name: col[6],
                    Password: hash,
                    First_Login: 1,
                    status: 1,
                  });

                  var transporter = nodemailer.createTransport({
                    host: 'smtp.yandex.com',
                    port: 465,
                    auth: {
                      //user: 'foodonlineimca@gmail.com',
                      user: 'kxl@kradlex.com',
                      //pass: 'imca@123'
                      pass: '4*h&h%^mAnf7',
                    },
                  });

                  var mailOptions = {
                    from: 'kxl@kradlex.com',
                    to: col[5],
                    subject: 'Welcome to albedo',
                    text: 'Your temporary password is: ' + tempPass,
                  };

                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      res.json({ message: 'Email error', status: 1 });
                    } else {
                      newUser.save(function (err, User) {
                        if (err) res.json({ message: 'Error', status: 1 });
                        else {
                          fs.unlinkSync('./uploads/Data.xlsx');
                          res.json({ message: 'Roles Added', status: 0 });
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  }
);

router.post(
  '/api/importRoles',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    try {
      xlsxFile('./uploads/Data.xlsx').then((rows) => {
        if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
        else {
          rows.forEach((col) => {
            var newRole = new Roles({
              Role_Id: new ObjectID(),
              Role_Name: col[0],
              Main_menu: 'Not Specified',
              UI_access: col[1],
              SystemAdmin: false,
              APSMaster: false,
              APSDataScreen: false,
              status: 1,
            });

            newRole.save(function (err, Roles) {
              if (err) res.json({ message: 'Error', status: 1 });
            });
          });
          fs.unlinkSync('./uploads/Data.xlsx');
          res.json({ message: 'Roles Added', status: 0 });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  '/api/importOrganization',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
          var newOrganization = new Organization({
            Organization_id: new ObjectID(),
            Organization_Code: col[0],
            Location: col[1],
            Plant: col[2],
            organizationName: col[3],
            department: col[4],
            Shopfloor: col[5],
            status: 1,
          });

          newOrganization.save(function (err, Organization) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'Organization Added', status: 0 });
      }
    });
  }
);

router.post(
  '/api/importInventoryCalendar',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
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
            scheduleEndDate: col[9],
            status: 1,
          });

          newInventory.save(function (err, InventoryCalender) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'Inventory Calender Added', status: 0 });
      }
    });
  }
);

router.post(
  '/api/importEmployee',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
          var newEmployee = new Employee({
            Employee_id: new ObjectID(),
            employeeCode: col[0],
            First_Name: col[1],
            Last_Name: col[2],
            email_address: col[3],
            Phone: col[4],
            Mobile: col[5],
            supervisorName: col[6],
            Oraganization_Id: col[7],
            status: 1,
          });

          newEmployee.save(function (err, Employee) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'Employee Added', status: 0 });
      }
    });
  }
);

router.post(
  '/api/importWorkstation',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
          var newWorkStation = new Workstation({
            workstation_id: new ObjectID(),
            Workstation: col[0],
            Machine_Type: col[1],
            Manufacture: col[2],
            ShopFloor: col[3],
            IP_Address: col[4],
            host_name: col[5],
            Description: col[6],
            status: 1,
          });

          newWorkStation.save(function (err, Workstation) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'Workstation Added', status: 0 });
      }
    });
  }
);

router.post(
  '/api/importReason',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
          var newReason = new Reason({
            Reason_id: new ObjectID(),
            TagCode: col[0],
            TagName: col[1],
            TagColor: col[2],
            TagState: col[3],
            ParentCode: col[4],
            TagLevel: col[5],
            TagCategories: col[6],
            errorDescription: col[7],
            status: 1,
          });

          newReason.save(function (err, Reason) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'Reason Added', status: 0 });
      }
    });
  }
);

router.post(
  '/api/importItemMaster',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
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
            ItemDescription: col[8],
            status: 1,
          });

          newItemMaster.save(function (err, ItemMaster) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'ItemMaster Added', status: 0 });
      }
    });
  }
);

router.post(
  '/api/importAspJob',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
          var newAspJob = new AspJob({
            Job_id: new ObjectID(),
            job: col[0],
            jobDetails: col[1],
            scheduleStartTime: col[2],
            scheduleEndTime: col[3],
            item: col[4],
            scheduleDownStartTime: col[5],
            scheduleDownEndTime: col[6],
            totalProdue: col[7],
            status: 1,
          });

          newAspJob.save(function (err, AspJob) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'AspJob Added', status: 0 });
      }
    });
  }
);

/*
router.post('/api/importAspJob', function(req, res, next) {


	
	const busboy = new Busboy({ headers: req.headers })

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        const saveTo = path.join('./uploads', filename)

        file.pipe(fs.createWriteStream(saveTo));
    })

    busboy.on('finish', function() {
        res.status(200).json({ success: true })
    })

    return req.pipe(busboy)  



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
				totalProdue: col[7],
				status: 1
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
*/
router.post(
  '/api/importPrdDtHrs',
  multer({ storage: store }).single('fileKey'),
  function (req, res, next) {
    var FileInfo = req.body;

    xlsxFile('./uploads/Data.xlsx').then((rows) => {
      if (rows.length == 0) res.json({ message: 'No Data', status: 1 });
      else {
        rows.forEach((col) => {
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
            sndMail: col[15],
            status: 1,
          });

          newPrdDataHr.save(function (err, PrdDataHr) {
            if (err) res.json({ message: 'Error', status: 1 });
          });
        });
        fs.unlinkSync('./uploads/Data.xlsx');
        res.json({ message: 'PrdDataHr Added', status: 0 });
      }
    });
  }
);

//=========================================================

router.post('/api/deleteUser', function (req, res, next) {
  var myquery = { User_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  User.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteRoles', function (req, res, next) {
  var myquery = { _id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  Roles.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteItem', function (req, res, next) {
  var myquery = { Item_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  ItemMaster.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteReason', function (req, res, next) {
  var myquery = { Reason_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  Reason.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteOrganization', function (req, res, next) {
  var myquery = { Organization_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  Organization.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      result.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteInventory', function (req, res, next) {
  var myquery = { Inventory_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  InventoryCalender.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteEmployee', function (req, res, next) {
  var myquery = { Employee_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  Employee.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteWorkstation', function (req, res, next) {
  var myquery = { workstation_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  Workstation.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteDowntime', function (req, res, next) {
  var myquery = { Downtime_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  Downtime.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteJobScheduler', function (req, res, next) {
  var myquery = { JobScheduler_id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  JobScheduler.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteaspJob', function (req, res, next) {
  var myquery = { job_Id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  AspJob.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});

router.post('/api/deleteProduction', function (req, res, next) {
  var myquery = { job_Id: req.body.id };
  var newvalues = { $set: { status: 0 } };
  PrdDataHr.updateOne(myquery, newvalues, function (err, result) {
    if (err) {
      esult.json({ message: 'Error', status: 1 });
    } else {
      res.json({ message: 'Successfully deleted', status: 0 });
    }
  });
});
//=========================================================
module.exports = router;

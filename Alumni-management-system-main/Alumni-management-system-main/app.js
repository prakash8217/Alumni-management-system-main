const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
let fs = require('fs');
let path = require('path')
let multer = require('multer')
let methodOverride = require('method-override')
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const	passportLocalMongoose =require("passport-local-mongoose");
const User = require("./model/User");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))
mongoose.set("strictQuery",false);
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0');
//Create Connections

const jobSchema = new mongoose.Schema({
  company: String,
  experience: Number,
  post: String,
  place: String,
  description:String,
  followers : Number,
  following : Number,
  projects : Number,
});

const userSchema = new mongoose.Schema({
  fullname: String,
  username: Number,
  Joining_Year: String,
  Pass_Out_Year: String,
  Phone_Number: String,
  Job: Number,
  Company: String,
  Further_Studies: String,
});

const job = mongoose.model('job', jobSchema);
const user = mongoose.model('user', userSchema);

app.post("/job", function(req,res){
  const post1 = {
    company : req.body.company,
    experience : req.body.experience,
    post : req.body.post,
    place : req.body.place,
    description : req.body.description,
    followers : req.body.followers,
    following : req.body.following,
    projects : req.body.projects,
  };
  const article = new job({
    company : post1.company,
    experience : post1.experience,
    post : post1.post,
    place : post1.place,
    description : post1.description,
    followers : post1.followers,
    following : post1.following,
    projects : post1.projects, 
  });
  article.save();
  res.redirect("/home");
});
app.get("/",function(req,res){
  res.render("main");

});
app.get("/job",function(req,res){
  res.render("detail");

});
app.get("/internship",function(req,res){
  res.render("detail1");

});
app.get("/details",function(req,res){
    res.render("detail");

});
app.get("/home",function(req,res){
  job.find({},function(err,jobs){
    if(err) console.log("error");
    else{
      res.render("home",{jobdetails:jobs});
    }
      
  });

});



app.get("/login",function(req,res){
  res.render("login");

});
app.get("/admin",function(req,res){
  res.render("admin");

});
app.get("/register",function(req,res){
  res.render("register");

});
app.get("/event",function(req,res){
  res.render("cal");

});

app.post("/register", async (req, res) => {
	try {
		const { fullname, username, password, Joining_Year, Pass_Out_Year, Phone_Number, Job, Company, Further_Studies } = req.body;
		console.log(username);
		// create a new user object
		const user = new User({
			fullname,
			username,
			password,
			Joining_Year,
			Pass_Out_Year,
			Phone_Number,
			Job,
			Company,
			Further_Studies
		});

		// save the new user in the database
		await user.save();
		
		return res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error });
	}
});
//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("main1");
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});
app.post("/admin", async function(req, res){
	try {
		// check if the user exists
		const user = 'admin';
    const password = 'admin123';
		if (user) {
		//check if password matches
		
		if (password) {
			res.render("main1");
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

//Handling user logout
app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie('connect.sid'); // Clear the cookie session ID
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
      res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
      res.setHeader('Expires', '0'); // Proxies.
      res.redirect('/');
    }
  });
});
app.use(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

// Showing secret page
app.get("/main1", isLoggedIn, function (req, res) {
	res.render("main1");
});
app.get("/home_nav", function (req, res) {
	res.render("main1");
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

let myschema = mongoose.Schema({
  Picture : String
})
let mymodel = mongoose.model('table', myschema)

//Storage Setting
let storage = multer.diskStorage({
  destination:'./public/images', //directory (folder) setting
  filename:(req, file, cb)=>{
      cb(null, file.originalname) // file name setting
  }
})

//Upload Setting
let upload = multer({
 storage: storage,
 fileFilter:(req, file, cb)=>{
  if(
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'

  ){
      cb(null, true)
  }
  else{
      cb(null, false);
      cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
  }
 }
})

//SINGALE IMAGE UPLODING
app.post('/singlepost', upload.single('single_input'), (req, res)=>{
  req.file
  if(!req.file){
      return console.log('You have not Select any Image, Please Select any Image on Your Computer')
  }
  mymodel.findOne({Picture:req.file.filename})
  .then((a)=>{
      if(a){
          console.log("Your Image Dulicate, Please Try anoter Images")
      }
      else{
          mymodel.create({Picture:req.file.filename})
              .then((x)=>{
                  res.redirect('/view')

              })
              .catch((y)=>{
                  console.log(y)
              })
      }
  })
              
  
  //res.send(req.file.filename)
})


//mULTIPLE IMAGE UPLODING
app.post('/multiplepost', upload.array('multiple_input', 3), (req, res)=>{


  if(!req.files){
      return console.log('You have not Select any Image, Please Select any Image on Your Computer')
  }
  
  req.files.forEach((singale_image)=>{
      
      mymodel.findOne({Picture: singale_image.filename})
      .then((a)=>{
          if(a){
              console.log("Your Image Dulicate, Please Try anoter Images")
          }
          else{
              mymodel.create({Picture: singale_image.filename})
              .then((x)=>{
                  res.redirect('/view')
              })
              .catch((y)=>{
                  console.log(y)
              })
          }
      })
      .catch((b)=>{
          console.log(b)
      })

              


  })
})

app.get('/gallery',(req, res)=>{
  res.render('index')
})

app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/edit/:id', (req, res)=>{
  let readquery ={_id:req.params.id};
  //console.log(readquery)
  res.render('edit-file', {readquery})
})

app.put('/edit/:id',upload.single('single_input'), (req, res)=>{
 

  mymodel.updateOne({_id:req.params.id}, {
      Picture : req.file.filename
  })
  .then((x)=>{
      res.redirect('/view')
  })
  .catch((y)=>{
      console.log(y)
  })
})


app.delete('/delete/:id', (req, res)=>{
  let curretn_img_url = (__dirname+'/public/images/'+req.params.id);
 //console.log(curretn_img_url)
 fs.unlinkSync(curretn_img_url)
  mymodel.deleteOne({Picture:req.params.id})
  .then(()=>{
      res.redirect('/view')
  })
  .catch((y)=>{
      console.log(y)
  })
})

app.get('/view', (req, res)=>{
  mymodel.find({})
  .then((x)=>{
      res.render('privew', {x})
      //console.log(x)
  })
  .catch((y)=>{
      console.log(y)
  })

  
})


//Create Connections

const internshipSchema = new mongoose.Schema({
  internshipname: String,
  description: [String],
  mode: String,
  branch: String,
  eligibility: [String],
  phone: String,
  stipend: [String],
  cgpa: String,
});

const internship = mongoose.model('internship', internshipSchema);

app.post("/internship", function(req,res){
  const post1 = {
    internshipname : req.body.internshipname,
    description : req.body.description,
    mode : req.body.mode,
    branch : req.body.branch,
    eligibility : req.body.eligibility,
    phone : req.body.phone,
    stipend : req.body.stipend,
    cgpa : req.body.cgpa
  };
  const article = new internship({
    internshipname : post1.internshipname,
    description : post1.description,
    mode : post1.mode,
    branch : post1.branch,
    eligibility : post1.eligibility,
    phone : post1.phone,
    stipend : post1.stipend,
    cgpa : post1.cgpa 
  });
  article.save();
  res.redirect("/home");
});
app.get("/internship",function(req,res){
    res.render("detail1");

});
app.get("/internship_home",function(req,res){
    internship.find({},function(err,internships){
    if(err) console.log("error");
    else{
      res.render("home2",{internshipdetails:internships});
    }
      
  });

});

app.get("/listdetails",function(req,res){
  user.find({},function(err,users){
    if(err) console.log("error");
    else{
      res.render("al_display",{list:users});
    }
      
  });

});
app.post("/update/:id", function(req, res){
  const userID = req.params.id;
  const update = {
    fullname : req.body.fullname,
    username : req.body.username,
    Joining_Year : req.body.Joining_Year,
    Pass_Out_Year : req.body.Pass_Out_Year,
    Phone_Number : req.body.Phone_Number,
    Job : req.body.Job,
    Company : req.body.Company,
    Further_Studies : req.body.Further_Studies
  };
  user.findByIdAndUpdate(userID, update, function(err, updateduser){
    if(err) console.log("error");
    else{
      res.redirect("/listdetails");
    }
  });
});
app.post("/delete/:id", function(req, res){
  const userID = req.params.id;
  user.findByIdAndDelete(userID, function(err){
    if(err) console.log("error");
    else{
      res.redirect("/listdetails");
    }
  });
});

app.listen(3002);
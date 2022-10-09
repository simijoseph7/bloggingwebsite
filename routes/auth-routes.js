const { v4: uuid } = require("uuid");
const express = require("express");
const authRouter = express.Router();
const upload = require("../middleware/multer-uploader.js");
const fs = require("fs");
const jimp = require("jimp");
const bcrypt = require('bcrypt');

// The DAO that handles CRUD operations for users.
const {
    createUser,
    retrieveUserByUserName,
    retrieveAllUsernames,
    retrieveUserWithCredentials,
    updateUser,
    deleteUser,
    hashPassword,
    comparePassword,
    checkUsername
} = require("../modules/user-dao.js");
const {sendWelcomeMessageToNewUser} = require('../modules/send-email.js');

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
authRouter.get("/login", async function (req, res) {

    if (res.locals.user) {
        res.redirect("/");
    }

    else {
       
        res.render("login");
    }

});

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
authRouter.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.userName;
    const password = req.body.password;
    
    // Find a matching user in the database
   await retrieveUserWithCredentials(username, password, async(err,result)=>{
        if (err) {
             res.locals.user = null;
             res.setToastMessage(err);
             res.render("login");
        }
        const user =result;
        const authToken = uuid();
        user.authToken = authToken;
        await updateUser(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.redirect("/"); 
    });
  
   
});

// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
authRouter.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});


// exercises
authRouter.get('/signup',(req,res)=>{
    res.render('signup')
})
authRouter.post('/createAccount', async (req, res) => {

 const user = {
            userName : req.body.userName.trim(),
            password: await hashPassword(req.body.password),
            fname : req.body.fname.trim(),
            lname : req.body.lname.trim(),
            dob : req.body.dob,
            email : req.body.email.trim(),
            userImage : "avatar00_default.PNG",
            description : req.body.description
    }
 
    try {
        if (await comparePassword(req.body.passwordRepeat,user.password))
        { 
            await createUser(user);
            sendWelcomeMessageToNewUser(user.email,user.fname);
            res.setToastMessage("Account created successfully!")
            res.redirect("/login");
        }
        else{
             res.setToastMessage("Password doesn't match!")
             res.redirect("/signup");
        }
        
     }
    catch(error){
         console.log(error);
         res.setToastMessage("Username already exists!")
         res.redirect("/signup");
   }
   
   
    
})
// odl signup
authRouter.post("/signup", async function (req, res) {
   res.locals.title = "Home";
   const user = {
        userName: req.body.userName,
        password: req.body.password,
        repeatPassword: req.body.passwordRepeat,
        fname: req.body.fname,
        lname: req.body.lname,
        dob: req.body.dob,
        email: req.body.email,
        userImage: "avatar00_default.PNG",
        description: req.body.description
    }

    //compare entered username with usernames existing in database
    const checkUser= await checkUsername(user.userName);

    //checking if passwords / usernames match and sending toast messages
    if(checkUser != undefined && user.password != user.repeatPassword){
        res.setToastMessage("Username already exists, please try another username!")
        res.redirect("/signup");
     }else if(checkUser != undefined && user.password == user.repeatPassword){
         res.setToastMessage("Username already exists, please try another username!")
         res.redirect("/signup")
     }else if (user.password != user.repeatPassword && checkUser == undefined ){
         res.setToastMessage("Passwords do not match, please try again!")
         res.redirect("/signup")
     }else {
         const newUser= await createUser(user);
         res.setToastMessage("Your account has been created successfully!")
         res.redirect("/login");
    }
 });

// authRouter.get("/uploadAvatar", function (req, res) {

authRouter.get("/gallery", function (req, res) {

    let fileNames = fs.readdirSync("public/images/thumbnails");
    const allowedFileTypes = [".jpg", ".jpeg", ".png"];
    fileNames = fileNames.filter(function (fileName) {
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
        return allowedFileTypes.includes(extension);
    });

    res.locals.title = "Gallery";
    res.locals.images = fileNames;
    res.render("gallery");
});
    
// When we POST to /uploadAvatar, accept the image upload, and move it to the images/avatars folder.
// Then, create a thumbnail for it using jimp.
authRouter.post("/uploadAvatar", upload.single("imageFile"), async function (req, res) {

    const fileInfo = req.file;

    // Move the image into the images folder
    const oldFileName = fileInfo.path;
    const newFileName = `./public/images/avatars/${fileInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);

    // Using jimp, read in the image, resize it, and save it to the thumbnails folder.
    const image = await jimp.read(newFileName);
    image.resize(100, 100);
    await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);

    // Redirect back to /gallery view.
    res.redirect("/gallery");

});

// When user selects and saves a new avatar, /updateAvatar is called, new avatar (image filename) is saved 

authRouter.post("/updateAvatar", async function (req, res) {

    const user = res.locals.user;
    const newImage = req.body.avatar;

    user.userImage = newImage;

    res.locals.user.userImage = newImage;
            
    await updateUser(user);
    res.redirect("/userProfile");

});


// When navigating to "/userProfile", show the user's details.
// Retrieve user details from database

authRouter.get("/userProfile", async function (req, res) {
    
    const user = res.locals.user;       

    res.locals.userId = user.userId;
    res.locals.userImage = user.userImage;
    res.locals.username = user.userName;
    res.locals.firstname = user.fname;
    res.locals.lastname = user.lname;
    res.locals.email = user.email;
    res.locals.dob = user.dob;
    res.locals.description = user.description;
    res.locals.title = "User Profile";
        
    res.render("userProfile");
});


// When user updates info in User Profile, new info is saved to database.
// User is then redirected to homepage.

authRouter.post("/updateProfile", async (req, res) => {
    

    const user = res.locals.user;
    
    user.fname= req.body.fname,
    user.lname= req.body.lname,
    user.email= req.body.email,
    user.dob= req.body.dob,
    user.description= req.body.description

    await updateUser(user);
    
    res.locals.user=user;

    res.redirect("./");
})

//=========================================
//       Delete Account 
//=========================================

authRouter.post('/deleteAccount', async(req,res) => {
   
   const user = res.locals.user;
   const userPassword = req.body.password;
   const userId= user.userId;
   await retrieveUserWithCredentials(user.userName,userPassword,async(err,result)=>{
       if(err){
            res.setToastMessage(`<p class='tc-red'>Wrong password, please try again.</p>`)
            res.redirect('./userProfile')
       }else{
          await deleteUser(userId);
          res.clearCookie("authToken");
          res.locals.user = null;
          res.setToastMessage(`<p class="tc-red">Your account is successfully deleted.</p>`)
          res.redirect('./login');
       }
   });

})


//makes available all usernames in the database at "/username"
authRouter.get("/username", async function (req, res) {
    res.send(await retrieveAllUsernames())
});


authRouter.post('/resetPassword', async (req, res) => {
    const user = res.locals.user;  
    const resetNewPassword= req.body.resetNewPassword;
    const resetConfirmPassword= req.body.resetConfirmPassword;
    const match= (await comparePassword(req.body.resetOldPassword,user.password))
    const newPassword= await hashPassword(req.body.resetConfirmPassword);

     try{
         if (match && (resetNewPassword===resetConfirmPassword))
             { 
                user.password= newPassword
                await updateUser(user);
                res.setToastMessage("Password has been changed, please login again!")
                res.clearCookie("authToken");
                res.locals.user = null;
                res.redirect("./login");
             }
         else if(!match){
             res.setToastMessage("Old password entered does not match existing password, please try again!")
             res.redirect("/userProfile");
            }
        else if(!(resetNewPassword===resetConfirmPassword)){
            res.setToastMessage("New password and confirm password do not match, please try again!")
            res.redirect("/userProfile");

        } 
        }          
     catch(error){
          console.log(error);
      }
})   
   
module.exports = authRouter;

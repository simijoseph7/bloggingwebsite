window.addEventListener("load", async function () {

//when the user types in the password input field, the username entered in the username input field is checked.
//If entered username already exists, the 'username already exists' message displays and disappears.
// same for confirm password

 if ($("#signupUsername")){
    $('#signupSubmit').disabled = true
 $("#signupUsername").addEventListener("input", async function () {
   const allUsernames = await fetchAllUsernames();
   if (!allUsernames.find(username => username.userName.trim() === $("#signupUsername").value.trim())) {
     $("#alertSpan").innerHTML = "";
   } else {
     $("#alertSpan").innerHTML = "Username Already Exists";
     $("#alertSpan").style.color = "red"
   }


 });
 $("#confirmPassword").addEventListener("input", async function () {

   if ($('#confirmPassword').value === $("#signupPassword").value) {
     $("#alertSpanPassword").innerHTML = "";
  } else {
     $("#alertSpanPassword").innerHTML = "Password doesn't match";
     $("#alertSpanPassword").style.color = "red"

   }


 });

 $("#signupPassword").addEventListener("input", async function () {
   if ($('#confirmPassword').value !=""){
   if ($('#confirmPassword').value === $("#signupPassword").value || ($('#confirmPassword').value == "" && $("#signupPassword").value=="")) {
     $("#alertSpanPassword").innerHTML = "";
   } else {
     $("#alertSpanPassword").innerHTML = "Password doesn't match";
     $("#alertSpanPassword").style.color = "red"

   }
  }

 });

 // validate User Email when sign up
   $('#userEmail').addEventListener('input', () => {
   
     const check = validator.isEmail(($('#userEmail').value.trim()) + "")
     if (check || $('#userEmail').value=="") {
       $('#userEmailLabel').innerHTML = ""
       $('#signupSubmit').disabled = false
     } else {
       $('#userEmailLabel').innerHTML = "Enter Valid Email"
       $('#signupSubmit').disabled = true
     }
   })

 }

 // validate user email when subscribe
 if($('#subscriberEmail')){
    $('#subscribeSubmit').disabled = true
    $('#subscriberEmail').addEventListener('input',() => {
        
      const check = validator.isEmail(($('#subscriberEmail').value.trim())+"")
      if (check || $('#subscriberEmail').value=="") {
        $('#subscriberEmailLabel').innerHTML=""
        $('#subscribeSubmit').disabled = false
      }
      else{
        $('#subscriberEmailLabel').innerHTML="Enter Valid Email"
        $('#subscribeSubmit').disabled = true
        }
    })
 }


 //Reset password- compare enter new password and confirm new password
 if ($("#resetConfirmPassword")){
 $("#resetConfirmPassword").addEventListener("input", async function () {
  console.log("hi")
  if ($('#resetConfirmPassword').value === $("#resetNewPassword").value) {
    $("#spanResetConfirmPassword").innerHTML = "";
 } else {
    $("#spanResetConfirmPassword").innerHTML = "Passwords don't match";
    $("#spanResetConfirmPassword").style.color = "red"

  }
})
};



async function fetchAllUsernames() {
  const response = await fetch("./username");
  const allUsernames = await response.json(); 
  return allUsernames;
}
function $(name) {
 return document.querySelector(name)
}

})
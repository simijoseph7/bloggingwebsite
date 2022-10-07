const sendGrid = require('@sendgrid/mail');
const {sign,verify} = require('jsonwebtoken');

// setup sendgrid API_KEY for sending email
sendGrid.setApiKey(process.env.SEND_GRID_API_KEY)

// ===============================================
//      send welcome message for new subscriber
//==============================================


function sendWelcomeMessageToSubscriber(email, name) {
  const subscriberId = emailEncoder(email);
  sendGrid.send({
    to: email,
    from: process.env.SENDER_EMAIL,
    template_id: process.env.SUBSCRIBER_TEMPLATE_ID,
    //  parametrs passed to Send Grid template handlebars
    dynamic_template_data: {
      name: `${name.toUpperCase()}`,
      subject_name: name,
      BASE_URL: `${process.env.BASE_URL}:${process.env.PORT}/`,
      subscriberId:subscriberId
    }


  }).then().catch(e => console.log(e.response.body))
}

// ===============================================
//      send welcome message for new user
//==============================================

function sendWelcomeMessageToNewUser(email, name) {
  sendGrid.send({
    to: email,
    from: process.env.SENDER_EMAIL,
    template_id: process.env.NEW_USER_TEMPLATE_ID,
    dynamic_template_data: {
      name: `${name.toUpperCase()}`,
      subject_name: name,
      BASE_URL: `${process.env.BASE_URL}:${process.env.PORT}/`,
    }
    

  }).then().catch(e => console.log(e.response.body))
}

// ===============================================
//                  send Email for all subscriber 
//==============================================

async function sendEmailForAllSubscriber({allSubscriber,article,category}) {

allSubscriber.forEach(subscriber=>{
  const name = subscriber.fullName;
  const email = subscriber.email
   const subscriberId = emailEncoder(email);
   sendGrid.send({
     to: email,
     from: process.env.SENDER_EMAIL,
     template_id: process.env.NEW_ARTICLE_TEMPLATE,
     //  parametrs passed to Send Grid template handlebars
     dynamic_template_data: {
       name: `${name.toUpperCase()}`,
       subject_name: name,
       BASE_URL: `${process.env.BASE_URL}:${process.env.PORT}/`,
       subscriberId: subscriberId,
       category:category,
       title:article.title,
       content:article.content
     }


   }).then().catch(e => console.log(e.response.body))
})

}


// ===============================================
//                  email decoder 
//==============================================
// this will decode the given jeson webtocken into json object using privaye key 
async function emailDecoder(encodedEmail){
 const decodedEmail = verify(encodedEmail,process.env.JWT_KEY)
 return decodedEmail['email'];
}
// ===============================================
//                  email encoder 
//==============================================
// this will encode the given user enail into json web tocken encoded string using private key
function emailEncoder(userEmail) {
 const encodedEmail = sign({email:userEmail}, process.env.JWT_KEY)
 return encodedEmail;
}

module.exports = {
  sendWelcomeMessageToSubscriber,
  sendWelcomeMessageToNewUser,
  sendEmailForAllSubscriber,
  emailEncoder,
  emailDecoder

}
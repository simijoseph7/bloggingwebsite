const dbPromise = require('./database');
const SQL = require("sql-template-strings");
const {sendWelcomeMessageToSubscriber} = require('../modules/send-email.js');


async function fetchAllCommentByArticleId(id) {
  const db = await dbPromise;
  const result = await db.all(SQL `
select u.userId,u.userName, u.userImage, c.commentId, c.content, c.creationDate
from comments c
join users u on c.userId=u.userId and c.articleId=${id}
`);
  
  return result;
}
//=============================
//    Fetch All Article 
//=============================

async function fetchAllArticle() {
  const db = await dbPromise;
  const result = await db.all(SQL `
select u.fname, u.lname, a.articleId, a.title, a.content, a.creationDate, a.articleImage, c.description, u.userName, u.userImage,u.userId
from articles a 
join users u on a.userId = u.userId
join categories c on a.categoryId = c.categoryId
order by a.creationDate DESC
`);
  
  return result;
}

//=============================
//    Fetch Recent Article 
//=============================

async function fetchRecentArticle() {
  const db = await dbPromise;
  const result = await db.get(SQL `
select u.fname, u.lname, a.articleId, a.title, a.content, a.creationDate, a.articleImage, c.description, u.userName, u.userImage,u.userId
from articles a 
join users u on a.userId = u.userId
join categories c on a.categoryId = c.categoryId
order by a.creationDate DESC
`);

  return result;
}

async function fetchCategoryId(description) {
 const desc = description+""
 const db = await dbPromise;
 const result = await db.all(SQL `select * from categories where "description"=${description};
`)
return result[0].categoryId
}

//==============================

async function fetchArticlesByCategory(category) {
  const categoryId= await fetchCategoryId(category)
 const db = await dbPromise;
const result = await db.all(SQL `
select articles.*,categories.description
from articles 
join categories on categories.categoryId=articles.categoryId
and articles.categoryId = ${categoryId}
order by articles.creationDate DESC; 
`);

  return result;
}

//==============  fetchArticlesByUserId ================

async function fetchArticlesByUserId(userId) {
  
  const db = await dbPromise;
  const result = await db.all(SQL `
select u.fname, u.lname, a.articleId, a.title, a.content, a.creationDate, a.articleImage, u.userName, u.userImage, u.userId,c.description
from users u 
join articles a on a.userId=u.userId and a.userId=${userId}
join categories c on a.categoryId = c.categoryId
order by a.creationDate DESC;
`);
return result;
}

//===============  fetchArticleByArticleId ===============

async function fetchArticleByArticleId(articleId) {

  const db = await dbPromise;
  const result = await db.get(SQL `
select u.fname, u.lname, a.articleId,a.articleImage, a.title, a.content, a.creationDate, a.articleImage, u.userName, u.userImage, u.userId, c.description
from users u 
join articles a on a.userId=u.userId and a.articleId=${articleId}
join categories c on a.categoryId = c.categoryId
order by a.creationDate DESC;
`);
  return result;
}

//===================  fetch subscriber by email  =============================
async function fetchSubscriberByEmail(subscriberEmail){
  const db = await dbPromise;
  // console.log(`select * from subscription where email='${email}'`);
  const email = subscriberEmail+""
  const result= await db.get(SQL `select * from subscription where "email"=${email}`)
  return result
 
}

//===================  fetch subscriber by category  =============================
async function fetchAllSubscriberByCategory(categoryId) {
  const db = await dbPromise;
  const result = await db.all(SQL `
  select s.email,s.fullName
  from subscription s
  join category_subscriber cs on s."email"=cs.email and cs.categoryId=${categoryId}`)
  return result

}

//===================  time display as ... ago   =============================
function displayTime(date) {
  
  const now = new Date();
 
  const year = now.getFullYear() - date.getFullYear();

  if (year > 0)
    return `${year} year${year==1? "":"s"} ago`;

  const month = now.getMonth() - date.getMonth();
  if (month > 0)
    return `${month} month${month == 1 ? "" : "s"} ago`;

  const day = now.getDate() - date.getDate();
  if (day > 0)
    return `${day} day${day == 1 ? "" : "s"} ago`;

  const hour = now.getHours() - date.getHours();
  if (hour > 0)
    return `${hour} hour${hour == 1 ? "" : "s"} ago`;

  const minute = now.getMinutes() - date.getMinutes();
  if (minute > 0)
    return `${minute} minute${minute == 1 ? "" : "s"} ago`;
  return `a few seconds ago`;
}
// create Comments
async function createComment(content,articleId,userId) {
  
  const db = await dbPromise;
  const result = await db.run(SQL `insert into comments (content,creationDate,articleId,userId) values(${content},datetime('now','localtime'),${articleId},${userId})`);
  return result;
}

// deleteComment
async function deleteComment(commentId) {
  const db = await dbPromise;
 const result = await db.run(SQL `
        delete from comments
        where commentId = ${commentId}`);
        
}
// update comment 
async function updateComment(content, commentId) {
  const db = await dbPromise;
  await db.run(SQL `
        update comments
        set content = ${content}, creationDate = datetime('now','localtime')
        where commentId = ${commentId};`);
}


//create Article
const createArticle = async ({ table, object }) => {
  const db = await dbPromise
  const keys = Object.keys(object).join(",");
  const values = Object.values(object)
    .map((v) => `"${v}"`)
    .join(",");
    
  const res = await db.run(`INSERT INTO ${table} (${keys}) VALUES (${values})`);
  object.userId = res.lastID; 

  const allSubscriber = await fetchAllSubscriberByCategory(object['categoryId'])
   return allSubscriber;
};

// create subscription
async function createSubscription (sEmail,name){
 
const db = await dbPromise
const email = sEmail+"";
const fullName = name+"";
const result = await db.run(SQL `insert into subscription values(${email},${fullName});`)
  
  return result;
};
// create category Subscriber
async function updateCategorySubscriber (email,categoryid){
const emailStr=email+"";
const categoryId = categoryid
const db = await dbPromise 
const result = await db.run(SQL `insert into category_subscriber values(${emailStr},${categoryId});`)
return result;
};

async function updateArticle(article) {
  const db = await dbPromise;
 if(article.articleImage){
  return   await db.run(SQL `
        update articles
        set content = ${article.content}, 
        creationDate = datetime('now','localtime'),
        title = ${article.title},
        articleImage = ${article.articleImage}
        where articleId = ${article.articleId};`)
 }else{
 return    await db.run(SQL `
        update articles
        set content = ${article.content}, 
        creationDate = datetime('now','localtime'),
        title = ${article.title}
        where articleId = ${article.articleId};`)
 }
}

//  delete Article 
async function deleteArticle(articleId) {
  
  const db = await dbPromise;
  const result = await db.run(SQL `
  delete from articles
        where articleId = ${articleId}`);

}

// =============================================
//          create subscription
// =============================================
  
const createCategorySubscription = async (subscription,callback) => {
  const category = subscription.category;
  const email = subscription.email;
  const fullName = subscription.fullName;
  const favCategory = category === undefined ? undefined :
  Array.isArray(category) ? category : [category];
 if(!favCategory){
    callback("Select at least one category!", undefined)
    return;
 }
      
    if(await fetchSubscriberByEmail(email)){
       await updateSubscription(email,fullName)
       favCategory.forEach(async cat =>{  

         const categoryId = await fetchCategoryId(cat) 
         await updateCategorySubscriber(email,categoryId)

        })
        callback(undefined, "Your subscription has been updated!") 
        
      }
      else{
         await createSubscription(email,fullName);
         favCategory.forEach(async cat=>{

              const categoryId = await fetchCategoryId(cat)
              const catSub = {email,categoryId}
              await updateCategorySubscriber(email,categoryId)
              
            })
            sendWelcomeMessageToSubscriber(email, fullName)
            callback(undefined, " You are successfully subscribed!")
      
        }
      
 
}

// =============================================
//          update subscription
// =============================================


async function updateSubscription(emailAdd,name) {
  const email=emailAdd+"";
  const db = await dbPromise;
  const result =await db.run(SQL `delete from subscription where "email" =${email};`)
  await createSubscription(emailAdd,name)
}
async function deleteSubscription(emailAddress) {
  const email = emailAddress + "";
  const name= (await fetchSubscriberByEmail(emailAddress)).fullName
  const db = await dbPromise;
  const result = await db.run(SQL `delete from subscription where "email" =${email};`)
  return name;
}

// =============================================
//retrieves  articles which match the searched keywords
// =============================================
async function retrieveArticlesBySearch(searchType1, searchType2, searchType3){
  const db = await dbPromise;
  const articlesBySearch = await db.all(SQL`SELECT u.fname,u.lname, a.content, a.title, a.creationDate , u.userName, a.articleImage, c.description, a.articleId, u.userImage, u.userId
  FROM articles AS a, users AS u, categories AS c
  WHERE u.userId= a.userId 
  AND a.categoryId= c.categoryId
  AND  (a.content LIKE ${searchType1} OR a.title LIKE ${searchType1} OR a.content LIKE ${searchType2} OR a.title LIKE ${searchType2} OR a.content LIKE ${searchType3} OR a.title LIKE ${searchType3})`);
  return articlesBySearch;
}

// =============================================
//retrieves the articles by category
// =============================================
async function retrieveArticlesByCategory(category){
  const db = await dbPromise;
  const articlesByCategory = await db.all(SQL `SELECT u.fname, u.lname, a.content, a.title, a.creationDate , u.userName, a.articleImage, c.description, a.articleId, u.userImage, u.userId
  FROM articles AS a, users AS u, categories AS c
  WHERE a.categoryId= c.categoryId
  AND u.userId= a.userId
  AND c.description= ${category}`);
  return articlesByCategory;
}


module.exports={
  fetchAllCommentByArticleId, 
  fetchAllArticle,
  displayTime,
  fetchCategoryId,
  fetchArticlesByCategory,
  fetchArticlesByUserId,
  fetchArticleByArticleId,
  createComment,
  deleteComment,
  updateComment,
  createArticle,
  updateArticle,
  deleteArticle,
  createCategorySubscription,
  deleteSubscription,
  retrieveArticlesBySearch,
  retrieveArticlesByCategory,
  fetchRecentArticle

};

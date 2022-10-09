const {retrieveUserWithAuthToken} = require("../modules/user-dao.js");
const {
    fetchAllCommentByArticleId,
    fetchAllArticle,
    displayTime,
    fetchArticlesByCategory,
    fetchRecentArticle
} = require("../modules/articles-dao.js.js");


async function addUserToLocals(req, res, next) {
const user = await retrieveUserWithAuthToken(req.cookies.authToken);
  res.locals.user = user;
  next();
}

async function verifyAuthenticated(req, res, next) {
    //if there is a user
    //GO TO NEXT CODE?
    if (res.locals.user) {
        next();
    }
    //if there is  no user then
    else {
        //get recentArticle
          const recentArticle = await fetchRecentArticle()
          //get all articles
         const articles = await fetchAllArticle();
         //if there are articles then:
         if (articles) {
             //loop through each article and
             articles.forEach(async article => {
                 //1. creat creationDate of article corressponidng to database using Date constructor
                 article.creationDate = displayTime(new Date(article.creationDate))
                 //2. get all comments on the article
                 const allComments = await fetchAllCommentByArticleId(article.articleId)
                 //if comments array is not null then
                 if (allComments != []) {
                     //loop through each comment and then
                     allComments.forEach(comment => {
                         //1.creat creationDate of comment and display it
                         comment.creationDate = displayTime(new Date(comment.creationDate))
                     })
                     article.comments = allComments;
                     article.commentsCount = allComments.length;  
                 }
             })

             
             res.locals.allArticles = articles;

         }
         if (recentArticle) {
             recentArticle.content = (recentArticle.content+"").substring(0,200)
             
             recentArticle.creationDate = displayTime(new Date(recentArticle.creationDate))
             res.locals.recentPost = recentArticle;

         }
         res.render("home")
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
}

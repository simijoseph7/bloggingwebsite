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
    if (res.locals.user) {
        next();
    }
    else {
          const recentArticle = await fetchRecentArticle()
         const articles = await fetchAllArticle();
         if (articles) {
             articles.forEach(async article => {
                 article.creationDate = displayTime(new Date(article.creationDate))
                 const allComments = await fetchAllCommentByArticleId(article.articleId)
                 if (allComments != []) {
                     allComments.forEach(comment => {
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

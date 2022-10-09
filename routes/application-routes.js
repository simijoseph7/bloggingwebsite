const express = require("express");
const router = express.Router();

const {
    fetchAllCommentByArticleId,
    fetchAllArticle,
    displayTime,
    fetchArticlesByCategory,
    fetchRecentArticle
} = require("../modules/articles-dao.js.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const {retrieveUserById} = require("../modules/user-dao.js")

// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/", verifyAuthenticated, async(req, res) =>{
    const user = res.locals.user;
    
    res.locals.user= await retrieveUserById(user.userId)
     const recentArticle = await fetchRecentArticle()
     
     const articles = await fetchAllArticle();
     if (articles) {
         articles.forEach(async article => {
                article.creationDate = displayTime(new Date(article.creationDate))
             const allComments = await fetchAllCommentByArticleId(article.articleId)
             if (allComments != []) {
                 allComments.forEach(comment => {
                     comment.creationDate = displayTime(new Date(comment.creationDate))
                     comment.owner = comment.userId === user.userId?true:false;
                     comment.author = comment.userId === article.userId?true:false;
                    
                })
                 article.comments = allComments;
                 article.commentsCount= allComments.length
                 res.locals.user=user;
                

             }
         })


         res.locals.allArticles = articles;

     }
      
     if (recentArticle){
         recentArticle.content = (recentArticle.content).substring(0, 200)
         recentArticle.creationDate = displayTime(new Date(recentArticle.creationDate))
         res.locals.recentPost=recentArticle;
       
     }
     
    res.render("home");
}); 
 


module.exports = router;

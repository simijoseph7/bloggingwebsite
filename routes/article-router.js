const express = require("express");
const articleRouter = express.Router();
const upload = require("../middleware/multer-uploader.js");
const fs = require("fs");
const jimp = require("jimp");
const {
  fetchAllCommentByArticleId,
  fetchAllArticle,
  fetchCategoryId,
  displayTime,
  fetchArticlesByCategory,
  fetchArticleByArticleId,
  fetchArticlesByUserId,
  createComment,
  updateComment,
  createArticle,
  updateArticle,
  deleteArticle,
  deleteComment,
  createCategorySubscription,
  deleteSubscription,
  retrieveArticlesBySearch,
  retrieveArticlesByCategory,
  fetchRecentArticle

} = require("../modules/articles-dao.js");
const {retrieveUserById} = require('../modules/user-dao.js')
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const {emailEncoder,emailDecoder,sendEmailForAllSubscriber} = require('../modules/send-email.js')

// =============================================
//            Comments By ID
// =============================================
articleRouter.get('/comment/:id', async (req, res) => {
  const result = await fetchAllCommentByArticleId(req.params.id)
  res.send(result)
})

// =============================================
//          render create article page
// =============================================

   articleRouter.get('/createArticle', verifyAuthenticated, async (req, res) => {
     res.render(`createarticle`)
   }) 

   // =============================================
   //          render update article page
   // =============================================

 articleRouter.get('/updateArticle', verifyAuthenticated, async (req, res) => {
      const articleId = req.query.articleId;
      const articleToBeEdited= await fetchArticleByArticleId(articleId);
       res.locals.article = articleToBeEdited;
     
      res.render(`editarticle`)
    })

     // =============================================
     // create  article 
     // =============================================
   articleRouter.post('/createArticle', upload.single("articleImage"), async (req, res) => {
      const fileInfo = req.file;
      const oldFileName = fileInfo.path;
      const newFileName = `./public/images/articleImages/${fileInfo.originalname}`;
      fs.renameSync(oldFileName, newFileName);
      const image = await jimp.read(newFileName)
      image.resize(300, jimp.AUTO)
      await image.write(newFileName)
      const article = { 
      userId:res.locals.user.userId,
      title: req.body.articleTitle, 
      content: req.body.articleContent,
      articleImage: fileInfo.originalname,  
      categoryId: await  fetchCategoryId(req.body.category),
      creationDate:new Date() 
      }
      const allSubscriber= await createArticle({table:'articles',object:article})
      
      await sendEmailForAllSubscriber({allSubscriber,article,category:req.body.category});
      res.redirect("./")
   })


     // =============================================
     // update article 
     // =============================================
     articleRouter.post('/updateArticle', upload.single("articleImage"), async (req, res) => {
      
       
       const article = {
         title: req.body.articleTitle,
         articleId:req.body.articleId,
         content: req.body.articleContent,
        }
     
       if(req.file){
         const fileInfo = req.file;
         const oldFileName = fileInfo.path;
         const newFileName = `./public/images/articleImages/${fileInfo.originalname}`;
         fs.renameSync(oldFileName, newFileName);
         const image = await jimp.read(newFileName)
         image.resize(300, jimp.AUTO)
         await image.write(newFileName);
         article.articleImage = fileInfo.originalname
       }
         
       await updateArticle(article)
       res.redirect("./userArticles")
     })

   articleRouter.delete('/delete',(req,res) => {
    res.send(12)
   })


// =============================================
//           render all user Articles
// =============================================
 articleRouter.get('/userArticles',async(req,res) => {
   const user = res.locals.user;
   const userId = res.locals.user.userId;
   const articles = await fetchArticlesByUserId(userId);
   if (articles) {
     articles.forEach(async article => {
       article.creationDate = displayTime(new Date(article.creationDate))
       const allComments = await fetchAllCommentByArticleId(article.articleId)
       if (allComments != []) {
         allComments.forEach(comment => {
           comment.creationDate = displayTime(new Date(comment.creationDate))
           comment.owner = comment.userId === user.userId ? true : false;
           comment.author = comment.userId === article.userId ? true : false;

         })
         article.comments = allComments;
         article.commentsCount = allComments.length
         res.locals.user = user;


       }
     })

    res.locals.allArticles = articles;

   }


   res.render("userarticles");

 })

// =============================================
//          Create Comment and update comment
// =============================================

articleRouter.get('/createComment', verifyAuthenticated, async (req, res) => {
  
  if (Object.keys(req.query)[0].includes("content_")){
  const articleId =  Object.keys(req.query)[0].split("content_")[1]
  const content =  Object.values(req.query)[0]
  const userId = res.locals.user.userId;
  await createComment(content, articleId,userId)
} else {
  const commentId = Object.keys(req.query)[0].split("commentId_")[1]
  const content = Object.values(req.query)[0]
  await updateComment(content, commentId)
}
  res.redirect('./')
})

// =============================================
//          delete Comment
// =============================================

articleRouter.get('/deleteComment', verifyAuthenticated, async (req, res) => {
  const commentId = req.query.commentId
  await deleteComment(commentId)
  res.redirect(`./`)
})


// =============================================
//          delete article
// ============================================
articleRouter.get('/deleteArticle', verifyAuthenticated, async (req, res) => {
  
  const articleId = req.query.articleId
  const result = await deleteArticle(articleId)
  res.redirect(`./userArticles`)

})

// =============================================
//          Create Subscription
// =============================================
articleRouter.post('/createSubscription',async(req,res) => {
   const fullName= req.body.fullName;
   const email = req.body.email;
   const category = req.body.category;
   const subscription = {fullName,email,category}
   await createCategorySubscription(subscription, (err, result) => {
     if(err){
        res.setToastMessage(err)
        res.redirect('./')
     }else{
       
        res.setToastMessage(result)
        res.redirect('./')
     }
   })
 
 
})

// =============================================
//          Delete Subscription
// =============================================

articleRouter.get('/unsubscribe/:subscriberId',async (req,res)=>{
  
  const userEmail = await emailDecoder(req.params.subscriberId);
  const userName = (await deleteSubscription(userEmail)).toUpperCase();
  res.send(`<div style="text-align:center ;background-color:#232323;color:#efefef;width:100vw;height:100vh; margin:auto"><h1 style="padding-top:200px;"> We are really sorry to see you go, ${userName}! </h1>
              <h2> You have successfully unsubscribed to our blog. </h2>
              <p style="color:red"> You will no longer receive email alerts for new articles.</p>
              <p>Cheers, The Harlequin Team </p>
              </div>`)
})


// =============================================
//           Search for Articles
// =============================================

//post request to "/searchResults" and render "search" view
articleRouter.post("/searchResults", async function(req, res) {
  const user = res.locals.user;
  res.locals.title = "SearchResults";

  const searchType1= req.body.search;
  res.locals.search= searchType1;
  const searchType2= '%'+`${searchType1}`+' %';
  const searchType3= '%'+`${searchType1}`+'.%';
  //get all articles matchingy the searched keywords
  const articles= await retrieveArticlesBySearch(searchType1, searchType2, searchType3);

  const recentArticle = await fetchRecentArticle()
   

   if (articles) {
     articles.forEach(async article => {
       article.creationDate = displayTime(new Date(article.creationDate))
       const allComments = await fetchAllCommentByArticleId(article.articleId)
       if (allComments != []) {
         allComments.forEach(comment => {
           comment.creationDate = displayTime(new Date(comment.creationDate))
           if(user){
             comment.owner = comment.userId === user.userId ? true : false;
           }
           comment.author = comment.userId === article.userId ? true : false;

         })
         article.comments = allComments;
         article.commentsCount = allComments.length
         res.locals.user = user;


       }
     })

    res.locals.allArticles = articles;

   }
    if (recentArticle) {
      recentArticle.content = (recentArticle.content).substring(0, 200)
      recentArticle.creationDate = displayTime(new Date(recentArticle.creationDate))
      res.locals.recentPost = recentArticle;

    }

   res.render("search");

});


//=============================================
//   article by Category 
// =============================================

articleRouter.get('/category', async (req, res) => {
  const user = res.locals.user;
  const category= req.query.category;
  res.locals.title = category;
  const articles = await retrieveArticlesByCategory(category)

   const recentArticle = await fetchRecentArticle()

 if (articles) {
  articles.forEach(async article => {
    article.creationDate = displayTime(new Date(article.creationDate))
    const allComments = await fetchAllCommentByArticleId(article.articleId)
    if (allComments != []) {
      allComments.forEach(comment => {
        comment.creationDate = displayTime(new Date(comment.creationDate))
        if(user){
          comment.owner = comment.userId === user.userId ? true : false;
        }
        comment.author = comment.userId === article.userId ? true : false;
      })
      article.comments = allComments;
      article.commentsCount = allComments.length
      res.locals.user = user;
    }
  })
  
 res.locals.allArticles = articles;
}
  
  if (recentArticle) {
    recentArticle.content = (recentArticle.content).substring(0, 200)
    recentArticle.creationDate = displayTime(new Date(recentArticle.creationDate))
    res.locals.recentPost = recentArticle;

  }
res.render("home");
})


//=============================================
//   about author 
// =============================================

articleRouter.get('/aboutme',async(req,res) => {
  const userId = req.query.userId
  const user = await retrieveUserById(userId)
  res.locals.aboutme = user;
  const recentArticle = await fetchRecentArticle()
  const articles = await fetchArticlesByUserId(userId);
  if (articles) {
    articles.forEach(async article => {
      article.creationDate = displayTime(new Date(article.creationDate))
      const allComments = await fetchAllCommentByArticleId(article.articleId)
      if (allComments != []) {
        allComments.forEach(comment => {
          comment.creationDate = displayTime(new Date(comment.creationDate))
          comment.owner = comment.userId === user.userId ? true : false;
          comment.author = comment.userId === article.userId ? true : false;

        })
        article.comments = allComments;
        article.commentsCount = allComments.length
        res.locals.user = user;


      }
    })

    res.locals.allArticles = articles;

  }


  if (recentArticle) {
    recentArticle.content = (recentArticle.content).substring(0, 200)
    recentArticle.creationDate = displayTime(new Date(recentArticle.creationDate))
    res.locals.recentPost = recentArticle;

  }
  res.render("home")

})


module.exports = articleRouter;

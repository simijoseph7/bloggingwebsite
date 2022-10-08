window.addEventListener('DOMContentLoaded', (params) => {
  configCommentElements()
  if ($('#articleImageDiv')) {
    configCreateArticlePage()
    
  }
   if ($('#editArticleImageDiv')) {
     configEditArticlePage()

   }

  // for Comment box 
  function configCommentElements() {
    
    $$('.addComment').forEach((btn) => {
      
      const index = btn.dataset.index;
      if ($( `.allCommentBox_${index}`)) {
    $(`.allCommentBox_${index}`).classList.add("visible")


   $(`#commentForm_${index}`).addEventListener('submit', (e) => {
     e.preventDefault()
   })


   btn.addEventListener("click", async e => {

     $(`.allCommentBox_${index}`).classList.toggle("visible")
     $(`.tinyBox_${index}`).classList.remove("visible")

   }, true)
   //====================================

   $(`.postComment_${index}`).addEventListener("click", async (e) => {

     $(`#commentForm_${index}`).submit();


     const userName = e.target.dataset.username
     const userImage = e.target.dataset.userimage
     const commentId = e.target.dataset.commentid
     const articleId = index
     
     const tinyContent = tinymce.get(`myCommentTinymce_${index}`).getContent()
     const comment = {
       commentId,
       articleId,
       userName,
       creationDate: new Date(),
       content: tinyContent,
       userImage
     }
     const commentDiv = createComment(comment)
     

     //  $(`.mainArticle_${index}`).innerHTML += commentDiv
     $(`.commentsList_${index}`).innerHTML += commentDiv
     $(`.commentsList_${index}`).dataset.isempty = 1;
     // show($(`.addComment_${index}`))

     $(`.tinyBox_${index}`).classList.remove("visible")
     tinymce.get(`myCommentTinymce_${index}`).setContent("<p></p>")
     show($(`.allCommentBox_${index}`))
     $(`.allCommentBox_${index}`).classList.toggle("visible")

     // reset button name back to add Comment and resetattribute of tinymce
     tinymce.get(`myCommentTinymce_${index}`).getElement().setAttribute("name", `content_${index}`)
     $(`.postComment_${index}`).innerHTML = "Add Comment"




   }, false)
   //=[===================================]
   $(`.cancelComment_${index}`).addEventListener('click', () => {
     // hide($(`.tinyBox_${index}`))
     $(`.tinyBox_${index}`).classList.add("visible")
     // show($(`.addComment_${index}`))
     tinymce.get(`myCommentTinymce_${index}`).setContent("")
     $(`.allCommentBox_${index}`).classList.toggle("visible")
    })
  
   //=============================================================================

    }
 })

    
    // add event litener for edit link
    
    $$('.commentBox').forEach(box=>{
      const index = box.dataset.commentid;
      if ($(`.editComment_${index}`)){
        $(`.editComment_${index}`).addEventListener('click',(e) => {
         const content = e.target.dataset.content;
         const tinyBoxId= e.target.dataset.tinybox;

        $(`.tinyBox_${tinyBoxId}`).classList.remove("visible");
        tinymce.get(`myCommentTinymce_${tinyBoxId}`).setContent(content);
  
        tinymce.get(`myCommentTinymce_${tinyBoxId}`).getElement().setAttribute("name",`commentId_${index}`)
        $(`.postComment_${tinyBoxId}`).innerHTML="Update";
        $(`.postComment_${tinyBoxId}`).setAttribute("data-commentid",index)
        
  
  
        })
      }
     })

     $$('.articleDiv').forEach(box => {
       const index = box.dataset.articleid;
       if ($(`.editArticle_${index}`)) {
         $(`.editArticle_${index}`).addEventListener('click', (e) => {
           const content = e.target.dataset.content;
           const tinyBoxId = e.target.dataset.tinybox;
           console.log(content);
           $(`#btnAddTitle`).style.backgroundColor="red"
          //  $(`.tinyBox_${tinyBoxId}`).classList.remove("visible");
          //  tinymce.get(`myCommentTinymce_${tinyBoxId}`).setContent(content);

          //  tinymce.get(`myCommentTinymce_${tinyBoxId}`).getElement().setAttribute("name", `commentId_${index}`)
          //  $(`.postComment_${tinyBoxId}`).innerHTML = "Update"
             

         })
       }
     })

   }

  //================================
  function createComment(comment) {
 
    const commentDiv = `
     <div class = "left-margin  commentBox" >
      <img class="commentImage" src=./images/thumbnails/${comment.userImage} width="64px">
      <div class="commentContent">
      <p> <strong > ${comment.userName} </strong> | <span><em>${displayTime(new Date(comment.creationDate))}</em > </span > </p >
       ${comment.content}
      
			</div>
     <a class="collapsible editDelete editDelete_${comment.commentId}" data-index=${comment.commentId}><ion-icon size="large" name="more"></ion-icon></a>
       <ul class="lsn editDeleteOpt editDeleteOptions_${comment.commentId}">
      <li><a class="tdn editComment_${comment.commentId}" data-content='${comment.content}'
      data-tinybox=${comment.articleId}>Edit</a> </li>
      <li><a class="tdn" href="./deleteComment?commentId=${comment.commentId}">Delete</a></li>
     </ul>
      </div>
      <hr>

     `
    return commentDiv
  }
  //  config create-article page
  function configCreateArticlePage(){

     const addTitle = $('#btnAddTitle')
     const articleTitle = $('#articleTitle');
     const articleTitleLabel = $('#articleTitleLabel')
     const addContent = $('#btnAddContent')
     const myArticleTinymce = $('#myArticleTinymce');
     const addImage = $('#btnAddImage')
     const articleImageDiv = $('#articleImageDiv')
     const articleImage = $('#articleImage')
     const uploadedImage = $('#uploadedImage')
     
     resetArticleCreater();

     addTitle.addEventListener("click", (e) => {
       e.target.style.display = "none"
       articleTitle.style.display = "block"
       articleTitleLabel.style.display = "block"
       addContent.style.display = "block"
     })
     addContent.addEventListener("click", (e) => {
       e.target.style.display = "none"
       tinymce.get("myArticleTinymce").show()
       addImage.style.display = "block"

     })
     addImage.addEventListener("click", (e) => {
       e.target.style.display = "none"
       articleImageDiv.style.display = "block"

       //  articleSubmit.style.display="block"

     })

       // =============================================
       //   reset article page
       // =============================================

   
       articleImage.addEventListener("change", function () {
       uploadedImage.style.display = "block"
       const im = document.createElement("img")
       im.src = window.URL.createObjectURL(this.files[0])
       uploadedImage.innerHTML = `<img width="100%" src=${window.URL.createObjectURL(this.files[0])}>`

     })
    function resetArticleCreater() {
      //  tinymce.get("myArticleTinymce").hide()
      myArticleTinymce.style.display = "none"
      articleTitle.style.display = "none"
      articleImageDiv.style.display = "none"
      articleImage.style.opacity = 0
      uploadedImage.style.display = "none"
      articleTitleLabel.style.display = "none"
      articleTitleLabel.style.display = "none"
      addContent.style.display = "none"
      addImage.style.display = "none"
    }
  }
// config edit article page 
function configEditArticlePage() {

  $('#editArticleImage').style.opacity="0";
  $('#editArticleImage').addEventListener("change", function () {
    $('#uploadedImage').style.display = "block"
    const im = document.createElement("img")
    im.src = window.URL.createObjectURL(this.files[0])
    $('#uploadedImage').innerHTML = `<img width="100%" src=${window.URL.createObjectURL(this.files[0])}>`

  })
// $('#editArticleCancel').addEventListener("click", function (e) {
//   // location.href("/userArticles")
// })

}


 

  // =============================================
  // time display 
  // =============================================

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
 
  // =============================================
  // helper functions 
  // =============================================
  
  function $$(name) {
    return document.querySelectorAll(name)
  }

  function $(name) {

    return document.querySelector(name)
  }

  
  function show(name) {
    name.style.display = "block"
  }
  function hide(name) {
    name.style.display = "none"
  }

 
  

})





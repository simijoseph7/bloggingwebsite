window.addEventListener('click',() => {
 
//   config collapsible profile

 if ($("#collapsible")){

   $("#collapsible").addEventListener("click", function (e) {
  // this.classList.toggle("active");
   
  const tobeCollapsed = $("#profileOptions");
  if (tobeCollapsed.style.display === "flex") {
    tobeCollapsed.style.display = "none";
  } else {
    tobeCollapsed.style.display = "flex";
  }

   
   })
 
}
//   config edit delete opt for comment

 if ($$('.editDelete')){
    
     $$('.editDelete').forEach(ed => {
     const index = ed.dataset.index
    
   $(`.editDeleteOptions_${index}`).classList.add("visible");
   
   $(`.editDelete_${index}`).addEventListener("click", function () {
     const tobeCollapsed = $(`.editDeleteOptions_${index}`);
     
     // $(`.editDeleteOptions_${index}`).classList.toggle("visible");
       
       if (tobeCollapsed.style.display == "block") {
         tobeCollapsed.style.display = "none";
       } else {
         tobeCollapsed.style.display = "block";
       }
   
     })
  
    
    })
 }

//   config edit delete opt for article
 if ($$('.articleDiv')) {
   
   $$('.articleDiv').forEach(ed => {
     const index = ed.dataset.index;
    $(`.editDeleteArticleOptions_${index}`).classList.add("editDeleteVisible");

     $(`.editDeleteArticle_${index}`).addEventListener("click", function () {
       const tobeCollapsed = $(`.editDeleteArticleOptions_${index}`);

       $(`.editDeleteArticleOptions_${index}`).classList.toggle("visible");

       if (tobeCollapsed.style.display == "block") {
         tobeCollapsed.style.display = "none";
       } else {
         tobeCollapsed.style.display = "block";
       }

     },true)
     $(`.deleteArticle_${index}`).addEventListener('click',function(e)  {
      e.preventDefault();
      var result = confirm("Are you sure you want to delete this article?");
      if (result) {
       window.location.href= this.getAttribute('href')
      }
     })

   })
 }


   function $$(name) {
     return document.querySelectorAll(name)
   }

   function $(name) {

     return document.querySelector(name)
   }
})


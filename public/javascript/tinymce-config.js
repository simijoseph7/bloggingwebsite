window.addEventListener("load",()=>{
  // configure tinymce editor for article post
  tinymce.init({
    
    height: 300,
    width:"100%",
   
    selector: 'textarea#myArticleTinymce', 
     toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
     plugins: 'print preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image code link media template codesample table charmap hr pagebreak nonbreaking anchor  insertdatetime advlist lists wordcount  textpattern help',
    
    
  });


   // configuring tinymce editor for Commentts
   document.querySelectorAll(".myCommentTinymce").forEach((tiny, index) => {
     
     tinymce.init({

       height: 200,
       width: "100%",
       content_style: "p { margin:1px 0;}",
       selector: `textarea#${tiny.id}`, // change this value according to the HTML
       // toolbar: 'undo redo | image |link | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent',
       toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
       plugins: 'print preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image code link media template codesample table charmap hr pagebreak nonbreaking anchor  insertdatetime advlist lists wordcount  textpattern help',


     });

   })
  //  document.querySelectorAll(".myReplyCommentTinymce").forEach((tiny, index) => {
  //    console.log('tiny', tiny.id)
     
  //    tinymce.init({

  //      height: 200,
  //      width: "100%",
  //      content_style: "p { margin:1px 0;}",
  //      selector: `textarea#${tiny.id}`, // change this value according to the HTML
  //      // toolbar: 'undo redo | image |link | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent',
  //      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
  //      plugins: 'print preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image code link media template codesample table charmap hr pagebreak nonbreaking anchor  insertdatetime advlist lists wordcount  textpattern help',


  //    });

  //  })

})

// myReplyCommentTinymce_
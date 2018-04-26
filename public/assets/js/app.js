// Grab the articles as a json


$(document).on("click", "#searchSubmit", function() {
  $('html, body').animate({
    scrollTop: $("#dressView").offset().top
}, 2000);


   $.getJSON("/scrape", function(data) {
   // For each one
   for (var i = 0; i < data.length; i++) {
     // Display the apropos information on the page
     $("#articles").append("<div class='card mb-4'><div class='view overlay'><a href='/details/"+data[i]._id+"'><img src='" + data[i].link + "' class='card-img-top dress-preview' data-id='" + data[i]._id + "'alt='dress'/></a></div><a class='btn-floating btn-action ml-auto mr-4 mdb-color lighten-3 waves-effect waves-light right save-dress'data-id=" +data[i]._id +"><i class='fa fa-chevron-right pl-1'></i></a><div class='card-body'><h4 class='card-title'>"+data[i].style +"</h4><hr><p class='font-small grey-dark-text mb-0'>"+data[i].details+"</p></div></div></div>");}
 });

  
 });



 $(document).on('click', '.save-dress', function () {
   // Grab the id associated with the article from the submit button
   var thisId = $(this).attr("data-id");
   console.log(thisId);
   // Run a POST request to change the note, using what's entered in the inputs
   $.ajax({
     method: "POST",
     url: "/save/" + thisId,
   })
     // With that done
     .then(function(data) {
       toastr.options = {
         "positionClass": "toast-bottom-full-width",
         "closeButton": true,
       }


    toastr["info"]("Dress Saved!")

       // $('.modal-body').text(data);
       //        $('#saved-dress').show('fade');
       console.log(data);
       // Empty the notes section

     });

 });

     $('#saveNote').on('click', function() {
       event.preventDefault();
       console.log("clicked");
         var id = $(this).val();
        var note = $("#addNote").val().trim();
       console.log(id + "  "+ note);
         $.ajax({  
         method: "POST",
          url: "/note/" + id,
          data: {body: note}
          }).then(function(data) {
           
              $("#dress-notes").append("<li>"+ data + "</li>")
        
            console.log(data);
            toastr.options = {
              "positionClass": "toast-bottom-full-width",
              "closeButton": true,
            }
            toastr["info"]("Note Saved!")
          });

 });


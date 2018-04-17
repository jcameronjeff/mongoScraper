// Grab the articles as a json


$(document).on("click", "#searchSubmit", function() {
   $.getJSON("/scrape", function(data) {
   // For each one
   for (var i = 0; i < data.length; i++) {
     // Display the apropos information on the page
     $("#articles").append("<div class='col-lg-4 col-md-12 mb-4'><div class='card'><div class='view overlay'><img src='" + data[i].link + "'class='img-fluid' alt='dress' /><a><div class='mask rgba-white-slight waves-effect waves-light'></div><a class='btn-floating btn-action ml-auto mr-4 mdb-color lighten-3 waves-effect waves-light right save-dress' data-id=" + data[i]._id + "><i class='fa fa-chevron-right pl-1'></i></a><div class='card-body'><h4 class='card-title'>"+data[i].title+"</h4><h4 class='card-title'>"+data[i].style+"</h4><hr><p class='font-small grey-dark-text mb-0'>" +data[i].details+"</p></div></div></div>");

   }
 });
 });


 // $(document).on('click', '.dress-preview', function () {
 //   // Grab the id associated with the article from the submit button
 //   var thisId = $(this).attr("data-id");
 //
 //   // Run a POST request to change the note, using what's entered in the inputs
 //   $.ajax({
 //     method: "GET",
 //     url: "/details/" + thisId,
 //   });
 //
 // });


 $(document).on('click', '.save-dress', function () {
   // Grab the id associated with the article from the submit button
   var thisId = $(this).attr("data-id");

   // Run a POST request to change the note, using what's entered in the inputs
   $.ajax({
     method: "POST",
     url: "/save/" + thisId,
   })
     // With that done
     .then(function(data) {
       toastr.options = {
         "positionClass": "toast-top-full-width",
       }
    toastr["success"]("Dress Saved!")

       // $('.modal-body').text(data);
       //        $('#saved-dress').show('fade');
       console.log(data);
       // Empty the notes section

     });

 });

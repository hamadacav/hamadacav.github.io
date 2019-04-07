$(document).ready(function(){
    $('#file').on('change', function(){
  
        var tmppath = URL.createObjectURL($('#file')[0].files[0]);
        $("#imgCont").fadeIn("fast").attr('src',tmppath);  


      var fd = new FormData();
      var files = $('#file')[0].files[0];
      fd.append('file',files);
  
      // AJAX request
      $.ajax({
        url: 'upload.php',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response){
          if(response != 0){
            // Show image preview
            $('#preview').append("<img src='"+response+"' width='100' height='100' style='display: inline-block;'>");
          }else{
            alert('file not uploaded');
          }
        }
      });
    });
  });
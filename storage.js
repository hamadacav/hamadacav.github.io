(function ($) {
  // firestore ref
  var db;
  var storageService;
  var storageRef;
  var clickedBefore=false;
   formData={};
  formData["images"]={};

  // auth and setup event handlers
  var init = function () {
      auth();

      $('#ContactTable').on('click', 'button.edit', edit);
      $('#ContactTable').on('click', 'button.remove', remove);
      $('#ContactAdd').click(add);
      $('#ContactForm').submit(save);

      $("#img1-picker").change( function(event) {
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $("#img1").attr('src',URL.createObjectURL(event.target.files[0]));

        formData["images"][0]=event.target.files[0];

    });
    
    $('#img2-picker').change( function(event) {
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $("#img2").attr('src',URL.createObjectURL(event.target.files[0]));
        formData["images"][1]=event.target.files[0];
    });
    
    $('#img3-picker').change( function(event) {
        console.log(event.target.files);
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $("#img3").attr('src',URL.createObjectURL(event.target.files[0]));
        formData["images"][3]=event.target.files[0];
        
        handleFileUploadSubmit(event.target.files[0]);
    });

    
  };

  // init on doc ready
  $(document).ready(init);


  // sign-in anonymously
  var auth = function () {
      firebase.auth().signInAnonymously()
      .then(function (result) {
   db = firebase.firestore();
   db.settings({ timestampsInSnapshots: true });

    storageService = firebase.storage();
    storageRef = storageService.ref();

   list();


      })
      .catch(function (error) {
   alert("failed to anonymously sign-in");
      });

  };


  var listTempTr;
  // load list
  var list = function () {
      var tblBody = $('#ContactTable > tbody');
      //remove any data rows
      tblBody.find('tr.data').remove();
      //get template row
      var tempTr = tblBody.find('tr.data-temp').removeClass('data-temp').addClass('data').remove();
      if (tempTr.length) {
          listTempTr = tempTr;
      } else {
          tempTr = listTempTr;
      }

      // get collection of Contacts
      db.collection("contacts").get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
              // clone template row and append to table body
              //var tr = tempTr.clone();

          });
      });


  };

  // on remove
  var remove = function (e) {
      e.preventDefault();
      var id = $(this).parents('tr:first').data('id');
      db.collection("contacts").doc(id).delete().then(function () {
          // reload list
          list();
      })
      .catch(function (error) {
   alert("failed to remove contact");
      });
  };

  // on add
  var add = function (e) {
      e.preventDefault();
      open('');
  };

  // on edit
  var edit = function (e) {
      e.preventDefault();
      var id = $(this).parents('tr:first').data('id');
      open(id);
  };

  // open form modal
  var open = function (id) {
      var modal = $('#ContactModal');
      $(".modal-title").text("");
      $(".modal-title").css("display","none");
      // set current Contact id
      modal.data('id', id);
      // reset all inputs
      modal.find('input').val('');
      if(modal.modal){
          modal.modal('show');
      }

      if (!id) return;

      // get Contact to edit
      db.collection("contacts").doc(id).get().then(function (doc) {
          if (doc.exists) {
              var data = doc.data();
              //set form inputs from Contact data
              modal.find('input[data-prop]').each(function () {
                  var inp = $(this);
                  inp.val(data[inp.data('prop')] || '');
              });

          } else {
              alert("No such record");
          }
      }).catch(function (error) {
          alert("failed to read contact");
      });
  };

  // update or add
  var save = function (e) {
      e.preventDefault();
      var modal = $('#ContactModal');
      var id = modal.data('id');
      var data = {};
      //read values from form inputs
      modal.find('input[data-prop]').each(function () {
          var inp = $(this);
          data[inp.data('prop')] = inp.val();
      });

      if($('#img1-picker').val()=="" && $('#img2-picker').val()==""  && $('#img3-picker').val()=="" ){
          $(".modal-title").text("يجب ان ترفق صورة واحدة على الاقل");
          $(".modal-title").css("display","block");
          return;
      }

      // update or add
      (id ? db.collection("contacts").doc(id).update(data) : db.collection("contacts").add(data)).then(function (result) {
          // hide modal and reload list
          modal.modal('hide');
          list();
      })
      .catch(function (error) {
   alert("failed to save contact");
      });
  };


  $(".img-picker").click(function(){
      var id=$(this).attr("id");
      var pickerid=id+"-picker";
      $("#"+pickerid).trigger('click');
  });

  function handleFileUploadSubmit(selectedFile) {
    const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    }, (error) => {
      // Handle unsuccessful uploads
      console.log(error);
    }, () => {
       // Do something once upload is complete
       console.log('success');
    });
  }

}(jQuery));
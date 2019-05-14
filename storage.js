(function ($) {
  // firestore ref
  var db;
  var storageService;
  var storageRef;
  var clickedBefore=false;
   formData={};
  formData["images"]={};
  imgUpload=0;
  inProccess=false;


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
        formData["images"][2]=event.target.files[0];
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
      inProccess=false;
      $("#img1").attr("src","assets/images/default.jpg");
      $("#img2").attr("src","assets/images/default.jpg");
      $("#img3").attr("src","assets/images/default.jpg");
      $("#img1-picker").val("");
      $("#img2-picker").val("");
      $("#img3-picker").val("");

      imgUpload=0;
      formData["images"]={};

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

        inProccess=!inProccess;

        if(!inProccess){
            return;
        }
      var data = {};
      data["img1"]="";
      data["img2"]="";
      data["img3"]="";
      data["approved"]="0";
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

      if($("#product_type").val()==""){
        $(".modal-title").text("يجب ان تختار نوع الغرض");
        $(".modal-title").css("display","block");
        return;
      }
      data["type"] = $("#product_type").val();
      // update or add

      Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    
    // Get the size of an object
    var size = Object.size(formData["images"]);

    modal.modal('hide');
    $('.preloader').css("display","block")
    var cnt=0;
      $.each(formData["images"],function(i,v){
          cnt++;
        handleFileUploadSubmit(cnt,size,data,v);
      });
      

      return;
  };


  $(".img-picker").click(function(){
      var id=$(this).attr("id");
      var pickerid=id+"-picker";
      $("#"+pickerid).trigger('click');
  });

  function handleFileUploadSubmit(cnt,size,data,selectedFile) {
    const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    }, (error) => {
      // Handle unsuccessful uploads
      console.log(error);
    }, () => {
       // Do something once upload is complete
       uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        data["img"+cnt]=downloadURL;
        imgUpload++;
        if(imgUpload==size){
            function makeid(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              
                for (var i = 0; i < length; i++)
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
              
                return text;
              }
              var id=makeid(10);
              
              uploadRequest(data);
              return;

            (db.collection("products").add(data)).then(function (result) {
                alert("لقد تم رفع الغرض بنجاح ,شكرًا جزيلًا");
                $('.preloader').css("display","none");
            }).catch(function (error) {
                var txt="لقد حدث خطأ حاول مرة أخرى";
                alert(txt);
                $('.preloader').css("display","none");
            });
        }
      });

    });
  }


    function uploadRequest(data){
        var values = {};
        values["title"] = "كن عونًا";
        values["source"] = "Kun-Awnn";
        values["mailformsource"]="تبرع";
        values["logosrc"]="https://hamadacav.github.io/assets/images/logobordered.png";
        
        values["sender"] = data["name"];
        values["phone"] = data["phone"];
        values["mail"] = data["mail"];
        values["content"] = data["img1"]+"/"+data["img2"]+"/"+data["img3"];
    
        values["subject"] = data["desc"]+" -- "+data["type"];

        var jsonObj=values;
        var api_url="https://dazdev.com/api/v1/sendmail";

        $.ajax({
            url: api_url,
            type: "POST",
            data: jsonObj,
            dataType: "json",
            success: function (data) {
                var msg="لقد تم ارسال البيانات بنجاح! شكرًا لك";
                alert(msg);
                $('.preloader').css("display","none");
            },
            error: function (err) {
                var msg="حدث خطأ - حاول مرة أخرى";
                alert(msg);
                $('.preloader').css("display","none");
            }
        });
    }
}(jQuery));

function navigateTo(path){
    window.location.href=path;
  }
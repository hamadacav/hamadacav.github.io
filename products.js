(function ($) {
    // firestore ref
    var db;
    var productType="";
    products={};
  
    // auth and setup event handlers
    var init = function () {
        
        
        var getParams = function (url) {
            var params = {};
            var parser = document.createElement('a');
            parser.href = url;
            var query = parser.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
            }
            return params;
        };
        var params=getParams(window.location.href);
        if(params.type){
            $("#nav-"+params.type).addClass("products-header-active");
        }
        switch(params.type){
            case "home-furniture" :
            productType="storage-fur";
            break;
            case "clothes" :
            productType="storage-clothes";
            break;
            case "electricity" :
            productType="storage-ele";
            break;
            case "basic-stuff" :
            productType="storage-basic";
            break;
            case "school-stuff" :
            productType="storage-school";
            break;
            case "other" :
            productType="storage-other";
            break;
        }
        auth();
    };
  
    // init on doc ready
    $(document).ready(init);
  
    // sign-in anonymously
    var auth = function () {
        firebase.auth().signInAnonymously()
        .then(function (result) {
     db = firebase.firestore();
     db.settings({ timestampsInSnapshots: true });
  
     list();
        })
        .catch(function (error) {
     alert("failed to anonymously sign-in");
        });
    };
  
  
    var listTempTr;
    // load list
    var list = function () {
        //do somthing

        $('.preloader').css("display","block");

         db.collection("products").where("type", "==", productType)
         .get()
         .then(function(querySnapshot) {
               if(!querySnapshot.docs.length){
                    $("#no-stuff").css("display","block");
                    
                $('.preloader').css("display","none");
               }else{
                    $("#no-stuff").css("display","none");
                   
                $('.preloader').css("display","none");
                   querySnapshot.forEach(function(doc) {
                       // doc.data() is never undefined for query doc snapshots
                       console.log(doc.id, " => ", doc.data());
                       showProduct(doc.id,doc.data());
                   });
               }

             
         })
         .catch(function(error) {
             console.log("Error getting documents: ", error);
         });;


    };
  function showProduct(id,data){
      console.log(data);
      var clone= $(".oneProduct").clone();
      var img1=data.img1;
      var img2=data.img2;
      var img3=data.img3;
      if(img1!=""){
        $(clone).find(".img_1 img").attr("src",img1);
        $(clone).find(".modal-cover").attr("src",img1);
    
      }
      if(img2!=""){
        $(clone).find(".img_2 img").attr("src",img2);
      }else{
        $(clone).find(".img_2").remove();
      }
      if(img3!=""){
        $(clone).find(".img_3 img").attr("src",img3);
      }else{
        $(clone).find(".img_3").remove();
      }
      $(clone).css("display","block");
      $(clone).find(".caro1").attr("id","caroZ"+id);
      $(clone).find(".carousel-control-prev").attr("href","#caroZ"+id);
      $(clone).find(".carousel-control-next").attr("href","#caroZ"+id);
     
      $(clone).find(".boss").attr("id","modal"+id);
      $(clone).find(".modal-cover").attr("data-target","#modal"+id);
    
      $(".prod-cont").append(clone);
  }
    // on remove
    var remove = function (e) {
        e.preventDefault();
        var id = $(this).parents('tr:first').data('id');
        db.collection("contacts").doc(id).delete().then(function () {
            // reload list
            list();
        })
        .catch(function (error) {
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

   
  
  }(jQuery));
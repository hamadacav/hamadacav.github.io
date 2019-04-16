(function ($) {
    // firestore ref
    var db;
  
    // auth and setup event handlers
    var init = function () {
        auth();
  

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
                break;
            case "clothes" :
                break;
            case "electricity" :
                break;
            case "basic-stuff" :
                break;
            case "school-stuff" :
                break;
            case "other" :
                break;
        }
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

   
  
  }(jQuery));

    
(function($) {
    var db;
    var storageService;
    var storageRef;

    var checkSession = function () {   firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $("#loginBtn").css("display","none");
            $("#logoutBtn").css("display","block");
        } else {

            $("#loginBtn").css("display","block");
            $("#logoutBtn").css("display","none");
        }
      });
    };

      $(document).ready(checkSession);


    }(jQuery));

    function checkLogin(){
        var email = $("#defaultForm-email").val();
        var password = $("#defaultForm-pass").val();

        var error="يجب ادخال البريد الاكتروني";


        
        if(email == ""){
            $(".modal-title").css("display","block");
            $(".modal-title").text(error);
            return;
        }else{
            $(".modal-title").css("display","none");

        }
        if(!validateEmail(email)){
            error="بريد الكتروني خاطيء";
            $(".modal-title").css("display","block");
            $(".modal-title").text(error);
            return;
        }else{
            $(".modal-title").css("display","none");
        }

        if(password == ""){
            error="يجب ادخال رمز الدخول";
            $(".modal-title").css("display","block");
            $(".modal-title").text(error);
            return;
        }else{
            $(".modal-title").css("display","none");

        }

        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            // Sign-ib successful.
            $(".modal-title").css("display","none");

            $(".close").trigger("click");
            alert("تم تسجيل الدخول بنجاح");

          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            error="البريد الالكتروني او رمز الدخول خطأ";
            $(".modal-title").css("display","block");
            $(".modal-title").text(error);

          });


    }

    function clearModal(){
        $(".modal-title").css("display","none");
        $("#defaultForm-email").val("");
       $("#defaultForm-pass").val("");
    }

    function logout(){
        firebase.auth().signOut().then(function() {
            
            alert("تم الخروج بنجاح");
            $("#loginBtn").css("display","block");
        $("#logoutBtn").css("display","none");
          }).catch(function(error) {
              alert("حدث خطأ!");
          });
    }

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


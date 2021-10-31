 function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
   
    //set the value to google info
    document.getElementById("name").value = profile.getName();
    document.getElementById("image").value = profile.getImageUrl();
    document.getElementById("email").value = profile.getEmail();
   
    //if log in is successfull
    if(profile){
          document.getElementById("display_signin_info").style.display="block";
          document.getElementById("option-button").style.display="block";
          document.getElementById("or-option").style.display= "block";
          document.getElementById("display_sign_in").innerHTML = "You are logged in as";
    }
  else { 
    document.getElementById("display_signin_info").style.display="none";
    document.getElementById("option-button").style.display="none";
    document.getElementById("display_sign_in").innerHTML = "Sign In With Google";
  }
    document.getElementById("display_name").innerHTML = profile.getName();
    document.getElementById("display_email").innerHTML = profile.getEmail();
    document.getElementById("display_image").src = profile.getImageUrl();
}

function onFailure(error) {
    console.log(error);
}
function renderButton() {
    gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
    });
}
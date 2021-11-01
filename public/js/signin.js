function onSuccess(googleUser) {

    var profile = googleUser.getBasicProfile();
   
    //set the value to google info
    document.getElementById("name").value = profile.getName();
    document.getElementById("image").value = profile.getImageUrl();
    document.getElementById("email").value = profile.getEmail();
   
    //if log in is successfull
    if(profile){
      document.getElementsByClassName("display_signin_info").style.display="block";
      // document.getElementsByClassName("option-button").style.display="block";
      // document.getElementsByClassName("or-option").style.display= "block";
      document.getElementsById("display_usn").style.display= "block";
      document.getElementsById("display_sign_in").innerHTML = "You are logged in as";
    }
    else { 
      document.getElementsByClassName("display_signin_info").style.display="none";
      // document.getElementsByClassName("option-button").style.display="none";
      // document.getElementsByClassName("or-option").style.display= "none";
      document.getElementsById("display_sign_in").innerHTML = "Sign In With Google";
    }
  document.getElementsById("display_name").innerHTML = profile.getName();
  document.getElementsById("display_email").innerHTML = profile.getEmail();
  document.getElementsById("display_image").src = profile.getImageUrl();
}

function onFailure(error) {
    console.log("on login failure", error);
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
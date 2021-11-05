function onSuccess(googleUser) {

    var profile = googleUser.getBasicProfile();

    document.getElementById("name").value = profile.getName();
    document.getElementById("image").value = profile.getImageUrl();
    document.getElementById("email").value = profile.getEmail();

    if (profile) {
        console.log("profile", profile);
        document.getElementById("display_sign_in").innerHTML = "You are logged in as";
        document.getElementById("display_name").innerHTML = profile.getName();
        document.getElementById("display_email").innerHTML = profile.getEmail();
        document.getElementById("display_image").src = profile.getImageUrl();
        document.getElementById("continue-button").style.display = "block";
        document.getElementById("display_signin_info").style.display = "block";
        document.getElementById('signout').style.display = "block";
        document.getElementById("display_usn").style.display = "block";


    }
    document.getElementById("display_name").innerHTML = profile.getName();
    document.getElementById("display_email").innerHTML = profile.getEmail();
    document.getElementById("display_image").src = profile.getImageUrl();
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
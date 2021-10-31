 function onSuccess(googleUser) {
        var profile = googleUser.getBasicProfile();
        // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        document.getElementById("name").value = profile.getName();
        document.getElementById("image").value = profile.getImageUrl();
        document.getElementById("email").value = profile.getEmail();
        if(document.getElementById("name").value){
        document.getElementById("signInForm").submit();
    }
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
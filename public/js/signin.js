function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    document.getElementById("name").value = profile.getName();
    document.getElementById("image").value = profile.getImageUrl();
    document.getElementById("email").value = profile.getEmail();
    document.getElementById("signIn").style.display= "none";
    document.getElementById("signOut").style.display= "block";   
}
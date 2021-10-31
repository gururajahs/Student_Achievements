function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    document.getElementById("name").value = null;
    document.getElementById("image").value = null;
    document.getElementById("email").value = null;
    document.getElementById("signIn").style.display= "block";
    document.getElementById("signOut").style.display= "none";
}
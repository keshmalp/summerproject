//Facebook login part
window.fbAsyncInit = function() {
    FB.init({
        appId      : '2096592053912449',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            document.getElementById('fbLogin').style.display = 'none';
            document.getElementById('fbLogout').style.display = 'block';
            sendToServer();
        }else{
            FB.login(function(response) {},
                {scope: 'public_profile,email'}
            );
        }
    });
}

function logoutFb(){
    FB.logout(function(response) {});
    document.getElementById('fbLogin').style.display = 'block';
    document.getElementById('fbLogout').style.display = 'none';
}
function sendToServer(){
    let details = {lastName: '', id: '', firstName: '', email: '', pictureURL: '', emailConfirmation: 'false'};
    FB.api('/me?fields=id,name,first_name,last_name,email,picture', function(response) {
        console.log(response);
        details.firstName = response.first_name;
        details.lastName = response.last_name;
        details.pictureURL = response.picture.data.url;
        details.id = response.id;
        if (response.email === undefined || response.email === ''){
            details.email = 'unknown@gmail.com';//prompt('What is your email Id ?');
            //->/\w{3,}@*.\w{2,4}/
            details.emailConfirmation = false;
        }else{
            details.email = response.email;
        }
        $.post('/login/facebook', details)
            .done(function (res) {
                $('#status').html(res.data);
            });
        fbLogin(details);
    });
}

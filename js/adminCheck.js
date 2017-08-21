$(function() {
  /* Check if the user is admin or not, and redirect the page*/
  firebase.auth().onAuthStateChanged(user => {
    var userID = user.uid;
    console.log(userID);
    var database = firebase.database().ref('/account_Info/' + userID);
    database.on('value', function(data) {
      var userProfile = data.val();
      if (userProfile.acc_level != 3) {
        $("body").hide();
        alert("You have no access to this page.");
        location.href = "/index.html";
      } else {
        $("body").show();
      }
    });
  });
});

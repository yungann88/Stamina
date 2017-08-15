$(function() {
  firebase.auth().onAuthStateChanged(user => {
    var userID = user.uid;
    var database = firebase.database().ref('/account_Info/' + userID);
    database.on('value', function(data) {
      var acc_level = data.child('acc_level').val();
      console.log(acc_level);
      if (acc_level == 3) {

        $("#adminPage").show();
      }
    });
  });
});

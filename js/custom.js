$(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAtDID7kffLZzjQYv2fpaahOd0EEHH6Apk",
    authDomain: "uccd2223-may-2017.firebaseapp.com",
    databaseURL: "https://uccd2223-may-2017.firebaseio.com",
    projectId: "uccd2223-may-2017",
    storageBucket: "uccd2223-may-2017.appspot.com",
    messagingSenderId: "919908133705"
  };
  firebase.initializeApp(config);

  $('#account-create-form').on('submit', event => {
    event.preventDefault();
    var fname = $('#js-fname').val();
    var lname = $('#js-lname').val();
    var nric = $('#js-nric').val();
    var address = $('#js-address').val();
    var email = $('#js-email').val();
    var password = $('#js-password').val();
    var acc_level = $('#js-acc-level').val();
    console.log(fname, lname, nric, email, password, acc_level);

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        $('#account-create-form').trigger("reset");
        $('.successMessage').html('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="sr-only">Message:</span> Account Successfully Created !</div>');
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/account_Info/').child(userId).set({
          fname: fname,
          lname: lname,
          nric: parseInt(nric),
          address: address,
          email: email,
          userId: userId,
          acc_level: parseInt(acc_level),
        });

      })
      .catch(error => {
        $('.failedMessage').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Message:</span> Failed to Create Account !</div>')
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error Code: ' + errorCode + '\nError Message: ' + errorMessage);
      });
  });
  /*Check login function*/
  $('#check-login-btn').on('click', event => {
    alert('Button Clicked');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        userID = user.uid;
        $('#check-login').html('<p>' + userID + ' is logged in!</p><p>')
        var userLevel = firebase.database().ref().child('account_info').child(userID + 'acc_level').val();
      } else {
        // No user is signed in.
        $('#check-login').html('<p>No one is logged in!</p>')
      }
    });
  });

  $('#website-profile-form').on('submit', event => {
    event.preventDefault();
    var phoneNumber = $('#js-phone-number').val();
  });

});

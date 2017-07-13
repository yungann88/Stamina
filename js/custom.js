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
        alert('Account successfully created!');
        $('#account-create-form').trigger("reset");
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
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error Code: ' + errorCode + '\nError Message: ' + errorMessage);
      });
  });

  $('#website-profile-form').on('submit', event => {
    event.preventDefault();
    var phoneNumber = $('#js-phone-number').val();
  });

});

$(function() {
  // Initialize Firebase
  //Testing
  var config = {
    apiKey: "AIzaSyAtDID7kffLZzjQYv2fpaahOd0EEHH6Apk",
    authDomain: "uccd2223-may-2017.firebaseapp.com",
    databaseURL: "https://uccd2223-may-2017.firebaseio.com",
    projectId: "uccd2223-may-2017",
    storageBucket: "uccd2223-may-2017.appspot.com",
    messagingSenderId: "919908133705"
  };
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var userID = user.uid;
      var userName = user.displayName;


      var database = firebase.database().ref('/account_Info/' + userID);
      database.on('value', function(data) {
        var fname = data.child('fname').val();
        var lname = data.child('lname').val();
        var acc_level = data.child('acc_level').val();
        $('#login-status').html('Welcome, ' + fname + ' ' + lname);
        if (acc_level != 3) {
          $('.admin-page').hide();
        }
      });


    } else {
      $('#login-status').html('Login');
    }
  });
  /*--- Logout Button ---*/
  $('#logout-button').on('click', event => {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      alert('Sign-out successful.');
    }).catch(function(error) {
      // An error happened.
      alert('Sign-out failed.');
    });
  });



  /*--- Setting > Account Creation ---*/
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


  /*--- Login with Email Function ---*/
  $('#login-with-email').on('click', event => {
    event.preventDefault();
    var email = $('#js-email').val();
    var password = $('#js-password').val();


    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        alert('Successfully logged in.');
        location.href = 'setting_schedule.html';
      })
      .catch(error => {
        alert('Failed to log in.');
      });
  });

  /*--- Setting Schedule ---*/
  $('#add-schedule-btn').on('click', event => {
    event.preventDefault();
    var classID = $('#js-class-id').val();
    var classDay = $('#js-class-day').val();
    var startTime = $('#js-class-start').val();
    var endTime = $('#js-class-end').val();
    var exeType = $('#js-class-trainer').val();

  });

  /*--- Trainer Gather ---*/
  var database = firebase.database().ref('/account_Info/');
  database.on('value', function(data) {
    var account_Info = data.val();
    console.log(account_Info);
    var keys = Object.keys(account_Info);

    for (var i = 0; i < keys.length; i++) {
      var t = keys[i];
      var acc_level = account_Info[t].acc_level;
      if (acc_level == 2) {
        var option = document.createElement('option');
        var trainer_list = document.getElementById('js-class-trainer');
        trainer_list.appendChild(option);
        option.innerHTML = account_Info[t].fname + ' ' + account_Info[t].lname;
        option.value = account_Info[t].fname + ' ' + account_Info[t].lname;
      }
    }
  });
  console.log(trainer);

});

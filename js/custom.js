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

  /*--- Logout Button ---*/
  $(document.body).on('click', '#logout-button', function(e) {
    e.preventDefault();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      alert('Sign-out successful.');
      location.href = '/index.html';
    }).catch(function(error) {
      // An error happened.
      alert('Sign-out failed.');
    });
  });


  /*--- Setting > Account Creation ---*/
  $('#account-create-form').on('submit', function(e) {
    e.preventDefault();
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
        var userId = firebase.auth().currentUser.uid;
        var file = $("#js-profile-picture")[0].files[0];
        firebase.storage().ref('profile_picture/this.jpg').put(file).then(function(snapshot) {
          var url = snapshot.downloadURL;
          $("#display-profile-picture").attr("src", url);
        });
        firebase.database().ref('/account_Info/').child(userId).set({
          fname: fname,
          lname: lname,
          nric: parseInt(nric),
          address: address,
          email: email,
          userId: userId,
          acc_level: parseInt(acc_level),
          profilePic: url,
        });
        $('#account-create-form').trigger("reset");
        $('.successMessage').html('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="sr-only">Message:</span> Account Successfully Created !</div>');



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

    console.log(email, password);

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        alert('Successfully logged in.');
        location.href = "/admin/setting_schedule.html";
      })
      .catch(error => {
        alert('Failed to log in.');
      });
  });

  /*--- Setting Schedule ---*/
  $("#admin-schedule-form").on('submit', function(e) {
    e.preventDefault();
    var classID = $('#js-class-id').val();
    var classDay = $('#js-class-day').val();
    var classSize = $('#js-class-size').val();
    var classStartTime = $('#js-class-start').val();
    var classEndTime = $('#js-class-end').val();
    var classExeType = $('#js-class-exercise').val();
    var classTrainer = $('#js-class-trainer').val();
    console.log(classID, classDay, classSize, classStartTime, classEndTime, classExeType, classTrainer);

    firebase.database().ref('/schedule_Info/').child(classID).set({
      classID: classID,
      classDay: classDay,
      classSize: parseInt(classSize),
      classStartTime: classStartTime,
      classEndTime: classEndTime,
      classExeType: classExeType,
      classTrainer: classTrainer,
    });

    $('#account-create-form').trigger("reset");

  });

  /*--- Trainer Gather ---*/
  var database = firebase.database().ref('/account_Info/');
  database.on('value', function(data) {
    var account_Info = data.val();
    /* --- console.log(account_Info); ---*/
    var keys = Object.keys(account_Info);

    for (var i = 0; i < keys.length; i++) {
      var t = keys[i];
      var acc_level = account_Info[t].acc_level;
      if (acc_level == 2) {
        $("#js-class-trainer").append("<option value=\"" + account_Info[t].fname + " " + account_Info[t].lname + "\">" +
          account_Info[t].fname + " " + account_Info[t].lname + "</option>");
      }
    }
  });

  /*--- Check Login Status and Display Logout Button ---*/
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $("#logout-button").show();
      var userID = user.uid;
      var database = firebase.database().ref('/account_Info/' + userID);
      database.on('value', function(data) {
        var fname = data.child('fname').val();
        var lname = data.child('lname').val();
        var acc_level = data.child('acc_level').val();
        $('#login-status').html('Welcome, ' + fname + ' ' + lname);
        console.log(acc_level);
        if (acc_level == 3) {
          $("#adminPage").removeClass("hidden");
        }
      });
    } else {
      $('#login-status').html('Login');
      $("#logout-button").hide();
      $("#adminPage").addClass("hidden");
    }
  });

  /* --- Retrieve data from firebase to Admin Schedule --- */
  firebase.database().ref('/schedule_Info/').on("child_added", function(data) {
    var newNode = data.val();
    var newElement = "<tr><td>" + newNode.classID + "</td><td>" + newNode.classDay + "</td><td>" + newNode.classExeType + "</td><td>" + newNode.classStartTime + "</td><td>" + newNode.classEndTime + "</td><td>" + newNode.classTrainer + "</td><td>NULL</td></tr>";
    $("#table-monday").append(newElement);
    console.log(newNode);
  });

  $('#feedback').on('submit', function(e) {
    e.preventDefault();
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var message = $('#message').val();
    console.log(fname, lname, email, subject, message);

    firebase.database().ref('/feedback_info/').child(subject).set({
      fname: fname,
      lname: lname,
      email: email,
      subject: subject,
      message: message,
    });
  });

  $('#website-profile-form').on('submit', function(e) {
    e.preventDefault();
    var PhoneNumber = $('#js-phone-number').val();
    var email = $('#js-email').val();
    var littleInfo = $('#js-little-info').val();
    var address = $('#js-address').val();
    console.log(PhoneNumber, email, littleInfo, address);

    firebase.database().ref('/website-info/').child(001).set({
      PhoneNumber: PhoneNumber,
      email: email,
      littleInfo: littleInfo,
      address: address,
    });
  });
});

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
    var updates = {};
    var password = $('#js-password').val();
    var userInfo = new Object();
    var memberPlan = new Object();
    var trainerExercise = new Object()
    userInfo.fname = $('#js-fname').val();
    userInfo.lname = $('#js-lname').val();
    userInfo.nric = $('#js-nric').val();
    userInfo.address = $('#js-address').val();
    userInfo.email = $('#js-email').val();
    userInfo.acc_level = parseInt($('#js-acc-level').val());
    userInfo.profilePic = "https://firebasestorage.googleapis.com/v0/b/uccd2223-may-2017.appspot.com/o/profile_picture%2Fdefault.jpg?alt=media&token=76be87bb-611a-45e8-8420-bc6e975c0476";
    firebase.auth().createUserWithEmailAndPassword(userInfo.email, password)
      .then(user => {
        userInfo.userId = firebase.auth().currentUser.uid;
        updates['/account_Info/' + userInfo.userId] = userInfo;

        firebase.database().ref().update(updates).then(function() {
          $('#account-create-form').trigger("reset");
          $('.successMessage').html('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="sr-only">Message:</span> Account Successfully Created !</div>');

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




  /*--- Check Login Status and Display Logout Button ---*/
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $("#signup-button").hide();
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
      $("#signup-button").show();
      $("#adminPage").addClass("hidden");
    }
  });

  /* --- Retrieve data from firebase to Admin Schedule --- */
  firebase.database().ref('/schedule_Info/').on("child_added", function(data) {
    var newNode = data.val();
    var weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var newElement = "<tr id=\"" + newNode.classID + "\"><td>" + newNode.classID + "</td><td>" + weekday[newNode.classDay - 1] + "</td><td>" + newNode.classTime + "</td><td>" + newNode.classExeType + "</td><td>" + newNode.classTrainer + "</td><td><button type=\"button\" id=\"btn-delete\" class=\"btn btn-danger btn-square\">Delete</button></td></tr>";
    $("#schedule-timetable").append(newElement);
  });

  $('#feedback').on('submit', function(e) {
    e.preventDefault();
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var message = $('#message').val();

    firebase.database().ref('/feedback_info/').child(subject).set({
      fname: fname,
      lname: lname,
      email: email,
      subject: subject,
      message: message,
    });
  });

  /*---display feedback form--*/
  firebase.database().ref('/feedback_info/').on("child_added", function(data) {
    var newNode = data.val();
    var newElement = "<tr><td>" + newNode.lname + "</td><td>" + newNode.fname + "</td><td>" + newNode.email + "</td><td>" + newNode.subject + "</td><td>" + newNode.message + "</td</tr>";
    $("#table-feedback").append(newElement);
  });

  $('#website-profile-form').on('submit', function(e) {
    e.preventDefault();
    var PhoneNumber = $('#js-phone-number').val();
    var email = $('#js-email').val();
    var address = $('#js-address').val();
    var workingHours = $('#js-workingHours').val();
    var littleInfo = $('#js-little-info').val();
    console.log(PhoneNumber, email, address, workingHours, littleInfo);

    firebase.database().ref('/website-info/').child(001).set({
      PhoneNumber: PhoneNumber,
      email: email,
      address: address,
      workingHours: workingHours,
      littleInfo: littleInfo,
    });
  });
  /*---link the website profile form--*/
  firebase.database().ref('/website-info/').on("child_added", function(data) {
    var newNode = data.val();
    var newElement = newNode.PhoneNumber;
    var newElement2 = newNode.email;
    var newElement3 = newNode.address;
    var newElement4 = newNode.workingHours;
    var newElement5 = newNode.littleInfo;
    $("#phone1").append(newElement);
    $("#email1").append(newElement2);
    $("#address1").append(newElement3);
    $("#workingHours1").append(newElement4);
    $("#info1").append(newElement5);
  });




});

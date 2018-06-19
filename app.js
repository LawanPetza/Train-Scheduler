/* global firebase moment */
// Steps to complete:


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDvwmnOc8_NVsQmC9v28SBNqUaaSUp49fc",
    authDomain: "train-scheduler-56096.firebaseapp.com",
    databaseURL: "https://train-scheduler-56096.firebaseio.com",
    projectId: "train-scheduler-56096",
    storageBucket: "",
    messagingSenderId: "1036761345792"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();

  // 2. Button for adding Train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = moment($("#time-input").val().trim(), "HH:mm-military time").format("X");
    var trainFrequesncy = $("#frequesncy-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      time: trainTime,
      frequesncy: trainFrequesncy
      // timeAdded: firebase.database.ServerValue.TIMESTAMP
      
    };
    // Uploads train data to the database
  database.ref().push(newTrain);

   // Logs everything to console
   console.log(newTrain.name);
   console.log(newTrain.destination);
   console.log(newTrain.time);
   console.log(newTrain.frequesncy);

    // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequesncy-input").val("");
});


// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(childSnapshot) {
// $("tbody").empty()

    console.log(childSnapshot.val());

    // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequesncy = childSnapshot.val().frequesncy;

   // Train Info
   console.log(trainName);
   console.log(trainDestination);
   console.log(trainTime);
   console.log(trainFrequesncy);

   // Prettify the train time
//   var trainTimePretty = moment.unix(trainTime).format("HH:mm-military time");

  // Assume the following situations.
  
  // Assumptions
    var tFrequency = trainFrequesncy;

    var firstTime = trainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var nextArrival = moment(nextTrain).format("hh:mm")
    

     // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequesncy + "</td><td>" + nextArrival + "</td><td>" + tMinutesTillTrain + "</td></tr>");
 

});



 

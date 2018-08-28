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

var trainData = firebase.database();

// 2. Button for adding Train
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {

    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
    // timeAdded: firebase.database.ServerValue.TIMESTAMP

  };
  // Uploads train data to the database
  trainData.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  // Determine when the next train arrives.
  return false;

});


// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry

trainData.ref().on("child_added", function (childSnapshot) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tTrainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var tFirstTrain = childSnapshot.val().firstTrain;
  var trainFrequency = childSnapshot.val().frequency;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");

  } else {

    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % trainFrequency;
    tMinutes = trainFrequency - tRemainder;

    tArrival = moment().add(tMinutes, "m").format("hh:mm A")
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + tTrainName + "</td><td>" + trainDestination + "</td><td>" +
    trainFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");


});

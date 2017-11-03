$(document).ready(function(){
//declare variables
var firstTrain;
var nextArrival;
var destination = "";
var name = "";
var frequency;
var minutesAway;
	 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDXSCsGNMu9TnUa5xdU73jSPSelimpvHFU",
    authDomain: "choo-choo-4a8fd.firebaseapp.com",
    databaseURL: "https://choo-choo-4a8fd.firebaseio.com",
    projectId: "choo-choo-4a8fd",
    storageBucket: "choo-choo-4a8fd.appspot.com",
    messagingSenderId: "492041465496"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();

  	//on Click event
	$("#submit").on("click", function(event){
		event.preventDefault();
		//empty table
		$("#tableBody").empty();
		//get values from form
		name = $("#nameInput").val().trim();
		destination = $("#destinationInput").val().trim();
		frequency = $("#frequencyInput").val().trim();
		//run calculations function on variables
		calculations();
		//push varibles to firebase
		database.ref().push({
			name: name,
			destination: destination,
			frequency: frequency,
			nextArrival: nextArrival,
			minutesAway: minutesAway

		});//end of push()


	});

	//on Database Change add elements to table
	database.ref().on("value", function(snapshot) {
		//for each entry add values to html table
		snapshot.forEach(function(childSnapshot) {
			var newTableRow = $("<tr>");
			var nameData = $("<td>");
			var destinationData = $("<td>");
			var frequencyData = $("<td>");
			var nextArrivalData = $("<td>");
			var minutesAwayData = $("<td>");
			nameData.html(childSnapshot.val().name);
			destinationData.html(childSnapshot.val().destination);
			frequencyData.html(childSnapshot.val().frequency);
			nextArrivalData.html(childSnapshot.val().nextArrival);
			minutesAwayData.html(childSnapshot.val().minutesAway);
			newTableRow.append(nameData,destinationData,frequencyData,nextArrivalData,minutesAwayData);
			$("#tableBody").append(newTableRow);
		});
	});


	function calculations(){
		//Grab first train value
		firstTrain = $("#firstTrainInput").val().trim();
		//change it to moment obj and subtract 1 year so it is in the future
		var startTime = moment(firstTrain, "HH:mm").subtract(1, "years").format("HH:mm");
		//grab current time
		var now = moment();
		//change to now to moment object formated "HH:mm"
		now = moment(now, "HH:mm").format("HH:mm");
		//Calc the differece between now and the first train
		var timeDifference = moment().diff(moment(startTime, "HH:mm"), "minutes");
		//Get the remainder fo the timeDifference and the frequency of the train
		var minRemainder = timeDifference % frequency;
		//find minutes away by subtracting the frequency by the current remainder of minutes
		minutesAway = frequency - minRemainder;
		//change arrival to string format "HH:mm"
		nextArrival = moment(moment().add(minutesAway, "minutes")).format("HH:mm");
	}//end of calculations()

});//end document.ready()
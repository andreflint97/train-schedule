var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");
var elTrainTime = $("#train-time").mask("00:00");
var elTimeFreq = $("#time-freq").mask("00");


<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOss8CEzBzeqD_Kf7juBsJVlFHJmdHSlA",
    authDomain: "train-schedule-9a8de.firebaseapp.com",
    databaseURL: "https://train-schedule-9a8de.firebaseio.com",
    projectId: "train-schedule-9a8de",
    storageBucket: "",
    messagingSenderId: "86485384628"
  };
  firebase.initializeApp(config);
</script>

firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    trainRemainder = trainDiff % frequency;

    minutesTillArrival = frequency - trainRemainder;

    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });



var storeInputs = function(event) {
    event.preventDefault();

    trainName = elTrain.val().trim();
    trainDestination = elTrainDestination.val().trim();
    trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = elTimeFreq.val().trim();

    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Train successuflly added!");

    elTrain.val("");
    elTrainDestination.val("");
    elTrainTime.val("");
    elTimeFreq.val("");
};

$("#btn-add").on("click", function(event) {
    if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        storeInputs(event);
    }
});

$('form').on("keypress", function(event) {
    if (event.which === 13) {
        if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            storeInputs(event);
        }
    }
});
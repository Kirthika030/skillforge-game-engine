let missionData;

fetch("../json/mission.json")
.then(response => response.json())
.then(data => {

    missionData = data;

    document.getElementById("missionTitle").innerText = data.title;
    document.getElementById("missionDesc").innerText = data.description;

    // Show array from JSON
    let array = data.test_cases[0].input;
    document.getElementById("array").innerText = "Array: " + array.join(", ");

});

// Timer
let time = 30;

let timer = setInterval(() => {

    time--;
    document.getElementById("timer").innerText = time;

    if(time <= 0){
        clearInterval(timer);
        alert("Time Up!");
    }

},1000);


// Submit function
function submitAnswer(){

    let answer = document.getElementById("answer").value;

    let correctAnswer = missionData.test_cases[0].output;

    if(answer == correctAnswer){

        alert("Correct! Score: " + missionData.points);

    }else{

        alert("Wrong answer! Try again.");

    }

}
//  ------------------  GLOBAL VARIABLES  ------------------  //

var img = document.getElementById('img');
var startBtn = document.getElementById('start');
var choicesContainer = document.getElementById('choices-container');
var choices = document.getElementsByClassName('choice');
var page = 1;

//  ------------------  JSON FETCH  ------------------  //

async function getData(url) {
    const response = await fetch("library.json");
    return response.json()
}

async function fetchJson() {
    data = await getData(URL);
    render();
}

fetchJson();

//  ------------------ RENDER  ------------------  //

async function render() {
    page++;
    startBtn.classList.add('invisible');
    choicesContainer.classList.add('invisible');
    img.src = data.pages[page].image;
    typeWriter(data.pages[page].text);
}

//  ------------------ TYPEWRITER  ------------------  //

function typeWriter(sentence) {
    var index = 0,
    timer = setInterval(function() {
        var char= sentence.charAt(index);
        if(char === '<') {
            index= sentence.indexOf('>',index);
        }
        document.getElementById('storyText').innerHTML= sentence.substr(0,index);
        if (++index === sentence.length) {
            clearInterval(timer);
            showOptions();
        }
    }, 20);
}

//  ------------------ SHOW OPTIONS AFTER LOADING TEXT  ------------------  //

function showOptions() {
    if (page === 0){
        fadein = setTimeout(function() {
        startBtn.classList.remove('invisible')}, 500);
    }
    setTimeout(function() {checkOptions()}, 500);
}

//  ------------------ CHECK OPTIONS  ------------------  //

function checkOptions() {
    for (let i = 0; i<3; i++) {
        choices[i].innerHTML = "";
        if (data.pages[page].options[0][i] !== ""){
            choices[i].innerHTML = "&#9654; " + data.pages[page].options[0][i];
        }
    }
    choicesContainer.classList.remove('invisible');
}
//  ------------------  GLOBAL VARIABLES  ------------------  //

var img = document.getElementById('img');
var startBtn = document.getElementById('start');
var choicesContainer = document.getElementById('choices-container');
var screenText = document.getElementById('storyText');
var choices = document.getElementsByClassName('choice');
var speedBtn = document.getElementsByClassName('speed')[0];
var inventory = new Array();
var page = -1;
var textspeed = 20;

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

async function render(choice) {
    screenText.innerText = "";
    if (choice !== undefined) {
        addToInventory(choice);
        skipPage(choice);
    }
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
            var char = sentence.charAt(index);
            if (char === '<') {
                index = sentence.indexOf('>', index);
            }
            screenText.innerHTML = sentence.substr(0, index);
            if (++index === sentence.length) {
                clearInterval(timer);
                showOptions();
            }
        }, textspeed);
}

//  ------------------ SHOW OPTIONS AFTER LOADING TEXT  ------------------  //

function showOptions() {
    if (page === 0) {
        fadein = setTimeout(function() {
            startBtn.classList.remove('invisible')
        }, 500);
    }
    setTimeout(function() { checkOptions() }, 500);
}

//  ------------------ CHECK OPTIONS  ------------------  //

function checkOptions() {
    for (let i = 0; i < 3; i++) {
        choices[i].innerHTML = "";
        if (data.pages[page].options[0][i][0].text !== "") {
            choices[i].innerHTML = "&#9654; " + data.pages[page].options[0][i][0].text;
        }
    }
    choicesContainer.classList.remove('invisible');
}

//  ------------------ ADD TO INVENTORY ------------------  //

function addToInventory(choice) {
    if (data.pages[page].options[0][choice][0].item !== "") {
        inventory.push(data.pages[page].options[0][choice][0].item)
    }
}

//  ------------------ SKIP PAGES  ------------------  //

function skipPage(choice) {
    if (data.pages[page].options[0][choice][0].skip !== "") {
        page = page + parseInt(data.pages[page].options[0][choice][0].skip);
    }
}

//  ------------------ CHANGE SPEED  ------------------  //

function changeSpeed() {
    if (textspeed === 20) {
        textspeed = 0;
        speedBtn.classList.add('fast');
        speedBtn.classList.remove('slow');
        speedBtn.innerText = 'FAST';
    } else if (textspeed === 0) {
        textspeed = 50;
        speedBtn.classList.add('slow');
        speedBtn.classList.remove('fast');
        speedBtn.innerText = 'SLOW';
    } else if (textspeed === 50) {
        textspeed = 20;
        speedBtn.classList.remove('slow');
        speedBtn.innerText = 'NORMAL';
    }
}
//  ------------------  GLOBAL VARIABLES  ------------------  //

var img = document.getElementById('img');
var startBtn = document.getElementById('start');
var endBtn = document.getElementById('end');
var choicesContainer = document.getElementById('choices-container');
var screenText = document.getElementById('storyText');
var choices = document.getElementsByClassName('choice');
var speedBtn = document.getElementsByClassName('speed')[0];
var healthBtn = document.getElementsByClassName('health')[0];
var inventory = new Array();
var speed = 25;
var page = -1;
var dead = false;

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
    checkhealth();
    startBtn.classList.add('invisible');
    choicesContainer.classList.add('invisible');
    img.src = data.pages[page].image;
    typeWriter(data.pages[page].text);
}

//  ------------------ TYPEWRITER  ------------------  //

function typeWriter(sentence) {
    if (speed === 0) {
        screenText.innerHTML = sentence;
        showOptions();
        speedBtn.disabled = false;
    } else {
        speedBtn.disabled = true;
        screenText.classList.add('typing');
        var index = 0,
            timer = setInterval(function() {
                var char = sentence.charAt(index);
                if (char === '<') {
                    index = sentence.indexOf('>', index);
                }
                screenText.innerHTML = sentence.substr(0, index);
                if (++index === sentence.length + 1) {
                    clearInterval(timer);
                    showOptions();
                    speedBtn.disabled = false;
                    screenText.classList.remove('typing');
                }
            }, speed);
    }
}

//  ------------------ SHOW OPTIONS AFTER LOADING TEXT  ------------------  //

function showOptions() {
    if (page === 0) {
        fadein = setTimeout(function() {
            startBtn.classList.remove('invisible')
        }, 500);
        setTimeout(function() { checkOptions() }, 500);
    } else if (dead === true) {
        fadein = setTimeout(function() {
            endBtn.classList.remove('invisible')
        }, 500);
    } else {
        setTimeout(function() { checkOptions() }, 500);
    }
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

//  ------------------ CHECK HEALTH  ------------------  //

function checkhealth() {
    if (data.pages[page].requirement === "fullhealth") {
        if (parseInt(healthBtn.innerText.slice(4)) !== 10) {
            page++;
        }
        takedamage();
    } else if (data.pages[page].requirement !== "") {
        if (!inventory.includes(data.pages[page].requirement)) {
            page++
            takedamage();
        }
    }
}

//  ------------------ TAKE DAMAGE  ------------------  //

function takedamage() {
    if (parseInt(healthBtn.innerText.slice(4)) === 10) {
        healthBtn.classList.add('damaged');
    } else if (parseInt(healthBtn.innerText.slice(4)) === 5) {
        healthBtn.classList.add('dead');
        gameOver();
    }
    healthBtn.innerText = 'HP: ' + parseInt(healthBtn.innerText.slice(4) - 5);
}


//  ------------------ GAME END  ------------------  //

function gameOver() {
    dead = true;
}

function restart() {
    location.reload()
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
    if (speed === 50) {
        speedBtn.classList.remove('slow');
        speedBtn.classList.add('instant');
        speedBtn.innerText = 'INSTANT';
        speed = 0;
    } else if (speed === 0) {
        speedBtn.classList.remove('instant');
        speedBtn.classList.add('fast');
        speedBtn.innerText = 'FAST';
        speed = 10;
    } else if (speed === 10) {
        speedBtn.classList.remove('fast');
        speedBtn.innerText = 'NORMAL';
        speed = 25;
    } else if (speed === 25) {
        speedBtn.classList.add('slow');
        speedBtn.innerText = 'SLOW';
        speed = 50;
    }
}
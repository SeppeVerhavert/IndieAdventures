//  ------------------  GLOBAL VARIABLES  ------------------  //

var startBtn = document.getElementById('start');
var img = document.getElementById('img');
var page = 0;

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
            showBtn();
        }
    }, 25);
}

//  ------------------ RENDER  ------------------  //

async function render() {
    startBtn.classList.add('invisible');
    img.src = data.pages[page].image;
    typeWriter(data.pages[page].text);
    page++;
}

function showBtn() {
    if (page === 1){
        fadein = setTimeout(function() {
        startBtn.classList.remove('invisible')}, 500);
    }
}
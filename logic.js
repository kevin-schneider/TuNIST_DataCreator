var randomDigit;

function createRandomDigit() {
    randomDigit = Math.floor(Math.random() * 10);
    document.getElementById('randomDigit_div').innerHTML = randomDigit;
}

function initLogic() {
    createRandomDigit();
}

initLogic();

function startApp(){
    console.log("startApp");
    document.getElementById('welcome-div').style.display='none';
    document.getElementById('metadata-div').style.display='initial';
}


function onLoad(){
    if (localStorage.getItem("dataObject") === null) {
        metaDataObject = new metaDataClass();
        dataObject = new dataClass();
    }
    else {
        dataObject = JSON.parse(localStorage.getItem("dataObject"));
    }
}
/*
document.getElementById('data-creator-div').style.display='initial';
document.getElementById('data-creator-div').style.display='none';
*/
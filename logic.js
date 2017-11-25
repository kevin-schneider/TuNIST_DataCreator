var randomDigit;

function createRandomDigit() {
    randomDigit = Math.floor(Math.random() * 10);
    document.getElementById('randomDigit_div').innerHTML = randomDigit;
}

function initLogic() {
    createRandomDigit();
}

initLogic();


/*
document.getElementById('data-creator-div').style.display='initial';
document.getElementById('data-creator-div').style.display='none';
*/
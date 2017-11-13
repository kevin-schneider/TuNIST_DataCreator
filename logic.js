var randomDigit;

function createRandomDigit() {
    randomDigit = Math.floor(Math.random() * 10);
    document.getElementById('randomDigit_div').innerHTML = randomDigit;
}

function initLogic() {
    createRandomDigit();
}

initLogic();
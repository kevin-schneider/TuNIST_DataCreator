
/**
 * 1. create object that contains all the data
 * 2. JSON stringify
 * 3. save in localStorage
 */


function metaDataClass(firstName, lastName, lastChanged, numOfDigits) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.lastChanged = lastChanged;
    this.numOfDigits = numOfDigits;
}

function mnistDigitObject(digit, pixelArray) {
    this.digit = digit;
    this.pixelArray = pixelArray;
}

function dataClass(metaData) {
    this.metaData = metaData;
    this.mnistData = [];
    this.addMnistDigit = function (mnistDigit) {
        this.mnistData.push(mnistDigit);
    };
}

//to set
/*
var kev = new person("Ke", "Schne", 26, "blue");
console.log(kev);
var kev_store = JSON.stringify(kev);
console.log(kev_store);
localStorage.setItem("data", kev_store);
*/
//to load
var kev_new = JSON.parse(localStorage.getItem("data"));
console.log(kev_new);
//kev_new.changeName("Kevnew");
console.log(kev_new.lastName);

localStorage.setItem("Name", "Anna");
localStorage.setItem("Age", 21);
console.log(localStorage.getItem("Name"));
console.log(localStorage.getItem("Age"));
console.log(typeof localStorage.getItem("Name"));
console.log(typeof localStorage.getItem("Age"));
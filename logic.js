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
*/

function onLoad() {
    if (localStorage.getItem("dataObject") === null) {
        console.log('onload');
        metaDataObject = {
            firstName: null,
            lastName: null,
            lastChanged: null,
            numOfDigits: 0
        };
        dataObject = {
            metaData: null,
            mnistData: [],
            addMnistDigit: function (mnistDigit) {
                this.mnistData.push(mnistDigit);
            }
        };
    }
    else {
        metaDataObject = JSON.parse(localStorage.getItem("metaDataObject"));
        dataObject = JSON.parse(localStorage.getItem("dataObject"));

        document.getElementById('data-creator-div').style.display = 'initial';
    }
}

function startApp() {
    console.log("startApp");

    if (metaDataObject.firstName !== null) document.getElementById("firstname").value = metaDataObject.firstName;
    if (metaDataObject.lastName !== null) document.getElementById("firstname").value = metaDataObject.lastName;
    if (metaDataObject.lastChanged !== null) document.getElementById("lastchange-div").innerHTML = "Letzte Änderung: " + metaDataObject.lastChanged;
    var progress = Math.floor(parseFloat(metaDataObject.numOfDigits) / parseFloat(1000) * 100);
    console.log(progress);
    document.getElementById("progress-bar").style.width = "" + progress + "%";

    document.getElementById('welcome-div').style.display = 'none';
    document.getElementById('metadata-div').style.display = 'initial';
}

function confirmMeta() {
    console.log("confirmMeta");
    if (document.getElementById("firstname").value === "") {
        alert("Bitte geben Sie Ihren Vor- und Nachnamen ein");
    }
    else {

    }
}

/*
document.getElementById('data-creator-div').style.display='initial';
document.getElementById('data-creator-div').style.display='none';
*/
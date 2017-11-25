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
        var metaDataObject = {
            firstName: null,
            lastName: null,
            lastChanged: null,
            numOfDigits: 0
        };
        dataObject = {
            metaData: metaDataObject,
            mnistData: [],
            addMnistDigit: function (mnistDigit) {
                this.mnistData.push(mnistDigit);
            }
        };
    }
    else {
        dataObject = JSON.parse(localStorage.getItem("dataObject"));

        document.getElementById('data-creator-div').style.display = 'initial';
    }
}

function startApp() {
    console.log("startApp");
    console.log(dataObject);
    if (dataObject.metaData.firstName !== null) document.getElementById("firstname").value = dataObject.metaData.firstName;
    if (dataObject.metaData.lastName !== null) document.getElementById("firstname").value = dataObject.metaData.lastName;
    if (dataObject.metaData.lastChanged !== null) document.getElementById("lastchange-div").innerHTML = "Letzte Änderung: " + dataObject.metaData.lastChanged;
    var progress = Math.floor(parseFloat(dataObject.metaData.numOfDigits) / parseFloat(1000) * 100);
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
        dataObject.metaData.firstName = document.getElementById("firstname").value;
        dataObject.metaData.lastName = document.getElementById("lastname").value;
    }
}

/*
document.getElementById('data-creator-div').style.display='initial';
document.getElementById('data-creator-div').style.display='none';
*/
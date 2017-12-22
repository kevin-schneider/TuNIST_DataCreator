var randomDigit;
var progress;
var firstStart = false;
var letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];


function createRandomDigit() {
    randomDigit = Math.floor(Math.random() * 10);
    if (dataObject.metaData.datasetType === 'digit') {
        document.getElementById('randomDigit_div').innerHTML = randomDigit;
    }
    else if (dataObject.metaData.datasetType === 'letter') {
        document.getElementById('randomDigit_div').innerHTML = letterArray[randomDigit];
    }
    else {
        throw 'error';
    }
}


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
    console.log('onload');
    if (localStorage.getItem("dataObject") === null) {
        firstStart = true;
        var metaDataObject = {
            firstName: null,
            lastName: null,
            lastChanged: null,
            datasetType: null,
            datasetSize: null,
            numOfDigits: 0
        };
        dataObject = {
            metaData: metaDataObject,
            mnistData: [],
            addMnistDigit: function (mnistDigit) {
                this.mnistData.push(mnistDigit);
                this.metaData.numOfDigits++;
            }
        };
    }
    else {
        loadDataObject();
        document.getElementById('welcome-message').innerHTML = 'Willkommen zurück ' + dataObject.metaData.firstName + ' ' + dataObject.metaData.lastName;
    }
}

function startApp() {
    console.log("startApp");
    console.log(dataObject);

    if (dataObject.metaData.lastChanged !== null) {
        var d = new Date(dataObject.metaData.lastChanged);
        console.log(typeof(d));
        var dformat = [d.getDate(), d.getMonth() + 1,
                d.getFullYear()].join('/') + ' ' +
            [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
        document.getElementById("lastchange-div").innerHTML = "Letzte Änderung: " + dformat;
    }
    updateProgress();
    showMetaDataScreen();
}

function confirmMeta() {
    console.log("confirmMeta");
    if (document.getElementById("firstname").value === "" || document.getElementById("lastname").value === "") {
        alert("Bitte geben Sie Ihren Vor- und Nachnamen ein");
    }
    else {
        dataObject.metaData.firstName = document.getElementById("firstname").value;
        dataObject.metaData.lastName = document.getElementById("lastname").value;

        for (var i = 0; i < document.getElementsByName('datasettype').length; i++) {
            if (document.getElementsByName('datasettype')[i].checked) {
                dataObject.metaData.datasetType = document.getElementsByName('datasettype')[i].value;
            }
        }

        for (var i = 0; i < document.getElementsByName('datasetsize').length; i++) {
            if (document.getElementsByName('datasetsize')[i].checked) {
                dataObject.metaData.datasetSize = document.getElementsByName('datasetsize')[i].value;
            }
        }
        saveDataObject();
        nextDigit(false);
        showDatacreatorScreen();
    }
}

function skipMeta() {
    nextDigit(false);
    showDatacreatorScreen();
}

function saveDataObject() {
    dataObject.metaData.lastChanged = Date.now();
    localStorage.setItem('dataObject', JSON.stringify(dataObject));
    console.log('DataObject saved');
}

function loadDataObject() {
    dataObject = JSON.parse(localStorage.getItem("dataObject"));
    dataObject.addMnistDigit = function (mnistDigit) {
        this.mnistData.push(mnistDigit);
        this.metaData.numOfDigits++;
    };
}

function showMetaDataScreen() {
    document.getElementById('welcome-div').style.display = 'none';
    document.getElementById('datacreator-div').style.display = 'none';
    document.getElementById('delete-div').style.display = 'none';
    if (firstStart === true) {
        document.getElementById('metadata-display-div').style.display = 'none';
        document.getElementById('metadata-initial-div').style.display = 'initial';
    }
    else {
        document.getElementById('metadata-initial-div').style.display = 'none';
        document.getElementById('metadata-display-div').style.display = 'initial';
    }
}

function showDatacreatorScreen() {
    document.getElementById('metadata-display-div').style.display = 'none';
    document.getElementById('welcome-div').style.display = 'none';
    document.getElementById('datacreator-div').style.display = 'initial';
    document.getElementById('metadata-initial-div').style.display = 'none';
    document.getElementById('delete-div').style.display = 'none';
}

function showWelcomeScreen() {
    document.getElementById('metadata-display-div').style.display = 'none';
    document.getElementById('welcome-div').style.display = 'initial';
    document.getElementById('datacreator-div').style.display = 'none';
    document.getElementById('metadata-initial-div').style.display = 'none';
    document.getElementById('delete-div').style.display = 'none';
}

function showDeleteScreen() {
    document.getElementById('metadata-display-div').style.display = 'none';
    document.getElementById('welcome-div').style.display = 'none';
    document.getElementById('datacreator-div').style.display = 'none';
    document.getElementById('metadata-initial-div').style.display = 'none';
    document.getElementById('delete-div').style.display = 'initial';
}

var nextDigit = function (save) {
    if (dataObject.metaData.numOfDigits > dataObject.metaData.datasetSize) {
        document.getElementById('next-button').innerHTML = 'Download';
        document.getElementById('next-button').className = 'btn btn-warning';
        document.getElementById('next-button').onclick = my_download;
        return;
    }
    var canvasEmpty;
    if (save) canvasEmpty = recognize();
    if (document.getElementById('preprocessing').checked == true) {
        setTimeout(function () {
            erase();
        }, 3000);
    }
    else {
        erase();
    }
    if (!canvasEmpty) {
        updateProgress();
        createRandomDigit();
    }
};

function updateProgress() {
    progress = Math.floor(parseFloat(dataObject.metaData.numOfDigits) / parseFloat(dataObject.metaData.datasetSize) * 100);
    console.log(progress);
    document.getElementById("progress-bar").style.width = "" + progress + "%";
    document.getElementById("progress-bar-2").style.width = "" + progress + "%";
    document.getElementById("progress-text").innerHTML = dataObject.metaData.numOfDigits + " / " + dataObject.metaData.datasetSize;
}

var my_download = function () {

    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText) {

                var content = '//METADATA' + '\r\n';
                content = content + 'Vorname: ' + dataObject.metaData.firstName + '\r\n';
                content = content + 'Nachname: ' + dataObject.metaData.lastName + '\r\n';
                content = content + 'Datensatztyp: ' + dataObject.metaData.datasetType + '\r\n';
                content = content + 'Zuletzt Geändert: ' + dataObject.metaData.lastChanged + '\r\n';
                content = content + 'Datensatzgröße: ' + dataObject.metaData.datasetSize + '\r\n';
                content = content + 'Anzahl der Zeichen: ' + dataObject.metaData.numOfDigits + '\r\n';
                content = content + '//METADATA' + '\r\n';

                content = content + xhr.responseText;

                //PRODUCTIVE USE

                 for (var i = 0; i < dataObject.mnistData.length; i++) {
                    for (var j = 0; j < dataObject.mnistData[i][1].length; j++) {
                        content = content + dataObject.mnistData[i][1][j] + ',';
                    }
                    content = content + dataObject.mnistData[i][0] + '\r\n';
                }
                 
                //END PRODUCTIVE

                //JUST FOR TESTING
                /*for (var i = 0; i < dataObject.mnistData.length; i++) {
                    var counter = 0;
                    for (var j = 0; j < dataObject.mnistData[i][1].length; j++) {

                        if (dataObject.mnistData[i][1][j] >= 10) {
                            content = content + '#,';
                        }
                        else {
                            content = content + dataObject.mnistData[i][1][j] + ',';
                        }
                        if (counter >= 27) {
                            counter = 0;
                            content = content + '\r\n';
                        }
                        else {
                            counter++;
                        }
                    }
                    content = content + dataObject.mnistData[i][0] + '\r\n';*/
                }
                //END TESTING

                var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                download(blob, "tunist.txt", "text/plain");
            }
        }
    };
    xhr.open("GET", "media/mnist_begin.txt", true);
    xhr.send();


    /**
     var file = new File(['Hallo, wie gehts?'], 'media/mnist_begin.txt');
     var content;
     var reader = new FileReader();
     reader.onload = function (event) {
        // Hier wird der Text der Datei ausgegeben
        content = event.target.result;
        console.log('LOADED');
    };
     reader.readAsText(file);
     console.log(content);
     */
};

function deleteData() {
    if (confirm('Wollen Sie Ihren Datensatz wirklich löschen?') == true) {
        console.log("DELETE");
        localStorage.removeItem('dataObject');
        dataObject = null;
        onLoad();
        document.getElementById("firstname").value = dataObject.metaData.firstName;
        document.getElementById("lastname").value = dataObject.metaData.firstName;
        updateProgress();
        document.getElementById("lastchange-div").innerHTML = '';

        document.getElementById('next-button').innerHTML = 'Weiter';
        document.getElementById('next-button').className = 'btn btn-success';
        document.getElementById('next-button').onclick = nextDigit;
        document.getElementById('welcome-message').innerHTML = 'Willkommen beim TuNIST Data Creator';
        showWelcomeScreen();
    }
}


/*
document.getElementById('data-creator-div').style.display='initial';
document.getElementById('data-creator-div').style.display='none';
*/
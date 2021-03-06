var canvas;
var ctx;

var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var paths = [];
var paintFlag = false;
var color = "black";
var lineWidth = 20;

var clearBeforeDraw = false; // controls whether canvas will be cleared on next mousedown event. Set to true after digit recognition

// computes center of mass of digit, for centering
// note 1 stands for black (0 white) so invert.
function centerImage(img) {
    console.log("FUNCTION centerImage(img)");
    console.log(img);
    var meanX = 0;
    var meanY = 0;
    var rows = img.length;
    var columns = img[0].length;
    var sumPixels = 0;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            var pixel = (1 - img[y][x]);
            sumPixels += pixel;
            meanY += y * pixel;
            meanX += x * pixel;
        }
    }
    meanX /= sumPixels;
    meanY /= sumPixels;

    var dY = Math.round(rows / 2 - meanY);
    var dX = Math.round(columns / 2 - meanX);
    return {transX: dX, transY: dY};
}

function getBoundingRectangle(img, threshold) {
    console.log("FUNCTION getBoundingRectangle(img, threshold)");
    var rows = img.length;
    var columns = img[0].length;
    var minX = columns;
    var minY = rows;
    var maxX = -1;
    var maxY = -1;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if (img[y][x] < threshold) {
                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
    }
    return {minY: minY, minX: minX, maxY: maxY, maxX: maxX};
}

function imageDataToGrayscale(imgData) {
    console.log("FUNCTION imageDataToGrayscale(imgData)");
    var grayscaleImg = [];
    for (var y = 0; y < imgData.height; y++) {
        grayscaleImg[y] = [];
        for (var x = 0; x < imgData.width; x++) {
            var offset = y * 4 * imgData.width + 4 * x;
            var alpha = imgData.data[offset + 3];
            if (alpha == 0) {
                imgData.data[offset] = 255;
                imgData.data[offset + 1] = 255;
                imgData.data[offset + 2] = 255;
            }
            imgData.data[offset + 3] = 255;
            // simply take red channel value. Not correct, but works for
            // black or white images.
            grayscaleImg[y][x] = imgData.data[y * 4 * imgData.width + x * 4 + 0] / 255;
        }
    }
    return grayscaleImg;
}

function recognize() {
    console.log("FUNCTION recognize()");
    var t1 = new Date();

    // convert RGBA image to a grayscale array, then compute bounding rectangle and center of mass
    var imgData = ctx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageDataToGrayscale(imgData);
    var boundingRectangle = getBoundingRectangle(grayscaleImg, 0.01);
    var trans = centerImage(grayscaleImg); // [dX, dY] to center of mass

    // copy image to hidden canvas, translate to center-of-mass, then
    // scale to fit into a 200x200 box
    var canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;
    var copyCtx = canvasCopy.getContext("2d");
    var brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
    var brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
    var scaling = 190 / (brW > brH ? brW : brH);
    // scale
    copyCtx.translate(canvas.width / 2, canvas.height / 2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width / 2, -canvas.height / 2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);


    // redraw the image with a scaled lineWidth first.
    for (var p = 0; p < paths.length; p++) {
        for (var i = 0; i < paths[p][0].length - 1; i++) {
            var x1 = paths[p][0][i];
            var y1 = paths[p][1][i];
            var x2 = paths[p][0][i + 1];
            var y2 = paths[p][1][i + 1];
            draw(copyCtx, color, lineWidth / scaling, x1, y1, x2, y2);
        }
    }

    var canvasEmpty = true;
    // now bin image into 10x10 blocks (giving a 28x28 image)
    imgData = copyCtx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageDataToGrayscale(imgData);
    var mnistData = new Array(784);
    for (var y = 0; y < 28; y++) {
        for (var x = 0; x < 28; x++) {
            var mean = 0;
            for (var v = 0; v < 10; v++) {
                for (var h = 0; h < 10; h++) {
                    mean += grayscaleImg[y * 10 + v][x * 10 + h];
                }
            }
            mean = (1 - mean / 100); // average and invert
            if (mean !== 0) canvasEmpty = false;
            mnistData[y * 28 + x] = (mean - .5) / .5;
        }
    }

    // Painting just for debugging ToDo rueckgaengig
    // if (document.getElementById('preprocessing').checked == true) {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.drawImage(copyCtx.canvas, 0, 0);
    //     for (var y = 0; y < 28; y++) {
    //         for (var x = 0; x < 28; x++) {
    //             var block = ctx.getImageData(x * 10, y * 10, 10, 10);
    //             //var newVal = 255 * (0.5 - mnistData[x * 28 + y] / 2);
    //             var newVal = 255 * (0.5 - mnistData[y * 28 + x] / 2);
    //             for (var i = 0; i < 4 * 10 * 10; i += 4) {
    //                 block.data[i] = newVal;
    //                 block.data[i + 1] = newVal;
    //                 block.data[i + 2] = newVal;
    //                 block.data[i + 3] = 255;
    //             }
    //             ctx.putImageData(block, x * 10, y * 10);
    //         }
    //     }
    // }

    if (!canvasEmpty) {
        console.log(mnistData);
        console.log(resultToRGB(mnistData));
        console.log(dataObject);
        var digit = [randomDigit, resultToRGB(mnistData)];
        dataObject.addMnistDigit(digit);
        saveDataObject();
    }
    else {
        console.log("CANVAS EMPTY");
        if (dataObject.metaData.datasetType === 'digit') {
            alert('Bitte zeichnen Sie die Zahl.');
        }
        if (dataObject.metaData.datasetType === 'letter') {
            alert('Bitte zeichnen Sie den Buchstaben.');
        }
        if (dataObject.metaData.datasetType === 'special') {
            alert('Bitte zeichnen Sie das Sonderzeichen.');
        }
    }
    return canvasEmpty;
}

function initCanvas() {
    console.log("FUNCTION initCanvas()");
    canvas = document.getElementById('numberArea');
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        findxy('move', e.touches[0])
    }, false);
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        findxy('down', e.touches[0])
    }, false);
    canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
        //console.log(e);
        findxy('up', e.touches[0])
    }, false);
}

// draws a line from (x1, y1) to (x2, y2) with nice rounded caps
function draw(ctx, color, lineWidth, x1, y1, x2, y2) {
    console.log("FUNCTION draw(ctx, color, lineWidth, x1, y1, x2, y2)", x1, y1, x2, y2);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    console.log("FUNCTION erase()");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //document.getElementById('nnOut').innerHTML = '';
    paths = [];
}

function findxy(res, e) {
    console.log("FUNCTION findxy(res, e)", res, e);
    if (res == 'down') {
        if (clearBeforeDraw == true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById('nnInput').innerHTML = '';
            document.getElementById('nnOut').innerHTML = '';
            paths = [];
            clearBeforeDraw = false;
        }

        if (e.pageX != undefined && e.pageY != undefined) {
            currX = e.pageX - canvas.offsetLeft;
            currY = e.pageY - canvas.offsetTop;
        } else {
            currX = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft
                - canvas.offsetLeft;
            currY = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop
                - canvas.offsetTop;
        }

        //draw a circle
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(currX, currY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();

        paths.push([[currX], [currY]]);
        paintFlag = true;
    }
    if (res == 'up' || res == "out") {
        paintFlag = false;
        //console.log(paths);
    }

    if (res == 'move') {
        console.log(e);
        if (paintFlag) {
            // draw a line to previous point
            prevX = currX;
            prevY = currY;
            if (e.pageX != undefined && e.pageY != undefined) {
                currX = e.pageX - canvas.offsetLeft;
                currY = e.pageY - canvas.offsetTop;
            } else {
                currX = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft
                    - canvas.offsetLeft;
                currY = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop
                    - canvas.offsetTop;
            }

            //Touchleave Event
            if (currX > 281 || currY > 281 || currX < 0 || currY < 0) {
                findxy('out', null);
            }
            else {
                currPath = paths[paths.length - 1];
                currPath[0].push(currX);
                currPath[1].push(currY);
                paths[paths.length - 1] = currPath;
                draw(ctx, color, lineWidth, prevX, prevY, currX, currY);
            }

        }
    }
}

function resultToRGB(input) {
    var index;
    var output = [];
    for (index = 0; index < input.length; ++index) {
        output.push(Math.ceil(((input[index] + 1) / 2) * 255));
    }
    return output;
}

initCanvas();

/*
Parts of this code are inspired by Hubert Eichner
Copyright 2014 Hubert Eichner

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.
 */
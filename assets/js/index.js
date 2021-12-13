 // More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/gIJsRxRm0/";

let model, webcam, labelContainer, maxPredictions;
let a = false;
let hasil, persentase = "100%";

document.addEventListener("DOMContentLoaded", function(event) { 
    //do work
    document.getElementById("progressBar").style.display = "none";
    document.documentElement.scrollTop = 0;
});

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    if (a == false) {
        document.getElementById("progressBar").style.display = "block";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("progressBar").style.display = "block";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        resultContainer = document.getElementById("result-container");
        labelContainer.style.display = "block";
        resultContainer.style.display = "block";
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
        a = true;
    }else{
        await webcam.play();
    }

    
}

async function pauseVideo() {
    await webcam.pause();
}
async function stopVideo() {
    await webcam.stop();
    // document.body.scrollTop = 0;
    document.getElementsByTagName("canvas")[0].remove();
    labelContainer.style.display = "none";
    resultContainer.style.display = "none";
    document.getElementById("progressBar").style.display = "none";
    document.documentElement.scrollTop = 0;
    a = false;
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {

        // menampilkan persentase
        if (prediction[i].probability.toFixed(2) <= 0.13) {
            persentase = "0%";
        } else if (prediction[i].probability.toFixed(2) <= 0.37 & prediction[i].probability.toFixed(2) > 0.13 ) {
            persentase = "25%";
        } else if (prediction[i].probability.toFixed(2) <= 0.63 & prediction[i].probability.toFixed(2) > 0.37 ){
            persentase = "50%";
        } else if (prediction[i].probability.toFixed(2) <= 0.87 & prediction[i].probability.toFixed(2) > 0.63 ){
            persentase = "75%";
        } else{
            persentase = "100%";
        }
        document.getElementById("bar"+i).style.width = persentase;
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            // prediction[i].probability.toFixed(2)
        labelContainer.childNodes[i].innerHTML = classPrediction;

        // menampilkan hasil
        if (prediction[i].probability.toFixed(2) >= 0.5) {
            hasil = prediction[i].className;
        }
        resultContainer.innerHTML="Hasil : " +hasil;
    }
}



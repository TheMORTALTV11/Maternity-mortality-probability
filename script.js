// Load the Teachable Machine model
const URL = "https://teachablemachine.withgoogle.com/models/45fHa_hwi/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup the webcam
    const flip = true;
    webcam = new tmImage.Webcam(640, 480, flip);

    try {
        await webcam.setup({ facingMode: "environment" }); // Request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Append the webcam video element to the container
        document.getElementById("webcam").appendChild(webcam.canvas);
    } catch (error) {
        console.error("Error accessing webcam: ", error);
        alert("Webcam access is required for this application. Please check your browser settings and permissions.");
    }

    labelContainer = document.getElementById("result");
}

// Loop to update the webcam frame
async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

// Run the model on the frame from the webcam
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    prediction.sort((a, b) => b.probability - a.probability);

    const highestPrediction = prediction[0];
    labelContainer.innerHTML = `Risk Level: ${highestPrediction.className} (${Math.round(highestPrediction.probability * 100)}%)`;
}

document.getElementById("predict-button").addEventListener("click", predict);

// Initialize the webcam and model
init();

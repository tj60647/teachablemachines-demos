/**
 * @fileoverview This p5.js sketch captures video from the user's webcam,
 * displays it on the canvas, and classifies frames using an ml5.js image
 * classifier backed by a Teachable Machine model.
 *
 * It shows multiple predictions with varying transparency levels based on
 * confidence. The model provided is imperfect — it detects:
 *   • Red toque
 *   • Orange toque
 *   • Bike helmet
 *   • No hat
 *   • Background
 * …with some uncertainty between categories.
 *
 * To make your own model, visit https://teachablemachine.withgoogle.com/train
 * and update MODEL_URL below to point to your exported model.
 *
 * @author Thomas J McLeish
 * @date March 19, 2025
 * @license MIT
 */

// ── Configuration ────────────────────────────────────────────────────────────

/**
 * URL to the Teachable Machine model JSON file.
 * Replace this with the URL of your own exported model to use a different
 * classifier.
 * @constant {string}
 */
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/c5uGYH2xj/model.json';

// ── Global state ─────────────────────────────────────────────────────────────

/**
 * ml5.js Image Classifier instance.
 * @type {ml5.ImageClassifier}
 */
let classifier;

/**
 * p5.js Video Capture object.
 * @type {p5.Element}
 */
let video;

/**
 * Array of the most recent classification results (label + confidence pairs).
 * Sorted highest-confidence-first before rendering.
 * @type {Array<{label: string, confidence: number}>}
 */
let results = [];

// ── p5.js lifecycle ───────────────────────────────────────────────────────────

/**
 * Preloads the ml5.js image classification model before setup() runs.
 * Keeping this in preload() ensures the model is ready the moment the
 * sketch starts.
 */
function preload() {
  classifier = ml5.imageClassifier(MODEL_URL);
}

/**
 * Sets up the p5.js canvas, initialises webcam capture, and starts the
 * classification loop once the video stream is ready.
 */
function setup() {
  createCanvas(640, 480);
  background(0);

  // Request the front-facing camera ("user").
  // Change to "environment" to request the rear camera on mobile devices.
  video = createCapture({
    video: {
      facingMode: 'user'
    }
  });

  video.size(640, 480);
  video.hide(); // Use only the canvas — hide the default <video> element.

  // Wait until the video stream has data before starting classification.
  video.elt.onloadeddata = () => {
    console.log('Video loaded — starting classification.');
    classifyVideo();
  };
}

/**
 * p5.js draw loop — renders the live video and overlays classification results
 * on every animation frame.
 */
function draw() {
  background(0);
  image(video, 0, 0, width, height);

  if (results.length > 0) {
    // Sort so the highest-confidence prediction appears first.
    results.sort((a, b) => b.confidence - a.confidence);

    for (let i = 0; i < results.length; i++) {
      // Map rank to opacity: rank 0 → 255 (opaque), last rank → 50 (faint).
      let alpha = map(i, 0, results.length - 1, 255, 50);
      fill(255, alpha);
      noStroke();
      textSize(32);
      textAlign(LEFT, TOP);
      text(
        `${results[i].label} (${(results[i].confidence * 100).toFixed(1)}%)`,
        20,
        30 + i * 40
      );
    }
  }
}

// ── Classification loop ────────────────────────────────────────────────────────

/**
 * Sends the current video frame to the ml5.js classifier.
 * Only runs if the video stream is fully ready (readyState === 4).
 */
function classifyVideo() {
  if (video.elt.readyState === 4) {
    classifier.classify(video, gotResult);
  }
}

/**
 * Callback invoked by ml5.js each time a new set of predictions is ready.
 * Stores the results and immediately schedules the next classification so
 * the loop runs continuously.
 *
 * @param {Array<{label: string, confidence: number}>} newResults
 *   Array of label/confidence pairs returned by the model.
 */
function gotResult(newResults) {
  if (newResults && newResults.length > 0) {
    results = newResults;
  }
  classifyVideo();
}

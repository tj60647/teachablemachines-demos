/**
 * @fileoverview This p5.js sketch captures video from the user's webcam,
 * displays it on the canvas, and classifies frames using a Teachable Machine
 * image model loaded directly via the @teachablemachine/image library.
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
 * and update MODEL_BASE_URL below to point to your exported model.
 *
 * @author Thomas J McLeish
 * @date March 19, 2025
 * @license MIT
 */

// ── Configuration ────────────────────────────────────────────────────────────

/**
 * Base URL of the Teachable Machine model (the folder that contains
 * model.json and metadata.json).  Keep the trailing slash.
 * Replace this with the base URL of your own exported model.
 * @constant {string}
 */
const MODEL_BASE_URL = 'https://teachablemachine.withgoogle.com/models/c5uGYH2xj/';

/** Full URL to the model topology file. @constant {string} */
const MODEL_JSON_URL     = MODEL_BASE_URL + 'model.json';

/** Full URL to the class-label metadata file. @constant {string} */
const MODEL_METADATA_URL = MODEL_BASE_URL + 'metadata.json';

// ── Global state ─────────────────────────────────────────────────────────────

/**
 * Teachable Machine image model instance.
 * @type {tmImage.CustomMobileNet|null}
 */
let model = null;

/**
 * p5.js Video Capture object.
 * @type {p5.Element}
 */
let video;

/**
 * True once the webcam stream has data and is ready to classify.
 * @type {boolean}
 */
let videoReady = false;

/**
 * Array of the most recent classification results (label + confidence pairs).
 * Sorted highest-confidence-first before rendering.
 * @type {Array<{label: string, confidence: number}>}
 */
let results = [];

// ── p5.js lifecycle ───────────────────────────────────────────────────────────

/**
 * Sets up the p5.js canvas, initialises webcam capture, and loads the
 * Teachable Machine model asynchronously.  Classification begins as soon as
 * both the model and the video stream are ready, whichever finishes last.
 */
function setup() {
  const cnv = createCanvas(640, 480);
  cnv.parent('sketch-wrapper');
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

  // Load the Teachable Machine model.  tmImage is the global exposed by the
  // @teachablemachine/image CDN script.
  tmImage.load(MODEL_JSON_URL, MODEL_METADATA_URL)
    .then(function(loadedModel) {
      model = loadedModel;
      // If the video stream was already ready by the time the model loaded,
      // start classifying immediately.
      if (videoReady) {
        console.log('Model loaded — starting classification.');
        classifyVideo();
      }
    });

  // Wait until the video stream has data before starting classification.
  video.elt.onloadeddata = function() {
    videoReady = true;
    if (model) {
      console.log('Video loaded — starting classification.');
      classifyVideo();
    }
  };
}

/**
 * p5.js draw loop — renders the live video and overlays classification results
 * on every animation frame.  Each label is drawn with a semi-transparent dark
 * backing so it stays legible regardless of what the camera sees behind it.
 */
function draw() {
  background(0);
  image(video, 0, 0, width, height);

  if (results.length > 0) {
    // Sort so the highest-confidence prediction appears first.
    results.sort((a, b) => b.confidence - a.confidence);

    textSize(32);
    textAlign(LEFT, TOP);

    for (let i = 0; i < results.length; i++) {
      // Map rank to opacity: rank 0 → 255 (opaque), last rank → 50 (faint).
      let alpha = map(i, 0, results.length - 1, 255, 50);
      let label = `${results[i].label} (${(results[i].confidence * 100).toFixed(1)}%)`;

      // Draw a semi-transparent dark pill behind the text so it reads clearly
      // over any background in the video frame.
      let tw = textWidth(label);
      let th = 32; // approximate text height at textSize(32)
      let padX = 8;
      let padY = 4;
      let x = 20;
      let y = 30 + i * 40;

      noStroke();
      fill(0, alpha * 0.75); // dark backing, fades with the label
      rect(x - padX, y - padY, tw + padX * 2, th + padY * 2, 4);

      fill(255, alpha);
      text(label, x, y);
    }
  }
}

// ── Classification loop ────────────────────────────────────────────────────────

/**
 * Sends the current video frame to the Teachable Machine model.
 * Only runs if both the model and video stream are fully ready.
 */
function classifyVideo() {
  if (!model || video.elt.readyState !== 4) return;
  model.predict(video.elt).then(gotResult);
}

/**
 * Callback invoked each time a new set of predictions is ready.
 * Maps the Teachable Machine prediction format ({className, probability})
 * to the internal format ({label, confidence}), stores the results, and
 * immediately schedules the next classification so the loop runs continuously.
 *
 * @param {Array<{className: string, probability: number}>} predictions
 *   Array of class/probability pairs returned by the model.
 */
function gotResult(predictions) {
  if (predictions && predictions.length > 0) {
    results = predictions.map(p => ({ label: p.className, confidence: p.probability }));
  }
  classifyVideo();
}

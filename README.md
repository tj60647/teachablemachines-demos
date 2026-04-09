# Teachable Machines Demos

## About This Project

**Teachable Machines Demos** is a project in the MDes Prototyping course at CCA. It focuses on one new skill:

**Training a custom image classifier in the browser — without writing any machine-learning code — and dropping it into a live p5.js webcam sketch.**

The hands-on thread running through the project is a **headwear classifier**: you point your webcam at yourself, and a model trained with Google's Teachable Machine tells you in real time whether you are wearing a red toque, an orange toque, a bike helmet, or nothing at all.

> **Ready to start?** Jump straight to the [Getting Started Checklist](#getting-started-checklist) at the bottom of this document.

> **🖼️ Gallery:** Browse and run every sketch in the project in the [Code Example Gallery](https://tj60647.github.io/teachablemachines-demos/gallery/).

---

## The Tools We Use

This project links three main pieces:

1. **Teachable Machine** — a browser-based tool from Google that lets you collect image samples from your webcam and train a custom model in minutes, no code required
2. **ml5.js** — a friendly JavaScript library that loads and runs your exported Teachable Machine model inside a web page
3. **p5.js sketches** in the browser that capture webcam frames, feed them to the model, and display the predictions

### Teachable Machine

[Teachable Machine](https://teachablemachine.withgoogle.com) is a web-based tool that makes training machine learning models fast and accessible. You collect image samples directly from your webcam (or upload files), click **Train**, and the model is ready to use — all without leaving the browser.

When training is complete you click **Export Model** and choose **Upload (shareable link)**. Teachable Machine hosts the model files for you and gives you a URL ending in `model.json`. That URL is all you need to use the model in code.

In this project Teachable Machine is used to:
- collect training images for each class (category) from the webcam
- train an image classification model in the browser
- export the trained model as a hosted URL

### ml5.js

[ml5.js](https://ml5js.org) is a JavaScript library built on top of TensorFlow.js that wraps common machine-learning tasks — image classification, pose estimation, sound classification, and more — in a beginner-friendly API.

In this project ml5.js is used to:
- load a Teachable Machine model from a URL (`ml5.imageClassifier(url)`)
- classify a live webcam frame and return an array of label/confidence pairs
- loop the classification in real time so predictions update continuously

### p5.js

[p5.js](https://p5js.org) is a JavaScript library designed to make programming graphics, animation, and interaction easier in the web browser. It was created as a web-based evolution of the Processing language and is widely used in creative coding, art, and design education.

In this project p5.js is used to:
- open a webcam video stream with `createCapture()`
- draw the live video to a canvas with `image()`
- overlay the classification results as text on top of the video

### OpenProcessing

[OpenProcessing](https://openprocessing.org) is an online platform for writing, running, and sharing p5.js sketches. It provides a browser-based code editor and a large community gallery of examples.

You can run any sketch in this project on OpenProcessing by pasting the contents of `sketch.js` into a new sketch there. If you prefer to work locally, open the matching `index.html` file in any modern browser instead.

---

## Where This Fits in the Course

| Project | Focus |
|---|---|
| ← [**Smart Object Foundations**](https://github.com/tj60647/smart-object-foundations) | WebSerial, p5.js visualization, signal processing from raw sensor data |
| → **Teachable Machines Demos** *(you are here)* | Teachable Machine, ml5.js, real-time image classification in the browser |
| **Interactive Environment** | *(next project)* |

**You build on what you already know.** The p5.js and browser-based coding skills you practised in Smart Object Foundations carry directly into this project. The new addition is the machine-learning layer: training a model and running it live in the browser.

---

## What You Will Build

A real-time image classifier running entirely in the browser:

```
webcam frame
      ↓
  ml5.imageClassifier (Teachable Machine model loaded from URL)
      ↓
  array of { label, confidence } predictions
      ↓
  p5.js draws video + overlays labels sorted by confidence
```

The predictions are displayed as text overlaid on the live video, fading from fully opaque (highest confidence) to semi-transparent (lower confidence) so you can see all candidate classes at once.

---

## Folder Structure

Each demo has a self-contained folder. Open p5 sketches locally via `index.html` in any modern browser, or paste `sketch.js` into a new OpenProcessing sketch.

```
demo-1-hat-classifier/
└── p5/
    ├── index.html    ← open locally in any modern browser
    └── sketch.js     ← paste into OpenProcessing

gallery/
└── index.html        ← browse all demos from one page
```

---

## Demo 1 — Hat Classifier

Classify five headwear categories in real time from your webcam.

**What the model detects:**

| Class | Description |
|---|---|
| Red toque | A red knit winter hat |
| Orange toque | An orange knit winter hat |
| Bike helmet | A cycling helmet |
| No hat | Bare head, no headwear |
| Background | No person in frame |

📂 **p5.js sketch:** [`demo-1-hat-classifier/p5/sketch.js`](demo-1-hat-classifier/p5/sketch.js)

- **OpenProcessing:** paste the contents of `sketch.js` into a new sketch.
- **Locally:** open `demo-1-hat-classifier/p5/index.html` in any modern browser.

Grant camera access when prompted. The sketch will start classifying immediately. All five predictions are shown simultaneously — the highest-confidence label is fully opaque and the rest fade out proportionally.

> **📐 Concept Sidebar: What Is Image Classification?**
>
> Image classification is the task of assigning one label (from a fixed set of categories) to an input image. A **confidence score** between 0 and 1 is assigned to each category, and all scores sum to 1.
>
> Teachable Machine trains a **transfer learning** model: it takes a large, pre-trained image recognition network (MobileNet) and fine-tunes only the final layer on your own data. This means you need far fewer training images — often 30–100 per class — than training from scratch.

> **📐 Concept Sidebar: Why Show All Predictions?**
>
> A classifier always outputs a score for every class, even when it is uncertain. Showing only the top-1 result hides useful information — for example, whether the model is 99% confident or only 51% confident.
>
> This sketch maps rank to opacity so you can see the full distribution at a glance. When the model is confident, only the top label is clearly visible. When it is uncertain, two or three labels appear at similar brightness, which is a useful signal that the model needs more training data for that case.

> **📐 Concept Sidebar: The `readyState` Check**
>
> The classification loop calls `video.elt.readyState === 4` before passing the video to the classifier. `readyState` is a browser property that tracks the loading state of a media element:
>
> | Value | Meaning |
> |---|---|
> | 0 | No data loaded |
> | 1 | Metadata loaded (duration, dimensions) |
> | 2 | Data for current position available |
> | 3 | Enough data to play |
> | **4** | **Enough data to play to the end without buffering** |
>
> Checking for 4 ensures a complete frame is available before classification, which prevents errors on slow or freshly-opened camera streams.

**Deliverable:** The sketch displays live video with all five class labels overlaid. The highest-confidence label is easy to read; lower-confidence labels fade out.

---

## How to Make Your Own Model

You can replace the hat classifier with any model you train yourself. The steps are:

### 1. Open Teachable Machine

Go to [https://teachablemachine.withgoogle.com/train](https://teachablemachine.withgoogle.com/train) and choose **Image Project → Standard image model**.

### 2. Define your classes

Rename **Class 1** and **Class 2** to your category names. Add more classes with the **Add a class** button.

> **Tip:** Use descriptive names — they appear directly as the label text in the sketch.

### 3. Collect training images

For each class, click **Webcam** and hold down **Hold to Record** while pointing the camera at examples of that class. Aim for at least 50–100 images per class, varying your angle, distance, and background.

> **More variety = better generalisation.** If you only record images against one background, the model may be detecting the background rather than the object.

### 4. Train the model

Click **Train Model**. Training runs entirely in your browser using your GPU. A typical model with 5 classes and ~100 images per class trains in under 60 seconds.

Watch the **Accuracy per class** graph after training. If any class shows low accuracy, collect more or more varied samples for that class and retrain.

### 5. Preview and test

Use the **Preview** panel to test the model live from your webcam before exporting. Check that each class is recognised reliably and that the model does not confuse similar classes.

### 6. Export the model

Click **Export Model → Upload (shareable link) → Upload my model**.

Teachable Machine uploads your model files and gives you a URL ending in `/model.json`, for example:

```
https://teachablemachine.withgoogle.com/models/abc123xyz/model.json
```

Copy this URL.

### 7. Update the sketch

Open `demo-1-hat-classifier/p5/sketch.js` and replace the `MODEL_URL` constant at the top of the file:

```js
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/model.json';
```

Save the file and reload the page (or refresh the OpenProcessing sketch). The classifier will now use your model.

---

## Code Walkthrough

The sketch is built around four functions that work together:

```
preload()      loads the ml5 model from MODEL_URL before setup() runs
setup()        creates the canvas, starts the webcam, waits for video ready
draw()         runs ~60× per second: draws video, overlays sorted results
classifyVideo() sends one frame to the model → gotResult callback
gotResult()    stores new results → calls classifyVideo() again (loop)
```

### The classification loop

The loop is **callback-driven**, not timer-driven:

```js
function classifyVideo() {
  if (video.elt.readyState === 4) {
    classifier.classify(video, gotResult);  // async — returns immediately
  }
}

function gotResult(newResults) {
  results = newResults;   // store for draw()
  classifyVideo();        // schedule next classification
  // Note: error handling omitted here for brevity.
  // In production code you would check for null/undefined newResults
  // before assigning (which the full sketch already does).
}
```

`classify()` is asynchronous — it returns immediately and calls `gotResult` when the model finishes. `gotResult` then calls `classifyVideo()` again. This creates a self-sustaining loop that runs as fast as the model allows, without blocking the draw loop.

### Confidence-to-opacity mapping

```js
results.sort((a, b) => b.confidence - a.confidence);

for (let i = 0; i < results.length; i++) {
  let alpha = map(i, 0, results.length - 1, 255, 50);
  fill(255, alpha);
  text(`${results[i].label} (${(results[i].confidence * 100).toFixed(1)}%)`, 20, 30 + i * 40);
}
```

`results` is sorted highest-to-lowest confidence, then p5's `map()` function converts the rank index `i` into an alpha value between 255 (fully opaque, rank 0) and 50 (nearly invisible, last rank). The label and percentage are printed at vertical positions `30, 70, 110, …` — 40 pixels apart.

---

## Getting Started Checklist

Work through these steps in order:

- [ ] Open the [Gallery](https://tj60647.github.io/teachablemachines-demos/gallery/) and run **Demo 1 — Hat Classifier**
- [ ] Read [Demo 1 — Hat Classifier](#demo-1--hat-classifier) above
- [ ] Read the [Code Walkthrough](#code-walkthrough) and make sure you understand each function
- [ ] Open [Teachable Machine](https://teachablemachine.withgoogle.com/train) and create a new **Image Project**
- [ ] Collect at least 3 classes with 50+ images each and train a model
- [ ] Export your model and copy the `model.json` URL
- [ ] Replace `MODEL_URL` in `sketch.js` with your new URL and confirm it works
- [ ] (Stretch) Add a UI element — a button, colour change, or sound — that triggers when the top prediction crosses a confidence threshold

---

## License

MIT — see [LICENSE](LICENSE) for details.

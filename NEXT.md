# Next

Updated: 2026-11-22

## Where it stands

Teachable Machine demos for the MDes Prototyping course at CCA: train an image classifier in the browser with Google's Teachable Machine and run it in a p5.js webcam sketch, with a headwear classifier as the worked example. The gallery is published on GitHub Pages and answers. It was built in one day, 9 April 2026; the last change replaced ml5.js with TensorFlow.js and Teachable Machine's own library to fix a video loading error.

## Next step

Update the README to match the code. It still says ml5.js loads and runs the model (eight mentions, including `ml5.imageClassifier(url)`), but the demo now loads it with `tmImage.load()` from `@teachablemachine/image` on TensorFlow.js. Rewrite "The Tools We Use" and any code walkthrough to match `demo-1-hat-classifier/p5/sketch.js`.

## After that

- Nothing else planned until the course needs another demo.

## Blocked or waiting

- None.

## Open questions

- Will the course run this project again, and does it need more demos than the hat classifier?
- This plan was drafted by Claude on 2026-11-22 from the code and its history. Is the next step right?

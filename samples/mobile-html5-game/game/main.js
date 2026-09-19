function setup() {
  const renderer = createCanvas(window.innerWidth, window.innerHeight);
    // const renderer = createCanvas(windowWidth, windowHeight);
  const canvas = renderer.elt;

  canvas.style.touchAction = "none";

  const preventGesture = e => e.preventDefault();

  canvas.addEventListener("gesturestart", preventGesture, {
    passive: false
  });

  canvas.addEventListener("gesturechange", preventGesture, {
    passive: false
  });
}

function draw() {
  // put drawing code here
  background(55);
  fill("white");
  circle(100, 50, 50);
}

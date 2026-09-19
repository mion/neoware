function setup() {
  const c = createCanvas(window.innerWidth, window.innerHeight);
  
  c.elt.addEventListener(
    "gesturestart",
    e => e.preventDefault(),
    { passive: false }
  );

  c.elt.addEventListener(
    "gesturechange",
    e => e.preventDefault(),
    { passive: false }
  );
}

function draw() {
  // put drawing code here
  background(55);
  fill("white");
  circle(100, 50, 50);
}

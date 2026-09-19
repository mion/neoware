# How to Disable Pinch to Zoom on iOS

Since iOS 10, Safari deliberately ignores `user-scalable=no`, `maximum-scale=1`, etc. for normal web pages, largely for accessibility reasons. ([WebKit][1])

For a p5.js game, the modern solution is:

```css
canvas {
  touch-action: none;
}
```

`touch-action: none` tells the browser that touches beginning on the canvas belong to your application, so Safari should not interpret them as native pan/pinch gestures. This is specifically intended for things like maps, drawing surfaces, and games. ([MDN Web Docs][2])

So I'd set up a fullscreen p5 game roughly like this:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    overscroll-behavior: none;
  }

  canvas {
    display: block;
    touch-action: none;
  }
</style>
```

Or directly through p5:

```js
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  canvas.elt.style.touchAction = "none";
}
```

### For extra Safari insurance

Safari also has its old proprietary `gesturestart` / `gesturechange` events. Apple explicitly documents `preventDefault()` on them as a way to suppress its native pinch gesture. ([Apple Developer][3])

You can therefore do:

```js
function setup() {
  const renderer = createCanvas(windowWidth, windowHeight);
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
```

`GestureEvent` is WebKit-specific rather than a web standard, so I would consider that a Safari fallback rather than the primary mechanism. ([MDN Web Docs][4])

### I would use this combination

```css
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  overscroll-behavior: none;
}

canvas {
  touch-action: none;
}
```

```js
function setup() {
  const c = createCanvas(windowWidth, windowHeight);

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
```

That gives you the important behavior: **two fingers on the p5 canvas stay yours rather than suddenly zooming the entire Safari viewport.**

And importantly, you can still implement **your own pinch gesture inside the game** if you want — `touch-action: none` prevents *Safari* from consuming it; it doesn't stop you from reading the two touch/pointer positions yourself.

[1]: https://webkit.org/blog/7367/new-interaction-behaviors-in-ios-10/?utm_source=chatgpt.com "New Interaction Behaviors in iOS 10 | WebKit"
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action?utm_source=chatgpt.com "touch-action CSS property - CSS | MDN"
[3]: https://developer.apple.com/documentation/webkitjs/gestureevent?utm_source=chatgpt.com "GestureEvent | Apple Developer Documentation"
[4]: https://developer.mozilla.org/en-US/docs/Web/API/GestureEvent?utm_source=chatgpt.com "GestureEvent - Web APIs | MDN"


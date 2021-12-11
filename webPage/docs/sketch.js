function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent(p5Container)
  }
  
  function draw() {
    background(220);
    circle(mouseX, mouseY, 10)
  }
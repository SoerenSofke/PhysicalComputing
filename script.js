const brick = createBrick();

function mousePressed() {
  brick.toggleConnect()
}

function setup() {
  createCanvas(400, 400);  
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  
  colorCode1 = [255, 255, 255]
  colorCode2 = [237, 34, 93]
}

function draw() {
  if (brick.knobIsPressed === true) {
    colorBackground = colorCode1
    colorForeground = colorCode2
  } else {
    colorBackground = colorCode2
    colorForeground = colorCode1
  }

  background(colorBackground);
  fill(colorForeground);

  textSize(90);
  text("p5*", width / 2, height / 2);

  translate(width / 2, height / 2);
  rotate(brick.knobPosition * 6);
  textSize(30);
  text("Physical Computing", 0, 90);

  brick.ledColor(255, 0, 0, mouseX / width * 255)
  brick.servoA(mouseX / width)
  brick.servoB(mouseY / height)
}

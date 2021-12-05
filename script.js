function setup() {
  brick = createBrick();
  createCanvas(400, 400);
  textSize(30);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  fill("white");
}

function draw() {
  background(237, 34, 93, 60);

  translate(width / 2, height / 2);
  textSize(90);
  text("p5*", 0, 0);

  rotate(brick.knobPosition * 6);
  textSize(30);
  text("Physical Computing", 0, 90);

  brick.ledColor(255, 0, 0, mouseX / width * 255)
  brick.servoA(mouseX / width)
  brick.servoB(mouseY / height)
}

function mousePressed() {
  if (brick.isConnected)
    brick.disconnect()
  else
    brick.connect()
}

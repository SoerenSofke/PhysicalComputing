const board = createBoard();

function mousePressed() {
  board.toggleConnect()
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);

  colorBright = [50, 40, 2, 180]  
  colorDark = [236, 189, 9, 180]
}

function draw() {
  const [colorBackground, colorForeground] = board.knobIsPressed ? [colorBright, colorDark] : [colorDark, colorBright]
  background(colorBackground);
  fill(colorForeground);
    
  const verb = board.isConnected ? 'disconnect' : 'connect';
  
  textStyle(NORMAL);
  textSize(11);
  text('Click here to ' + verb + ' Johnny IV.', width / 2, 10)
  
  textSize(20);
  text("browser-based physical computing.", width /2, height / 1.6);

  textStyle(BOLD);
  textSize(75);
  translate(width / 2, height / 2 );
  rotate(board.knobPosition * 6);  
  text("Johnny IV", 0,0);
  
  board.led(255, 0, 0, mouseX / width * 255)
  board.servoA(mouseX / width)
  board.servoB(mouseY / height)
}

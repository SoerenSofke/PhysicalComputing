const rick = createRichard();

function mousePressed() {
  rick.toggleConnect()
}

function setup() {
  createCanvas(500, 500);  
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);

  colorBright = [255, 255, 255]
  colorDark = [237, 34, 93]
}

function draw() {
  const [colorBackground, colorForeground] = rick.knobIsPressed ? [colorBright, colorDark] : [colorDark, colorBright]
  background(colorBackground);
  fill(colorForeground);
    
  const verb = rick.isConnected ? 'disconnect' : 'connect';
  
  textStyle(NORMAL);
  textSize(11);
  text('Click in the web page to ' + verb + ' Richard-Five.', width / 2, 10)
  
  textSize(20);
  text("King of purely browser-based physical computing.", width /2, height / 1.6);

  textStyle(BOLD);
  textSize(75);
  translate(width / 2, height / 2 );
  rotate(rick.knobPosition * 6);  
  text("Richard-Five", 0,0);
  
  rick.ledColor(255, 0, 0, mouseX / width * 255)
  rick.servoA(mouseX / width)
  rick.servoB(mouseY / height)
}

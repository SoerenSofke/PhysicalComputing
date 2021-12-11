try {
  let myp5 = new p5(( sketch ) => {

    let x = 100;
    let y = 100;

    sketch.setup = () => {
      canvas = sketch.createCanvas(200, 200);
      canvas.parent(p5Container)
    };

    sketch.draw = () => {
      sketch.background(0);
      sketch.circle(sketch.mouseX, sketch.mouseY, 10)
      
    };
  });
} catch (error) {
  window.location.reload()
}
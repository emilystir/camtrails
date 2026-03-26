//var capture;
let video;
let record = 0; //brightest value
let brightX, brightY; //position of brightest pixel
let videoEnded = false;

let table;
let lon;
let lat;
let minLat = 51.2957;
let maxLat = 51.5857;
let minLon = -0.3370;
let maxLon = 0.1270;

//let circleCoords = []; //generated circle coordinate array


async function setup() {
  table = await loadJSON("flights.json");
  createCanvas(windowWidth,windowHeight);

  video = createVideo('contrails2.mp4');
  video.size(windowWidth,windowHeight);
  video.hide();
  video.elt.addEventListener('ended', () => {
      videoEnded = true;
    });

 blendMode(LIGHTEST);

/////////////////////.  FOR WEBCAM
//   capture = createCapture(VIDEO);
//   capture.size(400,300);
//   capture.hide();

  noCursor();

}

function draw() {


  push();
  blendMode(BLEND);
  noFill();
  stroke(0,0,255);
  rect(0,30,width,30);

  fill(0,0,255);
  textFont('courier new');
  textSize(25);
  text('rec[ ]',50,50);
  pop();

  tint(255,100);
  image(video,0,0,width,height);  
  video.loadPixels(); //loading all RBGA pixel values across video

//got help from claude with brightness tracking
  for (let x = 0; x < width; x+=2) {
    for (let y = 0; y < height; y+=2) {
    let i = (x + y * width) * 4;
// then:
let r = video.pixels[i];
let g = video.pixels[i + 1];
let b = video.pixels[i + 2];
let brightness = (r + g + b) / 3; //caclulate brightness

    
   // detect white
      if (r > 220 && g > 220 && b > 220) {
        noFill();
        stroke(0,0,255);
        circle(x, y, 10); // mark it
        //circleCoords.push({ x, y }); //store coordinates
      }

} } 

//console.log(circleCoords);

   //line drawing after video ends
 if (videoEnded) {

    push();
    strokeWeight(2);
    fill(255,255,255,10);
    rect(0,0,width,height);
    blendMode(BLEND);
    stroke(0,0,255);
    line(670,320,1700,950);

    let x = 670;
    let y = 320;
    let size = 30;
    rectMode(CENTER);
    rect(x,y,size,size);

   
    circle(mouseX,mouseY,7);

  if (mouseX > x - size/2 && mouseX < x + size/2 && 
      mouseY > y - size/2 && mouseY < y + size/2) {

        rectMode(CORNER);
        fill(0,0,255);
        rect(100, 400, 550, 400);


    noStroke();
    fill(0,0,255);
    textSize(12);
    textFont('courier new');
    textAlign(LEFT, BOTTOM);
//    text(table.states[1], x, y - size/2); // appears just above the box
    let time = table.time;
  //  textAlign(LEFT);
    text('time; ' + time,x, y - size/2 - 130);
    text('icao24; ' + table.states[1][0],x, y - size/2 - 90);
    text('callsign; ' + table.states[1][1],x, y - size/2 - 70);
    text('origin_country; ' + table.states[1][2],x, y - size/2 - 50);
    text('longitude; ' + table.states[1][5],x, y - size/2 - 30);
    text('latitude; ' + table.states[1][6],x, y - size/2 - 10);
    text("current airspace; 10 mile radius",100,390);
     //map the aeroplanes
    for (let i=0; i<7; i++) {
        let lon = table.states[i][5];
        let lat = table.states[i][6];

        // console.log(long);
        // console.log(lat);

        x = map(lon,minLon,maxLon,100,650);
        y = map(lat,minLat,maxLat,400,850);
        noStroke();
        fill(255);
        ellipse(x,y,10,10);
    }


    }
    pop();
  }


}

function mousePressed() {
  video.play();
}
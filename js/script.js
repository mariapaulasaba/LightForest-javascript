var loading, loadingImg, bgImg, treesImg, frontImg, corujaImg, lightImg;
var trees = [];
var birds = [];
var bugs = [];

var rabbit1, rabbit2, squirrel1, squirrel2;
var corujaCounter = 0;

var corujaSound = document.getElementById("coruja"); 
var birdsSound = document.getElementById("asas"); 
var rabbitSound = document.getElementById("coelho"); 
var squirrelSound = document.getElementById("esquilo"); 

var ambientSound = document.getElementById("ambient"); 
ambient.volume = 0.1;
birdsSound.volumem = 2;
corujaSound.volume = 0.3;
squirrelSound.volume = 0.3;
rabbitSound.volume = 0.2;

var counter = 0;

function setup() {
	  loading = true;
      bgImg = loadImage('img/cenario1.jpg')
	  treesImg = loadImage('img/arvores.png');
	  frontImg = loadImage('img/frente.png');
	  corujaImg = loadImage('img/coruja.png');
	  lightImg = loadImage('img/light.png');
	  loadingImg = loadImage('img/loading.jpg');
	
      canvas = createCanvas(1024, 768);
      canvas.parent('p5-container');

	  trees[0] = new Tree(40, 190, 260, 200);
	  trees[1] = new Tree(360, 130, 350, 240);
	  trees[2] = new Tree(720, 195, 280, 180);

	  for (var i = 0; i < 25; i++) {
		birds[i] = new Bird();
	  }

	  for (var i = 0; i < 20; i++) {
		bugs[i] = new Bug();
	  }
	  squirrel1 = new Squirrel(1);
	  squirrel2 = new Squirrel(2);
	
	  
	  rabbit1 = new Rabbit(random(100, 800), 600, 1);
	  rabbit2 = new Rabbit(random(100, 800), 675, 2);

	
  }
  


function draw() {
  	 load();
     if(!loading){
		 var mouse = createVector(mouseX, mouseY);
		 clear();
		 imageMode(CORNER);
		 image(bgImg, 0, 0 );     

		 displayRabbits(mouse);
		 displayBirds();
		 displaySquirrels(mouse);
		 displayBugs(mouse);
		 image(frontImg, 0, 0 );     

		flashlight();
	 }
	
	
	
	
}





function Tree(tempX, tempY, tempW,  tempH){
   this.x = tempX;
   this.y = tempY;
   this.h = tempH;
   this.w = tempW;
   this.x2 = this.x + this.w;
   this.y2 = this.y + this.h;
   this.x3 = this.x + this.w/2;
  
}


var flashlight = function(){
 if (dist(mouseX, mouseY, 180, 440) < 50) { 
    if (corujaCounter == 0) {
      corujaSound.play();
    }
    corujaCounter++;
	 
    if (corujaCounter > 20) corujaCounter = 0;
  }

  image(corujaImg, 160, 420, 30, 50);
  imageMode(CENTER);
  if(mouseX > 0 && mouseX < 1024){
    image(lightImg, mouseX, mouseY,180, 180);  
  }	
  imageMode(CORNER);

}

var load = function(){
	if(counter < 60) { 
		counter++
	    image(loadingImg, 0 , 0);
	}
	if(counter == 60){
		loading = false;
	}

}



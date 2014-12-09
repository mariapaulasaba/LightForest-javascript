var displaySquirrels = function(t){
  squirrel1.scare(rabbit1, birds);
  squirrel2.scare(rabbit1, birds);

  squirrel1.avoid(t);
  squirrel2.avoid(t);
  squirrel1.setNewGoal();
  squirrel2.setNewGoal();

  squirrel1.update();
  squirrel1.arrive();
  squirrel1.display();

  squirrel2.update();
  squirrel2.arrive();
  squirrel2.display();
	
}


function Squirrel(t) {
    this.t = t;
    this.counter = 0;
    if (t == 1) {
      this.h = -40;
      this.w = 15;
    }
    else {
      this.h = 0;
      this.w = -70;
    }

    this.topLocation = createVector(trees[t].x3+this.w, trees[t].y2+this.h);
    this.bottomLocation = createVector(trees[t].x3+this.w, trees[t].y2+this.h+200);

    this.location = this.topLocation.get();
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0.5);    
    this.r = 6;
    this.maxspeed = 3;
    this.maxforce = 0.05;

    this.goal = this.location;
    this.reached = true;
    this.light = true;   

    if (t == 1) {
      this.img1 = loadImage("img/squirrel.png");
      this.img2 = loadImage("img/squirrel2.png");
    }
    else {
      this.img1 = loadImage("img/squirrel3.png");
      this.img2 = loadImage("img/squirrel4.png");
    }
  }


  Squirrel.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

  
  Squirrel.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
	this.location.add(this.velocity);
    this.acceleration.mult(0);

	if (this.velocity.y < 0.01 && this.velocity.y > -0.01) this.direction = true;
    else if (this.velocity.y > 0) this.direction = false;
    else this.direction = true;
	  
  }

Squirrel.prototype.arrive = function() {
    var desired = p5.Vector.sub(this.goal, this.location); 
	var d = desired.mag();
	
    if (d < 5) {
      this.reached = true;
    }
    else this.reached = false;

	
    if (d < 100) {
      var m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } 
    else {
      desired.setMag(this.maxspeed);
    }

	var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  
    this.applyForce(steer);
}


Squirrel.prototype.display = function() {
	var theta = this.velocity.heading();
    fill(175);
    stroke(0);
	push();
    translate(this.location.x, this.location.y);
	
	if(this.direction){
		if (this.velocity.y < -0.5 || this.velocity.y > 0.5) {
			  if (this.counter <= 5) image(this.img1, 0, 0, 40, 85);     
			  else if (this.counter > 5 && this.counter <=10) image(this.img2, 0, 0, 40, 85);
		  }
		  else {
			  image(this.img1, 0, 0, 40, 85);
		}
	}
    else {
      push();
      scale(1, -1);
      if (this.velocity.y < -0.5 || this.velocity.y > 0.5) {
        if (this.counter <= 5) image(this.img1, 0, -42, 40, 85);     
        else if (this.counter > 5 && this.counter <=10) image(this.img2, 0, -42, 40, 85);
      }
      else image(this.img1, 0, -42, 40, 85);
      pop();
    }
    pop();
	this.counter ++;
    if (this.counter > 10) this.counter = 0;
    stroke(255, 0, 0);
}
 
 
  

Squirrel.prototype.setNewGoal = function(){

    if(this.light && this.reached){
	squirrelSound.play();
	
	this.goal = createVector(this.location.x, random(this.topLocation.y, this.bottomLocation.y));
	
	var d = abs(this.location.y - this.goal.y);
	while(d <100){
		this.goal = createVector(this.location.x, random(this.topLocation.y,this.bottomLocation.y));
	    d = abs(this.location.y - this.goal.y);
	}
}

    
    else {
      var prob = Math.round(random(500));
		
      if (prob == 499)  { 
		  this.goal = createVector(this.location.x, random(this.topLocation.y,this.bottomLocation.y));
	  }
		  
	}
    this.light = false;

}


Squirrel.prototype.avoid = function(target){
	var diff = p5.Vector.sub(this.location, target);
	if(diff.mag()<70) this.light = true;
}


	
	
	
	
Squirrel.prototype.scare = function(rabbit, birds){
	var diff = p5.Vector.sub(this.location, rabbit.location);
	if(diff.mag()<70) this.light = true;
  	for (var i = 0; i < birds.length; i++) {
		var d  = p5.Vector.sub(this.location, birds[i].location);
		if(d.mag()<40) this.light = true;
	}
}



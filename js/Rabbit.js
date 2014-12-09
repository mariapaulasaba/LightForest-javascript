var displayRabbits = function(t){
	  rabbit1.avoid(t);
	  rabbit1.update();
	  rabbit1.display();
      image(treesImg, 0, 0 );     

	  rabbit2.avoid(t);
	  rabbit2.update();
	  rabbit2.display();

}



function Rabbit(x, y, n) {
    this.location = createVector(x, y);
    this.ground = this.location.y;
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);   
    this.light = false;
    this.frame = 0;
    this.direction = true;
    this.r = n;
    this.pv = 1;
	

    if (n == 1) {
      this.w = 74;
      this.h = 67;
      this.img1 = loadImage("img/rabbit1.png");
      this.img2 = loadImage("img/rabbit2.png");
    }
    else {
      this.w = 86;
      this.h = 78;
      this.img1 = loadImage("img/rabbit3.png");
      this.img2 = loadImage("img/rabbit4.png");
    }
  }



Rabbit.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

Rabbit.prototype.update = function(){
	this.gravity();
	this.impulse();
	this.velocity.add(this.acceleration);
	this.location.add(this.velocity);
	this.acceleration.mult(0);
	
	if(this.location.x > width-100) this.direction = false;
	else if (this.location.x < 50) this.direction = true;
}

Rabbit.prototype.gravity = function(){
	var force = createVector(0, 0.5);
	this.applyForce(force);

	if(this.location.y > this.ground){
		this.velocity.mult(0);
		this.location.y = this.ground;
	}
}



Rabbit.prototype.impulse = function(){
	var impulse = createVector(0, 0);
	if (this.light) {
      this.frame ++;     
      //setting velocity through direction 
      if (this.direction) impulse = createVector(3.5, -4.5);
      else impulse = createVector(-3.5, -4.5);
      //giving impulse
      if (this.location.y < this.ground+1 && this.location.y > this.ground-1) {
        rabbitSound.play();
        this.velocity = impulse;
      }

      //keep walking til random times
      if (this.frame > random(20, 80)) {
        this.light = false;
        this.frame = 0;

        //determine next direction 
        if (random(1)>0.8)   this.direction = !this.direction;
        else this.direction = false;
      }
    }
}


Rabbit.prototype.avoid = function(target){
	var diff = p5.Vector.sub(this.location, target);
	if(diff.mag()<70){
		if (this.location.x < width  && this.location.x > target.x) this.direction = true;
        else if (this.location.x > 0 && this.location.x < target.x) this.direction = false; 
		this.light = true;
		
	}
	
	var prob = random(1);
    if (prob < 0.001) this.light = true;
}

Rabbit.prototype.display = function() {
    imageMode(CENTER);
    push();
    translate(this.location.x, this.location.y);
    if (this.location.y > this.ground+ 5 || this.location.y < this.ground-5) {
		 if (this.velocity.x < 0) {
			image(this.img2, this.w/2, 0, this.w, this.h);
			this.pv = 0;
		  }
		  else {
			push();
			scale(-1, 1);
			image(this.img2, -this.w/2, 0, this.w, this.h);
			pop();
			this.pv = 1;
		  }     
    }


    else if (this.pv == 0) image(this.img1, this.w/2, 0, this.w, this.h);
    else {
      push();
      scale(-1, 1);
      image(this.img1, -this.w/2, 0, this.w, this.h);
      pop();
    }
    pop();
    imageMode(CORNER);
}


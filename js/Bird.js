
var displayBirds = function(){
	for (var i = 0; i < birds.length; i++) {
    
	birds[i].applyBehaviors(birds);
    birds[i].update();
    birds[i].display();

    var d = dist(mouseX, mouseY, birds[i].location.x, birds[i].location.y);
   if (d < 100) {
      birds[i].light = true;
      birdsSound.play();
	  
    }
    var prob = random(1);
    if (prob < 0.0001) {
      birds[i].light = true;
      birdsSound.play();
    }
    birds[i].avoid();
  }
}





function Bird() {
    this.t = Math.floor(random(3));

	this.acceleration = createVector();
	this.velocity = createVector();
    this.goal = createVector(random(trees[this.t].x, trees[this.t].x2), random(trees[this.t].y, trees[this.t].y2));    
	  
	
    this.img0 = loadImage("img/cbird0.png");
    this.img1 = loadImage("img/cbird1.png");
    this.img2 = loadImage("img/cbird2.png");
    this.img3 = loadImage("img/cbird3.png");

    this.location = this.goal;

    this.maxspeed = 7;
    this.maxforce = 4;
    this.light = false;
    this.reached = true;
	
    this.prob = random(1);
    if(this.prob > 0.5) this.direction = true;
    else this.direction = false;
    this.counter = 0;
  }
	

Bird.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

Bird.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }


Bird.prototype.display = function() {
    imageMode(CENTER);
    push();
    translate(this.location.x, this.location.y);
    if (this.velocity.x < 0.05 && this.velocity.x > -0.05) {
      if (this.direction) {
        push();
        scale(-1, 1);
        image(this.img0, -20, 0, 40, 31);      
        pop();
      }
      else {
        image(this.img0, 20, 0, 40, 31);
      }
 
    }
    else {
      if (this.velocity.x >0) {
        push();
        scale(-1, 1);  
        if (this.counter <= 5) image(this.img1, -20, 0, 40, 31);
        else if (this.counter > 5 && this.counter <=10) image(this.img2, -20, 0, 40, 31);
        else if (this.counter > 10 && this.counter <=13) image(this.img3, -20, 0, 40, 31);
        else if (this.counter > 13 && this.counter <=20) image(this.img2, -20, 0, 40, 31); 
        else if (this.counter > 20) {
          image(this.img1, -20, 0, 40, 31);  
          this.counter = 0;
        }
        pop();
        this.counter ++;
      }
      else {
        if (this.counter <= 5) image(this.img1, 20, 0, 40, 31);
        else if (this.counter > 5 && this.counter <=10) image(this.img2, 20, 0, 40, 31);
        else if (this.counter > 10 && this.counter <=13) image(this.img3, 20, 0, 40, 31);
        else if (this.counter > 13 && this.counter <=20) image(this.img2, 20, 0, 40, 31);
        else if (this.counter > 20) {
          image(this.img1, 20, 0, 40, 31);
          this.counter = 0;
        }
        this.counter ++;
      }
    } 
    pop();
    imageMode(CORNER);
  }


Bird.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.location); 
	var d = desired.mag();   
  
	if (d < 5) {
      this.reached = true;
    }
    else {
	  this.reached = false;
	}
	
	if (d < 10) {
      var m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } 
    else {
      desired.setMag(this.maxspeed);
    }

	var steer = p5.Vector.sub(desired, this.velocity);
	
	steer.limit(this.maxforce); 
	return steer;
       
  }

Bird.prototype.separate = function(birds) {
	var desiredseparation = 10.0;
    var sum = createVector(0, 0);
    var count = 0;

	for (var i = 0; i < birds.length; i++) {
    var d = p5.Vector.dist(this.location, birds[i].location);
    if ((d > 0) && (d < desiredseparation)) {

	  var diff = p5.Vector.sub(this.location, birds[i].location);
      diff.normalize();
      diff.div(d); 
      sum.add(diff);
      count++; 
    }
  }

  if (count > 0) {
	  sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
  }

  return sum;
	
}


Bird.prototype.applyBehaviors = function(birds) {
    var seekForce = this.seek(this.goal); 
    this.applyForce(seekForce);    


    if (!this.reached) {  
      var separateForce = this.separate(birds);
      separateForce.mult(1);
      this.applyForce(separateForce);
    }
	
    else {
	for (var i = 0; i < birds.length; i++) {
        var d = p5.Vector.dist(this.location, birds[i].location);
        if ((d<10) && birds[i].reached != true) {
          var prob = random(1);
          if(prob < 0.3) this.setNewGoal();
        }
      }
    }
 }







Bird.prototype.avoid = function() {
    if (this.light && this.reached) this.setNewGoal();
    this.light = false;
 }

Bird.prototype.setNewGoal = function(){

    this.direction = !this.direction;

    //choose a new tree  
	var pt = this.t;
    this.t = Math.floor(random(3));
    while (this.t == pt) this.t = Math.floor(random(3)); 
    this.goal = createVector(random(trees[this.t].x, trees[this.t].x2), random(trees[this.t].y, trees[this.t].y2));
	
//    var desired = p5.Vector.sub(this.goal, this.location);
//    desired.normalize();
//    velocity = createVector(desired.x * 10, -15);
}
  
   
  
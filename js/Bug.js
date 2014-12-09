var displayBugs = function(target){
	for (var i = 0; i < bugs.length; i++) {
    bugs[i].update(bugs, target);  
    bugs[i].checkEdges();  
    bugs[i].display();
  }

}

function Bug() {
    this.img = loadImage("img/firefly.png");
    this.location = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxspeed = 1;
    this.maxforce = 1;
    this.noff = createVector(random(1000), random(1000));
    this.state = false;
    this.size = Math.round(random(7,9));
  }

Bug.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

Bug.prototype.update = function(bugs, target) {
	var force = p5.Vector.sub(target, this.location);
	var d = force.mag();
    force.normalize();
    force.mult(0.05/d*d);
    force.limit(this.maxforce);  	
	
    if (d < 200 && target.y > 200) { 
      var separateForce = this.separate(bugs);
      
      separateForce.mult(0.05);
      this.applyForce(separateForce);
      this.applyForce(force);
		
	 this.velocity.add(this.acceleration);
	 this.velocity.limit(this.maxspeed*2);
     this.location.add(this.velocity);
     this.acceleration.mult(0);
    }

    else {
      this.acceleration.x = map(noise(this.noff.x), 0, 1, -1, 1);
      this.acceleration.y = map(noise(this.noff.y), 0, 1, -1, 1);
      this.acceleration.mult(0.1);

      this.noff.add(0.01, 0.01, 0);

      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.location.add(this.velocity);
    }
  }


 Bug.prototype.display = function() {
    noStroke();
    var prob = random(1);
    if(prob < 0.01)  this.state = !this.state;
    
    if(this.state) {
      image(this.img, this.location.x, this.location.y, this.size, this.size);
    }
    else {
    fill(0, 0, 0, 50);
     ellipse(this.location.x, this.location.y, 3, 3);
    }
  }



 Bug.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.location); 
	desired.normalize();   
    desired.mult(maxspeed);
	
	var steer = p5.Vector.sub(desired, this.velocity);
	steer.limit(this.maxforce); 
	return steer;
       
  }

Bug.prototype.separate = function(bugs){
	var desiredseparation = 10.0;
    var sum = createVector(0, 0);
    var count = 0;

	for (var i = 0; i < bugs.length; i++) {
    var d = p5.Vector.dist(this.location, bugs[i].location);
    if ((d > 0) && (d < desiredseparation)) {
	  var diff = p5.Vector.sub(this.location, bugs[i].location);
      diff.normalize();
      diff.div(d); 
      sum.add(diff);
      count++; 
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
}


Bug.prototype.checkEdges = function() {
    if (this.location.x > width) this.location.x = 0;
    else if (this.location.x < 0) this.location.x = width;
    if (this.location.y > this.height) {
      this.location.y = 0;
    }
    else if (this.location.y < 0) {
      this.location.y = height;
    }
}


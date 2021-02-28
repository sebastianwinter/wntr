// ########## P5 Code ##########

p5.disableFriendlyErrors = true;

// eco-mode = only render if window focused
window.onblur = function () {
	noLoop()
}
window.onfocus = function () {
	loop();
}

let density = 2 * 12; // must be devidable by 12
let bgcolor = [255,255,255];
let margin = 30;
let radius = 50;
let cells = [];

let spikes = false;
let animateSpikes = 0;

const debug = document.querySelector('#debug')
/*let mouseR = 5;
let mouseRMax = 50;
let mouseRSpeed = 1;*/

function setup() {
	createCanvas(windowWidth, windowHeight);
	//frameRate(12);
	
	cells[0] = new Blob(width / 2, height / 2, density); // X, Y, angle (amount)
	cells[0].build();
	
	cells[1] = new Blob(width / 4 * 3, height / 4 * 3, density); // X, Y, angle (amount)
	cells[1].build();
	
	cells[2] = new Blob(width / 4, height / 4, density); // X, Y, angle (amount)
	cells[2].build();

	cells[3] = new Blob(width * 0.8, height * 0.3, density); // X, Y, angle (amount)
	cells[3].build();

	cells[4] = new Blob(width * 0.2, height * 0.7, density); // X, Y, angle (amount)
	cells[4].build();
}

function draw() {
	background(bgcolor[0], bgcolor[1], bgcolor[2]);	

	for (m = 0; m < cells.length; m++) {
		if(cells[m].punches > 2) { //delete cells with 3 punches
			console.log('this one is dead');
			cells.splice(m,1);
		}else {
			cells[m].draw();
		}
	}

	if(spikes) {
		animateSpikes = clamp(animateSpikes + 0.1);
	} else {
		animateSpikes = clamp(animateSpikes - 0.1);
	}
	debug.innerHTML = animateSpikes
	//noLoop();

	//mark center
	// let green = color(0,255,0)
	// fill(green)
	// noStroke()
	// circle(width / 2, height / 2, 10);
}


function drawBlob(res, explorerPoints, averagedPoints, startPoints, angle, posX, posY, currentCell) {
	beginShape();
		for(let n = 0; n < res; n+= 1) {	//resolution is the amount of points / angles
			
			let lastX = explorerPoints[n][0];
			let lastY = explorerPoints[n][1];
			let lastR = explorerPoints[n][2];
			
			if (currentCell.hover != 0) {
				lastR = lastR + currentCell.hover;
			}

			//check if intersecting
			let intersecting;
			if(!currentCell.parent) {
				intersecting = checkIntersection(lastX, lastY, average = false, explorerPoints);
			} else { // has parent and is meant to fill space in between Averages
				intersecting = checkIntersection(lastX, lastY, average = true, explorerPoints);
			}

			//avarage neighbors to smooth corners
			let averageX = 0;
			let averageY = 0;
			let averageR = 0;
			//e.g. 96 points: i = -8 bis 8 –> is avaraged with 8 neighbors before and after own pos
			for(let i = (density / 24 ) * -1; i < density / 24; i += 1) {
				let currentNeighbor = neighbor(explorerPoints, n, i)
				averageX = averageX + currentNeighbor[0];
				averageY = averageY + currentNeighbor[1];
				averageR = averageY + currentNeighbor[2];
			}
			averageX = averageX / (density / 12) + random(-1,1);
			averageY = averageY / (density / 12) + random(-1,1);
			averageR = averageR / (density / 12);

			averagedPoints[n][0] = averageX;
			averagedPoints[n][1] = averageY;
			averagedPoints[n][2] = averageR;

			let newX;
			let newY;
			let newR;

			//check if point should move further
			if(lastX > margin && lastX <  width - margin && lastY > margin && lastY < height - margin && intersecting == false) {
				if(lastR > neighbor(explorerPoints, n, 1)[2] * 1.25 || lastR > neighbor(explorerPoints, n, -1)[2] * 1.25) {
					newR = lastR;
				} else {
					newR = lastR + 1;
				}

				newX = newR * cos(TWO_PI / currentCell.angle * n) + posX;
				newY = newR * sin(TWO_PI / currentCell.angle * n) + posY;
				

				explorerPoints[n][0] = newX;
				explorerPoints[n][1] = newY;
				explorerPoints[n][2] = newR;
				/*if(!currentCell.parent) {
					if(newX < averageX + 20 && newY < averageY + 20) { // prevents the "explorer" points to go too far
						explorerPoints[n][0] = newX;
						explorerPoints[n][1] = newY;
						explorerPoints[n][2] = newR;
					}
				} /*else { //has parent –> prevent from going too big
					if(newR < averageR + 20) { // prevents the "explorer" points to go too far
						explorerPoints[n][0] = newX;
						explorerPoints[n][1] = newY;
						explorerPoints[n][2] = newR;
					}
				}*/

			} else {
				newR = lastR;
				newX = lastX;
				newY = lastY;
				// newR = averageR;
				// newX = averageX;
				// newY = averageY;
			}/*else {
				if (explorerPoints[n][3] == 0) {
					explorerPoints[n][3] = 1; // set fixed -> collided –> won't grow
					currentCell.fixed = true;
				}
				if(explorerPoints[n][3] > 0) {
					explorerPoints[n][3] += 1; //increse fixed value to save how long ago it stopped
				}
			}*/

			//debug.innerHTML = newR

			//debug –> show vertecies / explorerPoints
			// let red = color(255,0,0)
			// fill(red);
			// noStroke()
			// circle(newX, newY, 10);

			fill(currentCell.color[0], currentCell.color[1], currentCell.color[2]);
			stroke(bgcolor);
			strokeWeight(20);
			//curveVertex(averageX,averageY);
			
			
			//curveVertex(smoothVertex[0],smoothVertex[1]);
			//vertex(smoothVertex[0],smoothVertex[1]);
			if(!spikes && animateSpikes == 0) {	
				curveVertex(averagedPoints[n][0], averagedPoints[n][1]);
			}
		}
	endShape(CLOSE);
	if(spikes || animateSpikes > 0) {
		let animate = sineInOut(animateSpikes);
		noStroke();
		beginShape();
			vertex(explorerPoints[0][0], explorerPoints[0][1])
			for(let n = 0; n < res; n+= 3) {
				if(explorerPoints[n + 3]) {
					//bezierVertex(startPoints[n + 1][0], startPoints[n + 1][1], startPoints[n + 2][0], startPoints[n + 2][1], explorerPoints[n + 3][0], explorerPoints[n + 3][1]); //spikes clean
					//bezierVertex(startPoints[n + 1][0] + random(-2,2), startPoints[n + 1][1] + random(-2,2), startPoints[n + 2][0] + random(-2,2), startPoints[n + 2][1] + random(-2,2), explorerPoints[n + 3][0] + random(-2,2), explorerPoints[n + 3][1]) + random(-2,2); //spikes flicker

					bezierVertex(
						map(animate, 0, 1, averagedPoints[n + 1][0], startPoints[n + 1][0]),
						map(animate, 0, 1, averagedPoints[n + 1][1], startPoints[n + 1][1]),
						map(animate, 0, 1, averagedPoints[n + 2][0], startPoints[n + 2][0]),
						map(animate, 0, 1, averagedPoints[n + 2][1], startPoints[n + 2][1]),
						explorerPoints[n + 3][0] + random(-2,2), explorerPoints[n + 3][1]) + random(-2,2); //spikes flicker + animated
				}
			}
			bezierVertex(
				map(animate, 0, 1, averagedPoints[res - 3][0], startPoints[res - 3][0]),
				map(animate, 0, 1, averagedPoints[res - 3][1], startPoints[res - 3][1]),
				map(animate, 0, 1, averagedPoints[res - 2][0], startPoints[res - 2][0]), 
				map(animate, 0, 1, averagedPoints[res - 2][1], startPoints[res - 2][1]), 
				explorerPoints[0][0], explorerPoints[0][1]);
			fill(currentCell.color[0], currentCell.color[1], currentCell.color[2]);
		endShape(CLOSE);
		//debug spikes:
		/*for(let n = 0; n < res; n+= 3) {
			if(averagedPoints[n + 3]) {
				//bezierVertex(averagedPoints[n + 1][0], averagedPoints[n + 1][1], averagedPoints[n + 2][0], averagedPoints[n + 2][1], averagedPoints[n + 3][0], averagedPoints[n + 4][1]);
				fill(color(255,0,0));
				noStroke()
				circle(startPoints[n + 1][0], startPoints[n + 1][1], 20);
				//circle(currentCell.posX, currentCell.posY, 20);
				fill(color(0,255,0));
				circle(startPoints[n + 2][0], startPoints[n + 2][1], 20);
				fill(color(0,255,255));
				circle(explorerPoints[n + 3][0], explorerPoints[n + 3][1], 20);
			}
		}*/
	}
}

function Blob(posX, posY, angle) {
	this.posX = posX;
	this.posY = posY;
	this.color = [0,0,random(40,255)];
	this.resolution;
	this.angle = angle;
	this.explorerPoints = [];
	this.averagedPoints = [];
	this.startPoints = [];
	this.hover = 0;
	this.fixed = false;
	//this.direction = [random(-4,4), random(-4,4)]
	this.direction = [0, 0]
	this.punches = 0;
	this.parent = false;
	//this.random = random(180);
	this.build = function() {
		/*this.posX = this.posX - radius / 2 // center blob
		this.posY = this.posY - radius / 2*/
		for(let a = TWO_PI / this.angle; a < TWO_PI; a+= TWO_PI / this.angle) {
			let r = radius;
			let x = r * cos(a) + this.posX;
			let y = r * sin(a) + this.posY;
			let fixed = 0;
			
			this.explorerPoints.push([x, y, r, fixed]);
			this.averagedPoints.push([x, y, r]);
			this.startPoints.push([x, y, r]);
		}

		this.resolution = this.explorerPoints.length;
	}
	this.attachParent = function(parent) {
		console.log('parent:')
		console.log(parent)
		this.parent = parent
	}
	this.draw = function() {
		/* //trying to add a circular movement
		if (this.posY < height / 2) {
			this.posX = this.posX + 1;
		} else if (this.posY > height / 2) {
			this.posX = this.posX - 1;
		}

		if (this.posX < width / 4) {
			this.posY = this.posY - 1;
		} else if (this.posX > width / 4) {
			this.posY = this.posY + 1;
		}*/
		drawBlob(this.resolution, this.explorerPoints, this.averagedPoints, this.startPoints, this.angle, this.posX, this.posY, this);
		// let white = color(255,255,255)
		// fill(white);
		// noStroke()
		// circle(this.posX, this.posY, 20);
	}
};






//Handle click

function tap(clickX, clickY) {
	let index = cells.length;
	
	if(clickX > margin && clickX < width - margin && clickY > margin && clickY < height - margin) {
		let intersectionExplorer = checkIntersection(clickX, clickY, average = false);
		let intersectionAverage = false;

		if(intersectionExplorer) {
			console.log('is in explorer')
			intersectionAverage = checkIntersection(clickX, clickY, average = true);
			//ToDO: check if intersects with explorer but not with average –> some kind of parent behavior
			if(intersectionAverage) {
				console.log('is in average')
			}
		}

		if(!intersectionExplorer) { //add new Blob
			if(clickX > margin + radius && clickX < width - margin - radius && clickY > margin + radius && clickY < height - margin - radius) {
				cells[index] = new Blob(clickX, clickY, density); // X, Y, angle (amount)
				cells[index].build();
			}
		} else if(intersectionExplorer && !intersectionAverage) {
			console.log('make new but attach to parent')
			/*cells[index] = new Blob(clickX, clickY, density); // X, Y, angle (amount)
			cells[index].build();
			cells[index].attachParent(intersectionExplorer);*/
		} else if (intersectionAverage) { //hit blob –> punch
			//intersectionExplorer.color = [130 + (60 * intersectionExplorer.punches) ,0,0];
			console.log('PUNCH')
			intersectionExplorer.punches = intersectionExplorer.punches + 1;
			if(intersectionExplorer.punches == 1) {
				intersectionExplorer.color = [153, 178, 255];
			} else if (intersectionExplorer.punches == 2) {
				intersectionExplorer.color = [218, 228, 255];
			}
			console.log(intersectionExplorer.color)
		}	
		/*mouseRMax = 200;
		mouseRSpeed = 6;*/
	}
}








//OWN HELPERS

document.querySelector('.tap-handler').addEventListener('click', e => {
	let clickX = e.clientX;
	let clickY = e.clientY;
	
	tap(clickX, clickY);
})

spikesButton = document.querySelector('.toggle-spikes')
spikesButton.addEventListener('click', e => {
	if(!spikes) {
		spikes = true
		spikesButton.innerHTML = "feeling smooth?"
	} else {
		spikes = false
		spikesButton.innerHTML = "feeling sharp?"
	}
})

document.querySelector('.tap-handler').addEventListener('touchstart', e => {
	let clickX = e.clientX;
	let clickY = e.clientY;
	
	tap(clickX, clickY);
})


function neighbor(points, n, i) { //returns neighbor point (by offset i)
	let dif = n + i;
	if(dif < 0) {
		return points[points.length + dif];
	} else if (dif > points.length - 1) {
		return points[dif - (points.length -1)];
	} else {
		return points[n + i];
	} 
}



function checkIntersection(x, y, average = true, points) {
	let intersecting = false;
	if(average == false) {
		for(i = 0; i < cells.length; i += 1) {
			if(!points || cells[i].explorerPoints != points) {
				if(inside([ x, y ], cells[i].explorerPoints)) {
					intersecting = true;
					if(!points) {
						intersecting = cells[i];
					}
				}	
			}
		}
	} else if (average== true) {
		for(i = 0; i < cells.length; i += 1) {
			if(!points || cells[i].averagedPoints != points) {
				if(inside([ x, y ], cells[i].averagedPoints)) {
					intersecting = true;
					if(!points) {
						intersecting = cells[i];
					}
				}	
			}
		}
	}
	return(intersecting);
}




//HELPERS

function clamp(number, min = 0, max = 1) {
	return Math.max(min, Math.min(number, max));
}

function sineInOut(t) {
	return -0.5 * (Math.cos(Math.PI*t) - 1)
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
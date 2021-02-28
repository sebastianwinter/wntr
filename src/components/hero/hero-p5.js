import * as p5 from "p5";
console.log(p5)
// ########## P5 Code ##########



/*s.disableFriendlyErrors = true;

// eco-mode = only render if window focused
window.onblur = function () {
	s.noLoop()
}
window.onfocus = function () {
	s.loop();
}*/

let density = 2 * 12; // must be devidable by 12
let bgcolor = [255,255,255];
let margin = 30;
let marginX = 15;
let marginY = 30;
let radius = 50;
let strokeWidth = 20;
let cells = [];

let spikes = false;
let animateSpikes = 0;

const debug = document.querySelector('#debug')
/*let mouseR = 5;
let mouseRMax = 50;
let mouseRSpeed = 1;*/

const sketch = (s) => {
    s.setup = () => {
        let cnv = s.createCanvas(s.windowWidth, s.windowHeight);
        let container =  document.querySelector('.hero');
        cnv.parent(container);
        //frameRate(12);
        
        cells[0] = new Blob(s.width / 2, s.height / 2, density); // X, Y, angle (amount)
        cells[0].build();
        
        cells[1] = new Blob(s.width / 4 * 3, s.height / 4 * 3, density); // X, Y, angle (amount)
        cells[1].build();
        
        cells[2] = new Blob(s.width / 4, s.height / 4, density); // X, Y, angle (amount)
        cells[2].build();

        cells[3] = new Blob(s.width * 0.8, s.height * 0.3, density); // X, Y, angle (amount)
        cells[3].build();

        cells[4] = new Blob(s.width * 0.2, s.height * 0.7, density); // X, Y, angle (amount)
        cells[4].build();
    }

    s.draw = () => {
        s.background(bgcolor[0], bgcolor[1], bgcolor[2]);	

        for (let m = 0; m < cells.length; m++) {
            if(cells[m].punches > 2) { //delete cells with 3 punches
                //console.log('this one is dead');
                cells.splice(m,1);
                if(cells.length <= 0) {
                    cells[0] = new Blob(s.width / 2, s.height / 2, density); // X, Y, angle (amount)
                    cells[0].build();
                }
            }else {
                cells[m].draw();
            }
        }

        if(spikes) {
            animateSpikes = clamp(animateSpikes + 0.1);
        } else {
            animateSpikes = clamp(animateSpikes - 0.1);
        }
        debug.innerHTML = strokeWidth
        //noLoop();

        //mark center
        // let green = color(0,255,0)
        // fill(green)
        // noStroke()
        // circle(width / 2, height / 2, 10);
    }

    s.windowResized = () => {
        if(s.width <= s.windowWidth && s.height <= s.windowHeight ) {
            s.resizeCanvas(s.windowWidth, s.windowHeight);
        } else {
            s.resizeCanvas(s.windowWidth, s.windowHeight);
            cells = [];
            cells[0] = new Blob(s.width / 2, s.height / 2, density); // X, Y, angle (amount)
            cells[0].build();
        }
    }
}

const sketchBlob = new p5(sketch);

function drawBlob(res, explorerPoints, averagedPoints, startPoints, angle, posX, posY, currentCell) {
	sketchBlob.beginShape();
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
				intersecting = checkIntersection(lastX, lastY, false, explorerPoints);
			} else { // has parent and is meant to fill space in between Averages
				intersecting = checkIntersection(lastX, lastY, true, explorerPoints);
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
			averageX = averageX / (density / 12) + sketchBlob.random(-1,1);
			averageY = averageY / (density / 12) + sketchBlob.random(-1,1);
			averageR = averageR / (density / 12);

			averagedPoints[n][0] = averageX;
			averagedPoints[n][1] = averageY;
			averagedPoints[n][2] = averageR;

			let newX;
			let newY;
			let newR;

			//check if point should move further
			if(lastX > marginX && lastX <  sketchBlob.width - marginX && lastY > marginY && lastY < sketchBlob.height - marginY && intersecting == false) {
				if(lastR > neighbor(explorerPoints, n, 1)[2] * 1.25 || lastR > neighbor(explorerPoints, n, -1)[2] * 1.25) {
					newR = lastR;
				} else {
					newR = lastR + 1;
				}

				newX = newR * sketchBlob.cos(sketchBlob.TWO_PI / currentCell.angle * n) + posX;
				newY = newR * sketchBlob.sin(sketchBlob.TWO_PI / currentCell.angle * n) + posY;
				

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

			sketchBlob.fill(currentCell.color[0], currentCell.color[1], currentCell.color[2]);
			sketchBlob.stroke(bgcolor);
			sketchBlob.strokeWeight(strokeWidth);
			//curveVertex(averageX,averageY);
			
			
			//curveVertex(smoothVertex[0],smoothVertex[1]);
			//vertex(smoothVertex[0],smoothVertex[1]);
			if(!spikes && animateSpikes == 0) {	
				sketchBlob.curveVertex(averagedPoints[n][0], averagedPoints[n][1]);
			}
		}
    sketchBlob.endShape(sketchBlob.CLOSE);
	if(spikes || animateSpikes > 0) {
		let animate = sineInOut(animateSpikes);
		//animate = animateSpikes
		//sketchBlob.noStroke();
        let animatedStrokeWidth = sketchBlob.map(1 - animate, 0, 1, 0, strokeWidth);
        sketchBlob.stroke(bgcolor);
		sketchBlob.strokeWeight(animatedStrokeWidth);
		sketchBlob.beginShape();
            sketchBlob.vertex(explorerPoints[0][0], explorerPoints[0][1])
			for(let n = 0; n < res; n+= 3) {
				if(explorerPoints[n + 3]) {
					//bezierVertex(startPoints[n + 1][0], startPoints[n + 1][1], startPoints[n + 2][0], startPoints[n + 2][1], explorerPoints[n + 3][0], explorerPoints[n + 3][1]); //spikes clean
					//bezierVertex(startPoints[n + 1][0] + random(-2,2), startPoints[n + 1][1] + random(-2,2), startPoints[n + 2][0] + random(-2,2), startPoints[n + 2][1] + random(-2,2), explorerPoints[n + 3][0] + random(-2,2), explorerPoints[n + 3][1]) + random(-2,2); //spikes flicker

					sketchBlob.bezierVertex(
						 sketchBlob.map(animate, 0, 1, averagedPoints[n + 1][0], startPoints[n + 1][0]),
						 sketchBlob.map(animate, 0, 1, averagedPoints[n + 1][1], startPoints[n + 1][1]),
						 sketchBlob.map(animate, 0, 1, averagedPoints[n + 2][0], startPoints[n + 2][0]),
						 sketchBlob.map(animate, 0, 1, averagedPoints[n + 2][1], startPoints[n + 2][1]),
						explorerPoints[n + 3][0] + sketchBlob.random(-2,2), explorerPoints[n + 3][1]) + sketchBlob.random(-2,2); //spikes flicker + animated
				}
			}
			sketchBlob.bezierVertex(
				 sketchBlob.map(animate, 0, 1, averagedPoints[res - 3][0], startPoints[res - 3][0]),
				 sketchBlob.map(animate, 0, 1, averagedPoints[res - 3][1], startPoints[res - 3][1]),
				 sketchBlob.map(animate, 0, 1, averagedPoints[res - 2][0], startPoints[res - 2][0]), 
				 sketchBlob.map(animate, 0, 1, averagedPoints[res - 2][1], startPoints[res - 2][1]), 
				explorerPoints[0][0], explorerPoints[0][1]);
            sketchBlob.fill(currentCell.color[0], currentCell.color[1], currentCell.color[2]);
        sketchBlob.endShape(sketchBlob.CLOSE);
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
	this.color = [0,0,sketchBlob.random(40,255)];
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
		for(let a = sketchBlob.TWO_PI / this.angle; a < sketchBlob.TWO_PI; a+= sketchBlob.TWO_PI / this.angle) {
			let r = radius;
			let x = r * sketchBlob.cos(a) + this.posX;
			let y = r * sketchBlob.sin(a) + this.posY;
			let fixed = 0;
			
			this.explorerPoints.push([x, y, r, fixed]);
			this.averagedPoints.push([x, y, r]);
			this.startPoints.push([x, y, r]);
		}

		this.resolution = this.explorerPoints.length;
	}
	this.attachParent = function(parent) {
		// console.log('parent:')
		// console.log(parent)
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
	
	if(clickX > marginX && clickX < sketchBlob.width - marginX && clickY > marginY && clickY < sketchBlob.height - marginY) {
		let intersectionExplorer = checkIntersection(clickX, clickY, false); // average = false
		let intersectionAverage = false;

		if(intersectionExplorer) {
			//console.log('is in explorer')
			intersectionAverage = checkIntersection(clickX, clickY, true); //average = true
			//ToDO: check if intersects with explorer but not with average –> some kind of parent behavior
			if(intersectionAverage) {
				//console.log('is in average')
			}
		}

		if(!intersectionExplorer) { //add new Blob
			if(clickX > marginX + radius && clickX < sketchBlob.width - marginX - radius && clickY > marginY + radius && clickY < sketchBlob.height - marginY - radius) {
				cells[index] = new Blob(clickX, clickY, density); // X, Y, angle (amount)
				cells[index].build();
			}
		} else if(intersectionExplorer && !intersectionAverage) {
			//console.log('make new but attach to parent')
			/*cells[index] = new Blob(clickX, clickY, density); // X, Y, angle (amount)
			cells[index].build();
			cells[index].attachParent(intersectionExplorer);*/
		} else if (intersectionAverage) { //hit blob –> punch
			//intersectionExplorer.color = [130 + (60 * intersectionExplorer.punches) ,0,0];
			//console.log('PUNCH')
			intersectionExplorer.punches = intersectionExplorer.punches + 1;
			if(intersectionExplorer.punches == 1) {
				intersectionExplorer.color = [153, 178, 255];
			} else if (intersectionExplorer.punches == 2) {
				intersectionExplorer.color = [218, 228, 255];
			}
			//console.log(intersectionExplorer.color)
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

let spikesButton = document.querySelector('.toggle-spikes')
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
		for(let i = 0; i < cells.length; i += 1) {
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
		for(let i = 0; i < cells.length; i += 1) {
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
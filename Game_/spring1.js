var goals = [{ x: 800, w: 920 + 250, y: 260, h: 260 + 70 },
	{ x: 800, w: 920 + 250, y: 350, h: 350 + 70 },
	{ x: 800, w: 920 + 250, y: 433, h: 433 + 70 },
	{ x: 800, w: 920 + 250, y: 516, h: 516 + 70 },
	{ x: 800, w: 920 + 250, y: 599, h: 599 + 70 },
]
var nodes = [{
	x: 510,
	y: 267,
}, {
	x: 510,
	y: 350,
}, {
	x: 510,
	y: 433,
}
	, {
	x: 510,
	y: 516,
}
	, {
	x: 510,
	y: 599,
}
]

var isBoundryEntered = (clientX, clientY) => {
	let isEntered = false;
	goals.map(item => {
		if (clientX >= item.x - 200 && clientY >= item.y-50 && clientX <= item.w && clientY <= item.h) {
			isEntered = true;
			return;
		}
	});
	return isEntered;
}

var checkMouseCollision = ({ clientX, clientY }, _x, _y) => {
	if (clientX >= _x && clientY >= _y && clientY <= _y + 70 && clientX <= _x + 250) {
		return true;
	}
}

let physicalObjects = [];
window.onload = function () {

	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;
	var particles = [],
		numParticles = 100;
	nodes.map((node, index) => {
		physicalObjects[index] = {};
		physicalObjects[index].springPoint = vector.create(node.x, node.y);
		physicalObjects[index].weight = particle.create(node.x, node.y, 0, 0);
		var isStarted = false;
	
		document.getElementById(`spring${index + 1}`).addEventListener("drag", function (event) {
			physicalObjects[index].springPoint.setX(event.clientX);
			physicalObjects[index].springPoint.setY(event.clientY);
		});

		document.getElementById(`spring${index + 1}`).addEventListener("dragend", function (event) {
			if (isBoundryEntered(event.clientX, event.clientY)) {
				physicalObjects[index].springPoint.setX(event.clientX);
				physicalObjects[index].springPoint.setY(event.clientY);
				new Audio('./press.mp3').play()
			}
			else {
				physicalObjects[index].springPoint.setX(node.x);
				physicalObjects[index].springPoint.setY(node.y);
			}
		});

		document.body.addEventListener("click", function (event) {
			clientY = event.clientY;
			clientX = event.clientX;
			if (clientX >= 1200 && clientX <= 1200 + 150 && clientY >= 670 && clientY <= 670 + 100) {
				particles = [];
				for (var i = 0; i < numParticles; i += 1) {
					particles.push(particle.create(width / 2, height / 2, Math.random() * 4 + 1, Math.random() * Math.PI * 2));
				}
				new Audio('./firworks.wav').play();
				physicalObjects[index].springPoint.setX(node.x);
				physicalObjects[index].springPoint.setY(node.y);
			}
			if (checkMouseCollision(event, physicalObjects[index].springPoint.getX(), physicalObjects[index].springPoint.getY())) {
				physicalObjects[index].springPoint.setX(node.x);
				physicalObjects[index].springPoint.setY(node.y);
			}
			if (!isStarted) {
				let music = new Audio('./music.mp3').play(new Audio('./music.mp3'));
				music.loop = true;
				isStarted = true;
			}
		});

	})


	update();

	function update() {
		context.clearRect(0, 0, width, height);
		if (particles && particles.length) {
			var colors = ['#f1588e', '#4660af', '#41c6a9', '#fbba1b', '#4660af', '#858b8e']
			for (var i = 0; i < numParticles; i += 1) {
				var p = particles[i];
				p.update();
				context.fillStyle = colors[Math.floor(Math.random() * numParticles)]; //red
				context.globalCompositeOperation = 'destination-over'
				context.beginPath();
				context.arc(p.position.getX(), p.position.getY(), 10, 0, Math.PI * 2, false);
				context.fill();
			}
			context.stroke();
		}



		physicalObjects.map(node => {
			node.weight.update();

			context.beginPath();
			context.arc(node.weight.position.getX(), node.weight.position.getY(), node.weight.radius,
				0, Math.PI * 2, false);
			context.fill();

			context.beginPath();

			roundedRectangle(node.springPoint.getX(), node.springPoint.getY(), 100, 60, context);

			context.fill();

			context.beginPath();

			context.moveTo(node.weight.position.getX(), node.weight.position.getY()) + 20;
			context.lineTo(node.springPoint.getX(), node.springPoint.getY()+40);
			context.lineWidth = 8;
			context.strokeStyle = '#FF512F';
			context.stroke();
		});
		requestAnimationFrame(update);
	}

};

function roundedRectangle(x, y, w, h, context) {
	var mx = x + w / 2;
	var my = y + h / 2;
	var img = document.getElementById("scream");
	context.drawImage(img, x, y + 10);
}

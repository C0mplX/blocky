var canvas = document.getElementById("ctx");
var context = canvas.getContext("2d");
var score = 0;
var heighScore = localStorage.getItem("score");
var keys = [];

gameOn = true;

//Globals
var width = canvas.width, height = canvas.height, speed = 4;
var enemySpeed = 3;
var appleSpeed = 3;

var player = {
	x: 240,
	y: 500,
	width: 30,
	height: 30
};

var enemy = {
	x: Math.random() * (width - 20),
	y: Math.random() * (height - 530),
	width: 20,
	height: 20
};

var apple = {
	x: Math.random() * (width - 20),
	y: Math.random() * (height - 530),
	width: 20,
	height: 20
}

//Keydown function
window.addEventListener("keydown", function(e)
{
	keys[e.keyCode] = true;
}, false);

//Keyup function
window.addEventListener("keyup", function(e)
{
	delete keys[e.keyCode];
}, false);

/*
up = 38
down = 40
left = 37
right = 39
*/

/**
* Main game method.
*/
function game() {
	update();
	render();
}

/**
* Update method
*/
function update() {

	
	//player movement
	playerMovement();
	//enemy movemnt
	enemyControl(enemySpeed);
	appleControl(appleSpeed);
	//Wall Collision
	collisionWall(player);
	collisionWallEnemy(enemy);
	collisionWallAppel(apple);
	//Collision enemy
	collisionEnemy();
	//speedGainer
	speedGain(score);
	console.log(speed, enemySpeed, appleSpeed);
}

//set player movement
function playerMovement() {
	//if(keys[38])player.y-=speed;
	//if(keys[40])player.y+=speed;
	if(keys[37])player.x-=speed;
	if(keys[39])player.x+=speed;
}

//Outer collision
function collisionWall(object) {
	//Collision outher wall detection
	if(object.x < 0) object.x = 0;
	if(object.x >= width - object.width) object.x = width - object.width;
	if(object.y < 0) object.y = 0;
	if(object.y >= height-object.height) object.y = height - object.height;
}

function collisionWallEnemy(object) {
	//Collision outher wall detection
	if(object.x < 0) object.x = 0;
	if(object.x >= width - object.width) object.x = width - object.width;
	if(object.y < 0) object.y = 0;
	if(object.y >= height-object.height) {
		enemy.x = Math.random() * (width - 20);
		enemy.y = Math.random() * (height - 530);
	}
}

//Collision ground apple
function collisionWallAppel(object) {
	if(object.x < 0) object.x = 0;
	if(object.x >= width - object.width) object.x = width - object.width;
	if(object.y < 0) object.y = 0;
	if(object.y >= height-object.height) object.y = height - object.height;
}

//detect collision with enemy
function collisionEnemy() {
	if(collision(player, enemy)) 
	{
		processEnemy();
	}
	if(collision(player, apple)) 
	{
		processApple();
	}
}

/**
* Render method
*/
function render() {
	context.clearRect(0,0, width,height);

	//Render player
	context.fillStyle = "blue";
	context.fillRect(player.x, player.y, player.width, player.height);

	//render enemy
	context.fillStyle = "green";
	context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

	//render apple
	context.fillStyle = "red";
	context.fillRect(apple.x, apple.y, apple.width, apple.height);
	//Render score
	context.font = 'bold 30px helvetica';
	context.fillStyle = "black";
	context.fillText(score, 5,30);

	context.fillText(heighScore, 460, 30);
}


//controls movement of enemy. 
function enemyControl(speedGainObject) {
	enemy.y+=speedGainObject;
}

//controlsmovement of apple
function appleControl(speedGainObject) {
	apple.y+=speedGainObject;
}

//Add dificulty

function speedGain(points) {
	if(points <= 3) {
		enemySpeed = 3;
		appleSpeed = 3;
	}
	else if(points >= 6 && points < 9) {
		enemySpeed = 4;
		appleSpeed = 4;	
	}
	else if(points >= 9 && points < 12) {
		enemySpeed = 5;
		appleSpeed = 5;	
	}
	else if(points >= 12 && points < 15) {
		enemySpeed = 6;
		appleSpeed = 6;
	}
	else if(points >= 15 && points < 18) {
		enemySpeed = 7;
		appleSpeed = 7;
	}
	else if(points >= 18 && points < 21) {
		enemySpeed = 8;
		appleSpeed = 8;
	}
	else if(points >= 21 && points < 23) {
		enemySpeed = 9;
		appleSpeed = 9;
		speed = 5;
	}
	else if(points >= 23 && points < 25) {
		enemySpeed = 12;
		appleSpeed = 12;
	}
	else if(points >= 25 && points < 26) {
		enemySpeed = 16;
		appleSpeed = 16;
		speed = 6;
	}
	else if(points >= 26) {
		enemySpeed = 17;
		appleSpeed = 17;
		speed = 7;
	}
}
// Collision handler event. What happends on colliosn
function processEnemy() {
	gameOn = false;
}

function processApple() {
	score++;
	apple.x = Math.random() * (width - 20);
	apple.y = Math.random() * (height - 530);
}


//Collision player
function collision(first, secound) {
	return !(first.x > secound.x + secound.width || 
		first.x + first.width < secound.x ||
		first.y > secound.y + secound.height || 
		first.y + first.height < secound.y);
}

if( gameOn === true ){
	var gameLoop = setInterval(function(){
		game();
		if(gameOn === false){
			loss();
			clearInterval(gameLoop);
		}
	}, 1000/60)	
}

//Looser function

function loss(){
	context.font = 'bold 70px helvetica';
	context.fillStyle = "red";
	context.fillText('You are dead', 20,250);
	context.font = 'bold 30px helvetica';
	context.fillText('Score ' + score, 190, 280);

	if(score > heighScore){
		localStorage.setItem("score", score);	
	}
	
}
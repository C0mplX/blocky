var canvas = document.getElementById("ctx");
var context = canvas.getContext("2d");

var score = 0;
var heighScore = localStorage.getItem("score");
var keys = [];
var mouse  = [];
var keysUp = [];
var gravity = 7;
gameOn = true;

//Globals
var width = canvas.width, height = canvas.height, speed = 10, velocity = 0;
var wordSpeed = 4;

background = new Image();
background.src = 'res/background.png';

playerImage = new Image();
playerImage.src = 'res/player-right.png';

var player = {
	x: 200,
	y: 500,
	width: 30,
	height: 30,
	falling: false,
	jumpPower: 16,
	onGround: false,
	startJump: 500
};

//Get start jump position

var block = {
	x: 1200,
	y: 570,
	width: 30,
	height: 30,
}

var block2 = {
	x: 900,	
	y: 550,
	width: 30,
	height: 60,
}

var block3 = {
	x: 700,
	y: 570,
	width: 30,
	height: 30,
}

//Keydown function
window.addEventListener("keydown", function(e)
{
	keys[e.keyCode] = true;
}, false);

//Keyup function
window.addEventListener("keyup", function(e)
{
	playerImage.src = "res/player-right.png";
	player.height  = 30;
	player.width = 30;
	delete keys[e.keyCode];
}, false);

//Mobile support 
window.addEventListener("touchstart", function(e){
	mouse[1] = true;
},false)

window.addEventListener("touchend", function(e){
	playerImage.src = "res/player-right.png";
	delete mouse[1];
},false)

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

	
	//Add gtavity
	player.y += gravity;
	//player movement
	playerMovement();

	//block control
	blockControl(wordSpeed);
	//Wall Collision
	collisionWall(player);
	resetBlock(block);
	resetBlock(block2);
	resetBlock(block3);
	//Collision enemy
	collisionBlock(player, block);
	collisionBlock(player, block2);
	collisionBlock(player, block3);
	//speedGainer
	speedGain(score);
}

/**
* Render method
*/
function render() {
	context.clearRect(0,0, width,height);
	//render background
	//context.drawImage(background, 0, 0); 
	//Render player
	context.fillStyle = "blue";
	context.fillRect(player.x, player.y, player.width, player.height);
	context.drawImage(playerImage, player.x, player.y);

	//Render collision block 
	context.fillStyle = "purple";
	context.fillRect(block.x, block.y, block.width, block.height);

	context.fillStyle = "yellow";
	context.fillRect(block2.x, block2.y, block2.width, block2.height);
	context.fillStyle = "green";
	context.fillRect(block3.x, block3.y, block3.width, block3.height);
	//Render score
	context.font = 'bold 30px helvetica';
	context.fillStyle = "black";
	context.fillText(score, 5,30);

	if(heighScore  == null){
		heighScore = 0;
	}
	context.fillText(heighScore, 460, 30);
}

//set player movement
function playerMovement() {

	/*
	up = 38
	down = 40
	left = 37
	right = 39
	*/

	if(keys[40]) {
		player.height  = 20;
		player.width = 35;
		console.log('shirnkk');
	}

	if(keys[38] || mouse[1] )  {
		jump();
	}

	/*
	if(keys[37]) {
		player.x-=speed;
		playerImage.src = "res/player-left.png";	
	}
		
	if(keys[39]) {
		player.x+=speed;
		playerImage.src = "res/player-right.png";
	}
	*/
}

function jump(){
	if( player.falling == false || player.onGround == false ){

		player.onGround = true;
		velocity = player.jumpPower*-1.6;

		// update gravity
		if (velocity < 0) {
			velocity ++;
			player.x += 5;
			console.log('Velocity: ' + velocity);
			console.log('y: ' + player.y);
			console.log('startJump: ' + player.startJump);
		}
		else {
		// fall slower than you jump
			velocity += 20;
		}

		if( player.startJump > player.y+20 ) {
			player.falling = true;
			console.log('runthis');
		}
		
		player.y += velocity;

	}
}

//Outer collision
function collisionWall(object) {
	//Collision outher wall detection
	if(object.x < 0) {
		object.x = 0;
		
	}

	if(object.x >= width - object.width) {
		object.x = width - object.width;
	}

	if(object.y < 0) object.y = 0;
	if(object.y >= height-object.height) {
		object.y = height - object.height;
		player.startJump = player.y-player.height*3;
		player.falling = false;
		player.x -= 2;
	} 
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

function resetBlock(object) {
	if(object.x < 0) {
		object.x = width;
		object.height = Math.random() * (90-30);
		object.y = object.height+510;

	}
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

function collisionBlock(first, secound) {
	if( collision( first, secound ) ) {
		if( first.x > secound.x - secound.width && first.x - first.width < secound.x - secound.width ) {
			processEnemy();	
		}
		
	}
}

//controls movement of enemy. 
function enemyControl(speedGainObject) {
	enemy.y+=speedGainObject;
}

function blockControl(speedGainObject) {
	block.x-=speedGainObject;
	block2.x-=speedGainObject;
	block3.x-=speedGainObject;
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

function collisionTerreain(first, secound) {
	if(collision( first, secound )){
		if( first.x > secound.x - secound.width && first.x - first.width < secound.x - secound.width) {
			first.x = secound.x - secound.width;
			console.log('right')
		}
		else if ( first.x > secound.x - secound.width && first.x > secound.x - secound.width) {
			first.x = secound.x+secound.width;
			console.log('left')
		}
	}
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

	if(score > heighScore){
		context.fillText('New high score ' + score, 130, 280);
		localStorage.setItem("score", score);	
	}else{
		context.fillText('Score ' + score, 190, 280);
	}
	
}
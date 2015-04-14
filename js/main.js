var canvas = document.getElementById("ctx");
var context = canvas.getContext("2d");

var score = 0;
var heighScore = localStorage.getItem("score");
var keys = [];
var keys2 =[]; 
var mouse  = [];
var keysUp = [];
var gravity = 7;
gameOn = true;

//Globals
var width = canvas.width, height = canvas.height, speed = 5;

background = new Image();
background.src = 'res/background.png';

playerImage = new Image();
playerImage.src = 'res/player-front.png';

var player = {
	x: 200,
	y: 500,
	width: 30,
	height: 30,
	falling: false,
	jumpPower: 10,
	onGround: true,
	startJump: 500,
	velocity: 0
};

var player2 = {
	x: 470,
	y: 500,
	width: 30,
	height: 30,
	falling: false,
	jumpPower: 10,
	onGround: true,
	startJump: 500,
	velocity: 0
}

//Get start jump position

var block = {
	x: -200,
	y: -200,
	width: 100,
	height: 30,
}

var block2 = {
	x: -200,	
	y: -200,
	width: 50,
	height: 30,
}

var block3 = {
	x: -200,
	y: -200,
	width: 100,
	height: 30,
}

var levelGoal = {
	x: 770,
	y: 450,
	width: 30,
	height: 30,
}

//create activation button

var activationButton = {
	x: 30,
	y: 590,
	width: 10,
	height: 10,
}

//Keydown function
window.addEventListener("keydown", function(e)
{
	keys[e.keyCode] = true;
	keys2[e.keyCode] = true;
}, false);

//Keyup function
window.addEventListener("keyup", function(e)
{
	playerImage.src = "res/player-front.png";
	player.height  = 30;
	player.width = 30;

	if(keys[38]) {
		player.onGround = false;
	}
	if(keys2[87]) {
		player2.onGround = false;
	}
	delete keys[e.keyCode];
	delete keys2[e.keyCode];
}, false);

//Mobile support 
window.addEventListener("touchstart", function(e){
	mouse[1] = true;
},false)

window.addEventListener("touchend", function(e){
	playerImage.src = "res/player-front.png";
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
	player2.y += gravity;
	//player movement
	playerMovement();
	player2Movement();

	//block control
	blockControl();
	//Wall Collision
	collisionWall(player);
	collisionWall(player2);
	//Collision enemy
	collisionBlock(player, block);
	collisionBlock(player, block2);
	collisionBlock(player, block3);

	collisionBlock(player2, block);
	collisionBlock(player2, block2);
	collisionBlock(player2, block3);

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

	//render plater 2
	context.fillStyle = "red";
	context.fillRect(player2.x, player2.y, player2.width, player2.height);
	//context.drawImage(playerImage, player2.x, player2.y);


	collisionEventRender( player, activationButton );
	collisionEventRender( player2, activationButton );
	//Level goal 
	context.fillStyle = "white";
	context.fillRect(levelGoal.x, levelGoal.y, levelGoal.width, levelGoal.height);
	//Render button 
	context.fillStyle = "orange";
	context.fillRect(activationButton.x, activationButton.y, activationButton.width, activationButton.height);

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
		jump(player);
	}

	
	if(keys[37]) {
		player.x-=speed;
		playerImage.src = "res/player-left.png";	
	}
		
	if(keys[39]) {
		player.x+=speed;
		playerImage.src = "res/player-right.png";
	}
	
}

//player 2 movement 

function player2Movement() {
	/*
	up = 38
	down = 40
	left = 37
	right = 39
	*/

	if(keys[83]) {
		player2.height  = 20;
		player2.width = 35;
		console.log('shirnkk');
	}

	if(keys[87] || mouse[1] )  {
		jump(player2);
	}

	
	if(keys[65]) {
		player2.x-=speed;
		playerImage.src = "res/player-left.png";	
	}
		
	if(keys[68]) {
		player2.x+=speed;
		playerImage.src = "res/player-right.png";
	}
}

function jump(obj){
	if( obj.falling == false && obj.onGround == true ){

		obj.velocity = obj.jumpPower*-1.6;

		// update gravity
		if (obj.velocity < 0) {
			obj.velocity ++;
		}
		else {
		// fall slower than you jump
			obj.velocity += 20;
		}

		if( obj.startJump > obj.y+20 ) {
			obj.falling = true;
		}
		
		obj.y += obj.velocity;
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
		object.startJump = object.y-player.height*3;
		object.falling = false;
		object.onGround = true;
	} 
}

//detect collision with enemy
function collisionEventRender(first, secound) {
	if(collision(first, secound)) 
	{

		block.x = 240;
		block.y = 570;
		
		block2.x = 440;
		block2.y = 470;

		block3.x = 650;
		block3.y = 450;

		//render blocks on btn press 
		context.fillStyle = "purple";
		context.fillRect(block.x, block.y, block.width, block.height);

		context.fillStyle = "yellow";
		context.fillRect(block2.x, block2.y, block2.width, block2.height);
		context.fillStyle = "green";
		context.fillRect(block3.x, block3.y, block3.width, block3.height);	
	}else {
		
	}
}

//controls movement of enemy. 
function enemyControl(speedGainObject) {
	enemy.y+=speedGainObject;
}

function blockControl() {
	
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

function collisionBlock(first, secound) {

	if(collision(first, secound)){
		if( first.x <= secound.x + secound.width && first.x + first.width > secound.x + secound.width) {
			first.x = secound.x + secound.width;
			console.log('left');
		}
		if( first.x + first.width > secound.x && first.x < secound.x) {
			first.x = secound.x - first.width
			console.log('right');
		}

		if ( first.y + first.height >= secound.y && first.y < secound.y && first.x < secound.x + secound.width && first.x + first.width > secound.x) {
			first.y = secound.y - first.height;
			first.startJump = first.y-first.height*3;
			first.falling = false;
			first.onGround = true;	
			console.log('over');	
		}
	 	
	 	if ( first.y <= secound.y + secound.height && first.y + first.height > secound.y + secound.height && first.x < secound.x + secound.width && first.x + first.width > secound.x) {
	 		first.falling = true;
			first.onGround = false;
			console.log('under');
		}
		

		
	}
	

	/*
	if( collision( first, secound ) ) {
		if( first.y < secound.y && first.x > secound.x-width) {
			first.y = secound.y - first.height;
			first.startJump = first.y-first.height*3;
			first.falling = false;
			first.onGround = true;		
			console.log('top');
		}

		else if( first.y > secound.y-first.width && first.x + first.width > secound.x) {
			first.falling = true;
			first.onGround = false;
			console.log('hit under');
		}

		else if (first.x + first.width >= secound.x && first.x < secound.x){
			first.x = secound.x-first.width;
			console.log('hitleft');
		}
		else if (first.x >= secound.x && first.x > secound.x) {
			first.x = secound.x+secound.width;
			console.log('hit right');
		}
	}
	*/
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
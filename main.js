/*
Jonah Uyyek
CMPM 120
Making Your First Phaser Game
*/


// define global game container object
var Runner = { };

// Title State ----------------------------------------------------------------------------------------------------------------------------------------------------------
// Shows title screen and loads assets
Runner.Title = function() {};
Runner.Title.prototype = {
	init: function() {
		console.log('Title: init');
		
		//disallow lose focus
		this.stage.disableVisibilityChange = true;
	},
	
	preload: function(){
		console.log('Title: preload');
		console.log('Title: preload');
			
		//display text
		var title = this.add.text(this.world.centerX, this.world.height / 4, 'BLOCKADE RUNNER II', {fontSize: '64px', fill: 'black'});
		title.anchor.setTo(0.5);
		
		var author = this.add.text(this.world.centerX, (this.world.height / 4) + 50, 'By Jonah Uyyek', {fontSize: '16px', fill: 'black'});
		author.anchor.setTo(0.5);
		
		var controls = this.add.text(this.world.centerX, this.world.height - 100, 'Arrow Keys to move, Spacebar to start', {fontSize: '32px', fill: 'black'});
		controls.anchor.setTo(0.5);
		
		var credits = this.add.text(this.world.centerX, this.world.height - 50, 'Music by Kevin Macleod at incompetech.com. SFX from chipfork and dogfishkid at freesound.org.', {fontSize: '16px', fill: 'black'});
		credits.anchor.setTo(0.5);
			
		//load a path to asset folder
		this.load.path = 'assets/img/';
		
		//load image assets
		this.load.atlas('atlas','spritesheet.png','sprites.json');
		
		//load audio
		this.load.path = 'assets/audio/';
		this.load.audio('bgmusic',['Plans in Motion.mp3']);
		this.load.audio('explosion',['Explosion.mp3']);
		this.load.audio('lasershootsound',['Laser.wav']);

	},
	create: function(){
		console.log('Title: create');
		this.stage.backgroundColor = "#EEEEEE";	
		
		//show title screen image
		this.titlescreen = this.add.sprite(this.world.centerX, this.world.centerY + 50, 'atlas', 'Titlescreen');
		this.titlescreen.anchor.set(0.5);
		
	},
	update: function(){
		// title screen logic
		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			this.state.start('Gameplay');
		}
	}
}
// Game State ----------------------------------------------------------------------------------------------------------------------------------------------------------------
Runner.Gameplay = function() {
};
Runner.Gameplay.prototype = {
	
	// >>> HELPER FUNCTIONS <<<
	
	//handle movement for cardinal and diagonal directions, and emergency end game
	movement: function(){
		// End Game
		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			this.playerCollide();
		}		
		// southeast
		else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			this.player.body.velocity.x = this.speed;
			this.player.body.velocity.y = this.speed;
			//this.shadow.y = this.player.y + this.shadowOffset;
			//this.shadow.x = this.player.x + this.shadowOffset;
		}
		//southwest
		else if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			this.player.body.velocity.x = -this.speed;
			this.player.body.velocity.y = this.speed;
			//this.shadow.y = this.player.y + this.shadowOffset;
			//this.shadow.x = this.player.x + this.shadowOffset;
		}
		//northeast
		else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.player.body.velocity.x = this.speed;
			this.player.body.velocity.y = -this.speed;
			//this.shadow.y = this.player.y + this.shadowOffset;
			//this.shadow.x = this.player.x + this.shadowOffset;
		}			
		//northwest
		else if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.player.body.velocity.x = -this.speed;
			this.player.body.velocity.y = -this.speed;
			//this.shadow.y = this.player.y + this.shadowOffset;
			//this.shadow.x = this.player.x + this.shadowOffset;
		}	
		//cardinal directions
		else if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.player.body.velocity.x = -this.speed;		
			//this.shadow.x = this.player.x + this.shadowOffset;			
		} else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.player.body.velocity.x = this.speed;
			//this.shadow.x = this.player.x + this.shadowOffset;
		} else if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.player.body.velocity.y = -this.speed;
			//this.shadow.y = this.player.y + this.shadowOffset;
		} else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			this.player.body.velocity.y = this.speed;
			//this.shadow.y = this.player.y + this.shadowOffset;
		} else {
			this.player.animations.play('fly');
		}		
		
	},
	
	//handle building movement
	buildingMovement: function(){
		this.buildingA.body.velocity.y = this.buildingSpeed;
		this.buildingB.body.velocity.y = this.buildingSpeed;
		this.buildingC.body.velocity.y = this.buildingSpeed;
		
		var foundSpace = false;

		if(this.buildingA.y > this.world.height){
			while(true){
				this.buildingA.y = -256 - (Math.floor(Math.random() * 200));
				this.buildingA.x = Math.floor(Math.random() * 900);
				//if the new spot is overlapping another building, try again
				//console.log('trying');
				if(Phaser.Math.distance(this.buildingA.x, this.buildingA.y, this.buildingB.x, this.buildingB.y) > 200 &&
				   Phaser.Math.distance(this.buildingA.x, this.buildingA.y, this.buildingC.x, this.buildingC.y) > 200){
					//console.log('trying2');
					break;
				}
			}
		}

		if(this.buildingB.y > this.world.height){
			while(true){
				this.buildingB.y = -256 - (Math.floor(Math.random() * 400));
				this.buildingB.x = Math.floor(Math.random() * 900);
				//if the new spot is overlapping another building, try again
				//console.log('trying');
				if(Phaser.Math.distance(this.buildingB.x, this.buildingB.y, this.buildingA.x, this.buildingA.y) > 200 &&
				   Phaser.Math.distance(this.buildingB.x, this.buildingB.y, this.buildingC.x, this.buildingC.y) > 200){
					//console.log('trying2');
					break;
				}
			}
		}
		
		if(this.buildingC.y > this.world.height){
			while(true){
				this.buildingC.y = -256 - (Math.floor(Math.random() * 300));
				this.buildingC.x = Math.floor(Math.random() * 900);
				//if the new spot is overlapping another building, try again
				//console.log('trying');
				if(Phaser.Math.distance(this.buildingC.x, this.buildingC.y, this.buildingB.x, this.buildingB.y) > 200 &&
				   Phaser.Math.distance(this.buildingC.x, this.buildingC.y, this.buildingA.x, this.buildingA.y) > 200){
					//console.log('trying2');
					break;
				}
			}
		}		
	},
	
	// play background music 
	playMusic: function(){
		console.log('playing music');
		this.music = this.add.audio('bgmusic');
		this.music.play('', 0, 0.6, true);
	},
	
	//increase speed if not at cap
	increaseSpeed: function(){
		if(this.landSpeed <= this.speedCap){
			this.landSpeed += 2.5;
			this.buildingSpeed = this.landSpeed * 60;
			console.log('increasing speed to ' + this.landSpeed);
		}
	},
	
	//tick score up every second
	addScore: function(){
		this.score++;
		this.scoreText.text = 'Current Score: ' + this.score;
	},
	
	// set up targeting visuals for big laser, fire laser after 3 seconds
	targetLaser: function(){
		console.log('LASER');
		this.laser = this.lasers.create(this.player.x, this.world.height, 'atlas', 'Target_1');
		this.laser.anchor.x = 0.5;
		this.laser.anchor.y = 1;
		
		this.laser.animations.add('blink', Phaser.Animation.generateFrameNames('Target_', 1, 2, '', 0), 2, true);
		this.laser.animations.play('blink');
		
		this.shootTimer = this.time.create(true);
		this.shootTimer.loop(3000, this.shootLaser, this);
		this.shootTimer.start();
	},
	
	//shoot the big laser at the player
	shootLaser: function(){
		this.fireball = this.fireballs.create(this.laser.x, 0, 'atlas', 'BigLaser');
		this.fireball.anchor.x = 0.5;
		this.fireball.anchor.y = 1;
		this.fireball.scale.setTo(0.65, 1);
		this.fireball.body.velocity.y = 2750;
		

		this.laserSound.play('', 0, 0.6, false);
		
		this.laser.kill();
		this.shootTimer.stop(true);
		
	},
	
	playerCollide: function(){
		
		this.player.kill();
		this.speedTimer.stop();
		
		// handle particle effects (thanks Nathan) 
		var deathEmitter = game.add.emitter(this.player.x, this.player.y, 200);
		deathEmitter.makeParticles('atlas', 'particle');
		deathEmitter.setAlpha(0.5, 1);
		deathEmitter.minParticleScale = 0.25;
		deathEmitter.maxParticleScale = 0.9;
		deathEmitter.setXSpeed(-500, 500);
		deathEmitter.setYSpeed(-600, 50);
		deathEmitter.start(true, 3000, null, 200);
		
		this.explodeSound.play('', 0, 0.6, false);
		
		//terminate game after 3 seconds to show death animation
		this.endTimer = this.time.create(true);
		this.endTimer.loop(3000, this.gameEnd, this);
		this.endTimer.start();

	},
	
	gameEnd: function(){
		//stop music
		this.music.pause();
		this.endTimer.stop(true);
		this.state.start('Gameover', true, false, this.score);	
	},
	
	// >>> INIT, PRELOAD, CREATE, UPDATE (MAIN GAME STUFF) <<<
	
	init: function(){
		//initialize variables

		this.player = null;
		this.speed = 700;
		this.landSpeed = 10;
		this.buildingSpeed = this.landSpeed * 60;
		this.speedCap = 22;
		this.score = 0;
		this.scoreText;
		this.shadowOffset = 60;
		this.buildings = null;		
		this.lasers = null;
		this.laser = null;
		this.fireballs = null;
		this.fireball = null;
	},
	
	preload: function(){
		console.log('Gameplay: preload');
	},
	
	create: function(){
		console.log('Gameplay: create');
		this.stage.backgroundColor = "#000000";
		
		//enable the Arcade Physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);
		
		//add background tilesprite
		this.stars = this.add.tileSprite(0, 0, this.world.width , this.world.height, 'atlas', 'Stars');	
		this.starbase = this.add.tileSprite(0, 0, this.world.width , this.world.height, 'atlas', 'Starbase');		
	
		//add buildings and set up collisions
		this.buildings = this.add.group();
		this.buildings.enableBody = true;
		
		this.buildingA = this.buildings.create(0, -2600, 'atlas', 'Cargo');
		this.buildingA.body.immovable = true;
		
		this.buildingB = this.buildings.create(400, -2000, 'atlas', 'Cargo');
		this.buildingB.body.immovable = true;
		
		this.buildingC = this.buildings.create(800, -2300, 'atlas', 'Cargo');
		this.buildingC.body.immovable = true;
		
		//add big laser group
		this.lasers = this.add.group();
		this.fireballs = this.add.group();
		this.fireballs.enableBody = true;
		
		//add the player sprite and set up physics
		this.player = this.add.sprite(this.world.centerX, 600, 'atlas', 'Ship_1');
		this.player.anchor.set(0.5);
		this.physics.enable(this.player);
		this.player.body.drag.set = 20;
		this.player.body.setSize(18,18,55,55);
		this.player.body.collideWorldBounds = true;
		
		//add flying animation
		this.player.animations.add('fly', Phaser.Animation.generateFrameNames('Ship_', 1, 6, '', 0), 30, true);

		//create on-screen text for score and instructions
		this.scoreText = this.add.text(10, 10, 'Current Score: 0', {fontSize: '16px', fill: '#fff'});	
		this.add.text(10, 50, 'Arrow keys to move. Space to self-destruct.', {fontSize: '16px', fill: '#fff'});
		
		//create timer to increase speed every 30 seconds
		this.speedTimer = this.time.create(false);
		this.speedTimer.loop(30000, this.increaseSpeed, this);
		this.speedTimer.loop(1000, this.addScore, this);
		this.speedTimer.loop(5000, this.targetLaser, this);
		this.speedTimer.start();
		
		//set up audio
		this.playMusic();
		this.laserSound = this.add.audio('lasershootsound');
		this.explodeSound = this.add.audio('explosion');
		
	},
	
	update: function(){
		// gameplay screen logic
		
		//reset player velocity
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		//collision with buildings
		var hitObject = this.physics.arcade.collide(this.player, this.buildings);
		var hitLaser = this.physics.arcade.collide(this.player, this.fireballs);
		if(hitObject || hitLaser){
			this.playerCollide();
		}
		
		//update tilesprite movement
		this.starbase.tilePosition.y += this.landSpeed;
		this.stars.tilePosition.y += this.landSpeed / 9;
		
		//building movement. Move to random position after leaving screen
		this.buildingMovement();
		
		//play flying animations
		this.player.animations.play('fly');
	
		//check for player movement
		this.movement();
	},
	
	render: function(){
		//game.debug.body(this.player);	
	}
	
	
}

// Gameover State -------------------------------------------------------------------------------------------------------------------------------------------------------
Runner.Gameover = function() {};
Runner.Gameover.prototype = {
	
	//recieve score variable from Gameplay state
	init: function(fS){
		this.finalScore = fS;
	},	
	preload: function(){
		console.log('Gameover: preload');
	},
	create: function(){
		console.log('Gameover: create');
		this.stage.backgroundColor = "#000000";
		
		//display text
		var gameOverText = this.add.text(this.world.centerX, this.world.height / 4, 'GAME OVER', {fontSize: '128px', fill: 'white'});
		gameOverText.anchor.setTo(0.5);
		
		var finalScoreText = this.add.text(this.world.centerX, (this.world.height / 4) + 128, 'Final Score: ' + this.finalScore, {fontSize: '64px', fill: 'white'});
		finalScoreText.anchor.setTo(0.5);
		
		var tryAgainText = this.add.text(this.world.centerX, this.world.centerY + 300, 'Press Space to try again', {fontSize: '64px', fill: 'white'});
		tryAgainText.anchor.setTo(0.5);
		

	},
	update: function(){
		// gameover screen logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			this.state.start('Title');
		}
	}
}


// init game, add states
var game = new Phaser.Game(1000, 800, Phaser.AUTO);
game.state.add('Title', Runner.Title);
game.state.add('Gameplay', Runner.Gameplay);
game.state.add('Gameover', Runner.Gameover);
game.state.start('Title');

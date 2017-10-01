//Create our 'main' state that will contain the game

var mainState = {

    preload: function() {
        //This function will be executed at the beginning
        //This is where we load the images and sounds
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('smash', 'assets/fallingOff.wav');

    },

    create: function(){
        //This function is called after the preload function
        //Here is where the game is set up, and the sprites displayed

       //Add the sounds to the game
       this.jumpSound = game.add.audio('jump');
       this.smashSound = game.add.audio('smash');
       
        //Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the start poisition of the bird at x=100 and y=245
        this.bird = game.add.sprite(100,225, 'bird');

        // Add physics to the bird
        //Needed for: movements, gravity, collisions, ect.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        //Chang the center of the bird to allow wider rotation
        this.bird.anchor.setTo(-0.2, 0.5);

        // Set up an evet listener that will call the 'jump' function when the space bar is pressed
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        //Create an empty group to contain all the pipes
        this.pipes = game.add.group();

        //Call addRowOfPipes every 1.5 seconds to produce a endless set of pipes
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        //Create a scoreboard at the top left of the screen
        this.score=0;
        this.labelScore = game.add.text(20,20, "0", {font: '20px Arial', fill: "#ffffff"});

    },

    update: function() {

        //This fucntion is called 60 times per second
        //It contains the game's logic

        // If the bird is out of the screen (too high or too low)
        //Call the 'restart' function
        if(this.bird.y < 0 || this.bird.y > 490){
            this.restartGame();
        }

        // If the bird collides with one of the pipes the the game will be restarted
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        //Change the angle of the bird to give animation 
        if (this.bird.angle < 20){
            this.bird.angle +=1;
        }

    },

    jump: function(){

        // Make sure the bird can't contine to Jump when it is Dead
        if (this.bird.alive == false){
            return;
        };

        //Makes the jump sound everytime the function is called
        this.jumpSound.play();

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Add an animation to the bird when the spacebar is pressed
        var animation =game.add.tween(this.bird);

        // Change the angle of the bird to -20degrees in 100 milliseconds
        animation.to({angle:-20}, 100);

        //start animation
        animation.start();
    },

    addOnePipe: function(x,y) {

        // Create a pipe at position x,y
        var pipe = game.add.sprite(x, y, 'pipe');

        //  Add the pipe sprite to the prevously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        //Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;

    },

    addRowOfPipes: function() {
        //Randomly pick a number between 1 and 5
        //This will be the hole position
        var hole = Math.floor(Math.random() *5)+1;

        // Add the 6 pipes
        //With one big hole at the position 'hole' and 'hole+1'
        for (var i=0; i < 8; i++){
            if(i != hole && i != hole+1){
                this.addOnePipe(400, i*60 + 10);
            }
        }

        //This will raise the score by 1 everytime this function is called-creating a new set of pipes
        this.score +=1;
        this.labelScore.text = this.score;

    },

    // Restart the game if parameters are reached    
    restartGame: function() {

        // Start the 'main state, which restarts the game
        game.state.start('main');
    },

    hitPipe: function(){

        //If the bird has already hit apipe, do nothing
        //  It means that the bird is already falling off the screen
        if (this.bird.alive == false){
            return;
        }

        //Play the sound when the pipe is hit
        this.smashSound.play();

        //Set the alive property of the bird to false
        this.bird.alive =  false

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }
};

//Initialize Phaser, and create a 400 by 490 game space
//Choose how the game will render in the browser-web gl or canvas or Auto-will choose the best
var game = new Phaser.Game(400, 490, Phaser.AUTO); 

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game

game.state.start('main');

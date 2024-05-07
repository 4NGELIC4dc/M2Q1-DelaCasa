class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load images
        this.load.image("bg", "assets/img/bg.png");
        this.load.image("button_credits", "assets/img/button_credits.png");
        this.load.image("button_play", "assets/img/button_play.png");
        this.load.image("button_quit", "assets/img/button_quit.png");
        this.load.image("text_title", "assets/img/text_title.png");

        // Load mouse click sound effect
        this.load.audio("buttonSound", "assets/mp3/Wooden Button Click Sound Effect.mp3");
    }

    create() {
        // Add background image
        this.add.image(0, 0, "bg").setOrigin(0, 0);

        // Add game title image
        let title = this.add.image(this.cameras.main.centerX, 100, "text_title");
        title.setScale(1.05);
        title.setOrigin(0.5, -0.75);

        // Add buttons
        let yOffset = 250;
        let buttonSpacing = 100;

        // Function to darken button on hover
        function darkenButton(button) {
            button.setTint(0x828282);
        }

        // Function to restore button color
        function restoreButton(button) {
            button.clearTint();
        }

        // Credits button
        let creditsButton = this.add.image(this.cameras.main.centerX, yOffset, "button_credits");
        creditsButton.setScale(0.15);
        creditsButton.setOrigin(1.75, -1.05);
        creditsButton.setInteractive();

        // Hover effects
        creditsButton.on("pointerover", () => {
            darkenButton(creditsButton);
        });

        creditsButton.on("pointerout", () => {
            restoreButton(creditsButton);
        });

        creditsButton.on("pointerup", () => {
            this.sound.play("buttonSound"); // Play mouse click sound effect
            this.scene.start('CreditsScene');
        });

        // Play button
        let playButton = this.add.image(this.cameras.main.centerX, yOffset + buttonSpacing, "button_play");
        playButton.setScale(0.15);
        playButton.setOrigin(0.5, 0);
        playButton.setInteractive();

        // Hover effects
        playButton.on("pointerover", () => {
            darkenButton(playButton);
        });

        playButton.on("pointerout", () => {
            restoreButton(playButton);
        });

        playButton.on("pointerup", () => {
            this.sound.play("buttonSound"); // Play mouse click sound effect
            this.scene.start('GameScene');
        });

        // Quit button
        let quitButton = this.add.image(this.cameras.main.centerX, yOffset + 2 * buttonSpacing, "button_quit");
        quitButton.setScale(0.15);
        quitButton.setOrigin(-0.75, 1.05);
        quitButton.setInteractive();

        // Hover effects
        quitButton.on("pointerover", () => {
            darkenButton(quitButton);
        });

        quitButton.on("pointerout", () => {
            restoreButton(quitButton);
        });

        quitButton.on("pointerup", () => {
            this.sound.play("buttonSound"); 
            window.close();
        });
    }
}

class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    preload() {
        // Load images
        this.load.image("bg", "assets/img/bg.png");
        this.load.image("button_back", "assets/img/button_back.png");

        // Load mouse click sound effect
        this.load.audio("buttonSound", "assets/mp3/Wooden Button Click Sound Effect.mp3");
    }

    create() {
        // Background
        let bg = this.add.image(0, 0, "bg").setOrigin(0);
        let tintOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.75);
        tintOverlay.setOrigin(0);

        // Display game credits
        let creditsText = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 50,
            "GAME CREATED BY\nAngelica Grace G. Dela Casa\nSection A223\n2nd Year - BS EMC", 
            { fontSize: "24px", fontFamily: "Verdana", fill: "#ffffff", align: "center" }
        );
        creditsText.setOrigin(0.5);

        // Add back button
        let backButton = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 50, "button_back");
        backButton.setScale(0.15);
        backButton.setOrigin(0.5, 1);
        backButton.setInteractive();

        // Add hover
        function darkenButton(button) {
            button.setTint(0x828282);
        }

        function restoreButton(button) {
            button.clearTint();
        }

        // Hover effects for back button
        backButton.on("pointerover", () => {
            darkenButton(backButton);
        });

        backButton.on("pointerout", () => {
            restoreButton(backButton);
        });

        backButton.on("pointerup", () => {
            this.sound.play("buttonSound"); // Play mouse click sound effect
            this.scene.start('StartScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Declare class properties
        this.platforms;
        this.player;
        this.stars;
        this.bombs;
        this.score = 0;
        this.scoreText;
        this.cursors;
        this.playerColorIndex = 0;
        this.playerColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee]; // Colors in RGB format
        this.starsCollected = 0;
        this.coinSound;
        this.jumpSound;
        this.bombSound;
        this.bgm;
    }

    preload() {
        // Load images
        this.load.image("bg", "assets/img/bg.png");
        this.load.image("ground", "assets/img/platform.png");
        this.load.image("star", "assets/img/star.png");
        this.load.image("bomb", "assets/img/bomb.png");
        this.load.spritesheet("dude", "assets/img/dude.png", { frameWidth: 32, frameHeight: 48 });

        // Load audio
        this.load.audio("coinSound", "assets/mp3/Mario coin sfx.mp3");
        this.load.audio("jumpSound", "assets/mp3/Mario jump sfx.mp3");
        this.load.audio("bombSound", "assets/mp3/Small bomb explode sfx.mp3");
        this.load.audio("bgm", "assets/mp3/bgm - Ninja Toad.mp3");
    }

    create() {
        this.physics.world.createDebugGraphic();

        // Add audio
        this.coinSound = this.sound.add("coinSound");
        this.jumpSound = this.sound.add("jumpSound");
        this.bombSound = this.sound.add("bombSound");
        this.bgm = this.sound.add("bgm", { loop: true });
        this.bgm.play();

        // Audio volume
        this.coinSound.setVolume(0.25);
        this.jumpSound.setVolume(0.25);
        this.bombSound.setVolume(0.5); 
        
        // Add background image
        this.add.image(0, 0, "bg").setOrigin(0, 0);

        // Add platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 570, "ground").setScale(1.65).refreshBody(); // Ground platform
        this.platforms.create(850, 400, "ground").setScale(0.65).refreshBody(); // Bottom platform
        this.platforms.create(60, 275, "ground").setScale(0.65).refreshBody(); // Middle platform
        this.platforms.create(950, 150, "ground").setScale(0.65).refreshBody(); // Top platform

        // Add player
        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setTint(this.playerColors[this.playerColorIndex]);

        // Player movement animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Add stars
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 10,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(0.025);
            child.setCollideWorldBounds(true);
        });

        // Add bombs
        this.bombs = this.physics.add.group();

        // Add score text
        this.scoreText = this.add.text(16, 16, "Stars Collected: 0", { fontSize: "20px", fill: "#FFF" });

        // Colliders
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);

        // Cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.physics.world.debugGraphic.clear();
        this.physics.world.debugGraphic.visible = false;

        // Cursor controls
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
            this.jumpSound.play();
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText("Stars Collected: " + this.score);
        this.coinSound.play();

        this.starsCollected++;
        if (this.starsCollected % 10 === 0) {
            this.spawnBomb();
            this.increasePlayerSize();
        }

        this.changePlayerColor();
        this.spawnStar();
    }

    spawnStar() {
        let x = Phaser.Math.Between(0, this.game.config.width);
        let star = this.stars.create(x, 0, "star");
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        star.setScale(0.025);
    }

    spawnBomb() {
        let x = Phaser.Math.Between(0, this.game.config.width);
        let bomb = this.bombs.create(x, 0, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.setScale(0.025);
    }

    changePlayerColor() {
        this.playerColorIndex = (this.playerColorIndex + 1) % this.playerColors.length;
        this.player.setTint(this.playerColors[this.playerColorIndex]);
    }

    increasePlayerSize() {
        this.player.setScale(this.player.scaleX + 0.1, this.player.scaleY + 0.1);
    }

    hitBomb(player, bomb) {
        // Make player invisible
        this.player.setVisible(false);

        // Play bomb sound effect
        this.bombSound.play();

        // Disable bomb physics body
        bomb.disableBody(true, true);

        // Display "GAME OVER" text
        let gameOverText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, "GAME OVER", {
            fontSize: "50px",
            fill: "#fff",
            align: "center",
            fontWeight: 'bold'
        });
        gameOverText.setOrigin(0.5);

        // Add restart button
        let restartButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, "Restart", {
            fontSize: "25px",
            fill: "#bf0000",
            align: "center",
            fontWeight: 'bold',
            padding: {
                x: 10,
                y: 10
            },
            backgroundColor: "#f00"
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive();

        restartButton.on("pointerover", () => {
            // Change button style on hover
            restartButton.setStyle({
                fill: "#000",
                backgroundColor: "#800000",
                padding: {
                    x: 12,
                    y: 12
                }
            });
        });

        restartButton.on("pointerout", () => {
            // Revert button style when not hovered
            restartButton.setStyle({
                fill: "#fff",
                backgroundColor: "#f00",
                padding: {
                    x: 10,
                    y: 10
                }
            });
        });

        restartButton.on("pointerup", () => {
            // Reset player position
            this.player.setVisible(true);
            this.player.setX(100);
            this.player.setY(450);

            // Reset player size
            this.player.setScale(1);

            // Reset score
            this.score = 0;
            this.scoreText.setText("Stars Collected: " + this.score);

            // Remove "GAME OVER" text and restart button
            gameOverText.destroy();
            restartButton.destroy();

            // Remove bombs from the scene
            this.bombs.clear(true, true);
        });
    }
}

// Create the game configuration
let config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, CreditsScene] // Add StartScene and GameScene to the game scenes
};

// Initialize the game with the configuration
let game = new Phaser.Game(config);
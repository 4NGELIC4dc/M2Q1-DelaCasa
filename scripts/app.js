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

        // Load button sound effects
        this.load.audio("buttonSound", "assets/mp3/Wooden Button Click Sound Effect.mp3");
    }

    create() {
        // Add background
        this.add.image(0, 0, "bg").setOrigin(0, 0);

        // Add game title image
        let title = this.add.image(this.cameras.main.centerX, 100, "text_title");
        title.setScale(1.05);
        title.setOrigin(0.5, -0.75);

        // Add buttons
        let yOffset = 250;
        let buttonSpacing = 100;

        // Add hover effects
        function darkenButton(button) {
            button.setTint(0x828282);
        }

        function restoreButton(button) {
            button.clearTint();
        }

        // Credits button
        let creditsButton = this.add.image(this.cameras.main.centerX, yOffset, "button_credits");
        creditsButton.setScale(0.15);
        creditsButton.setOrigin(1.75, -1.05);
        creditsButton.setInteractive();

        // Add hover effects
        creditsButton.on("pointerover", () => {
            darkenButton(creditsButton);
        });

        creditsButton.on("pointerout", () => {
            restoreButton(creditsButton);
        });

        creditsButton.on("pointerup", () => {
            this.sound.play("buttonSound");
            this.scene.start('CreditsScene');
        });

        // Play button
        let playButton = this.add.image(this.cameras.main.centerX, yOffset + buttonSpacing, "button_play");
        playButton.setScale(0.15);
        playButton.setOrigin(0.5, 0);
        playButton.setInteractive();

        // Add hover effects
        playButton.on("pointerover", () => {
            darkenButton(playButton);
        });

        playButton.on("pointerout", () => {
            restoreButton(playButton);
        });

        playButton.on("pointerup", () => {
            this.sound.play("buttonSound"); 
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        });

        // Quit button
        let quitButton = this.add.image(this.cameras.main.centerX, yOffset + 2 * buttonSpacing, "button_quit");
        quitButton.setScale(0.15);
        quitButton.setOrigin(-0.75, 1.05);
        quitButton.setInteractive();

        // Add hover effects
        quitButton.on("pointerover", () => {
            darkenButton(quitButton);
        });

        quitButton.on("pointerout", () => {
            restoreButton(quitButton);
        });

        quitButton.on("pointerup", () => {
            this.sound.play("buttonSound");
            alert("You have exited the game!");
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

        // Load button sound effect
        this.load.audio("buttonSound", "assets/mp3/Wooden Button Click Sound Effect.mp3");
    }

    create() {
        // Add background
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

        // Add hover effects
        function darkenButton(button) {
            button.setTint(0x828282);
        }

        function restoreButton(button) {
            button.clearTint();
        }

        // Hover effects
        backButton.on("pointerover", () => {
            darkenButton(backButton);
        });

        backButton.on("pointerout", () => {
            restoreButton(backButton);
        });

        backButton.on("pointerup", () => {
            this.sound.play("buttonSound");
            this.scene.start('StartScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Reset score
        this.score = 0;
        this.starsCollected = 0;
        
        // Declare class properties
        this.platforms;
        this.player;
        this.stars;
        this.bombs;
        this.score = 0;
        this.scoreText;
        this.cursors;
        this.playerColorIndex = 0;
        this.playerColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee];
        this.starsCollected = 0;
        this.coinSound;
        this.jumpSound;
        this.bombSound;
        this.bgm;
        this.retryButton;
        this.menuButton;
        this.gameOverImage;
    }

    preload() {
        // Load images
        this.load.image("bg", "assets/img/bg.png");
        this.load.image("ground", "assets/img/platform.png");
        this.load.image("star", "assets/img/star.png");
        this.load.image("bomb", "assets/img/bomb.png");
        this.load.spritesheet("dude", "assets/img/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.image("button_retry", "assets/img/button_retry.png");
        this.load.image("button_menu", "assets/img/button_menu.png");
        this.load.image("text_game_over", "assets/img/text_game over.png");

        // Load audio
        this.load.audio("coinSound", "assets/mp3/Mario coin sfx.mp3");
        this.load.audio("jumpSound", "assets/mp3/Mario jump sfx.mp3");
        this.load.audio("bombSound", "assets/mp3/Small bomb explode sfx.mp3");
        this.load.audio("bgm", "assets/mp3/bgm - Ninja Toad.mp3");
    }

    create() {
        this.physics.world.createDebugGraphic();

        // Add background
        this.add.image(0, 0, "bg").setOrigin(0, 0);
        
        
        // Add audio
        this.coinSound = this.sound.add("coinSound");
        this.jumpSound = this.sound.add("jumpSound");
        this.bombSound = this.sound.add("bombSound");
        this.bgm = this.sound.add("bgm", { loop: true });
        this.bgm.play();

        // Audio volume
        this.coinSound.setVolume(0.15);
        this.jumpSound.setVolume(0.15);
        this.bombSound.setVolume(0.75); 

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
        this.player.setTint(this.playerColors[0]);

        // Player movement animations 
        if (!this.anims.get("left")) {
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.get("turn")) {
            this.anims.create({
                key: "turn",
                frames: [{ key: "dude", frame: 4 }],
                frameRate: 20
            });
        }

        if (!this.anims.get("right")) {
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }

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

        // Add score
        this.scoreText = this.add.text(16, 16, "Stars Collected: 0", { fontSize: "20px", fill: "#FFF" });
        this.score = 0;
        this.starsCollected = 0;

        // Colliders
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

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
        if (this.starsCollected % 5 === 0) {
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

    addHoverEffect(button) {
        button.on("pointerover", () => {
            button.setTint(0x828282); 
        });

        button.on("pointerout", () => {
            button.clearTint();
        });
    }

    addClickSound(button) {
        button.on("pointerup", () => {
            this.sound.play("buttonSound");
        });
    }

    hitBomb(player, bomb) {
        if (this.gameOverImage) {
            return;
        }
    
        // Make player invisible
        this.player.setVisible(false);
    
        // Play bomb sound effect
        this.bombSound.play();
    
        // Disable bomb physics body
        bomb.disableBody(true, true);
    
        // Add "GAME OVER" image
        this.gameOverImage = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "text_game_over");
        this.gameOverImage.setScale(0.75);
        this.gameOverImage.setOrigin(0.5, 1);
        this.gameOverImage.setDepth(1);
    
        // Add retry button
        if (!this.retryButton) {
            this.retryButton = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + 100, "button_retry");
            this.retryButton.setOrigin(-0.25, 0.5);
            this.retryButton.setInteractive();
            this.retryButton.setScale(0.15);
            this.retryButton.setDepth(1);
            this.addHoverEffect(this.retryButton);
            this.addClickSound(this.retryButton);
            this.retryButton.on("pointerup", () => this.restartGame());
        }
    
        // Add menu button
        if (!this.menuButton) {
            this.menuButton = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + 200, "button_menu");
            this.menuButton.setOrigin(1.25, 1.55);
            this.menuButton.setInteractive();
            this.menuButton.setScale(0.15);
            this.menuButton.setDepth(1);
            this.addHoverEffect(this.menuButton);
            this.addClickSound(this.menuButton);
            this.menuButton.on("pointerup", () => this.returnToMenu());
        }
    }
    
    restartGame() {
        // Reset player features
        this.player.setVisible(true);
        this.player.setX(100);
        this.player.setY(450);
        this.player.setScale(1);
        this.playerColorIndex = 0;
    
        // Reset score
        this.score = 0;
        this.starsCollected = 0;
        this.scoreText.setText("Stars Collected: " + this.score);
    
        // Remove "GAME OVER" image and buttons
        if (this.gameOverImage) {
            this.gameOverImage.destroy();
            this.gameOverImage = null;
        }
        
        if (this.retryButton) {
            this.retryButton.destroy();
            this.retryButton = null;
        }
    
        if (this.menuButton) {
            this.menuButton.destroy();
            this.menuButton = null;
        }
    
        // Remove bombs and stars
        this.bombs.clear(true, true);

        // Spawn stars
        this.spawnStar();
    }
    
    returnToMenu() {
        if (this.bgm){
            this.bgm.stop();
        }
        this.restartGame();
        this.scene.start('StartScene');
    }
}

let config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 640,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, CreditsScene]
};

let game = new Phaser.Game(config);
import Phaser from 'phaser';
import logoImg from './assets/logo.png';

let platforms;
let player;
let cursors;
let stars;
let bombs;
let score = 0;
let scoreText;
let gameOver = false;   

export default class InitScene extends Phaser.Scene
{
    constructor ()
    {
        super();
        
    }

    preload ()
    {
        /*
        //  This is an example of a bundled image:
        this.load.image('logo', logoImg);

        //  This is an example of loading a static image from the public folder:
        this.load.image('background', 'assets/bg.jpg');
        */
        
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground','./assets/platform.png');
        this.load.image('star','./assets/star.png');
        this.load.image('bomb','./assets/bomb.png');
        this.load.spritesheet('dude',
            './assets/dude.png',
            { frameWidth: 32, frameHeight: 48}
        );
    }
      
    
    
    create () {
        
        /*
        this.add.image(400, 300, 'background');

        const logo = this.add.image(400, 150, 'logo');
      
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
        */
        this.add.image(0,0,'sky').setOrigin(0,0);

        platforms = this.physics.add.staticGroup()
        platforms.create(400, 450, 'ground').setScale(2).refreshBody();

        platforms.create(600, 350, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(610, 100, 'ground');

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x:12,y:0,stepX:480/12}
        });

        stars.children.iterate(function  (child) {
            child.setBounce(Phaser.Math.FloatBetween(0.4,0.8));
        });
        this.physics.add.collider(stars, platforms);

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs,platforms);
        
        scoreText = this.add.text(16,16,'score: 0',{fontSize:'32px',fill:'#000'});

        player = this.physics.add.sprite(100,350,'dude');
        
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude',{start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ {key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        })

        this.add.image(0,0,'star').setOrigin(0,0);

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(player, platforms);

        const collectStar = (player,star) => {
            star.disableBody(true,true);

            score = score + 10;
            scoreText.setText('Score: ' + score);

            if (stars.countActive(true) === 0) {
                stars.children.iterate((child) => {
                    child.enableBody(true,child.x,0,true,true)
                });

                const x = (player.x < 400) 
                    ? Phaser.Math.Between(400,800) 
                    : Phaser.Math.Between(0,400);

                const bomb = bombs.create(x,16,'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200,200),20);
            }
        }
        
        const hitBomb = (player,bomb) => {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }

        this.physics.add.collider(player,bombs,hitBomb,null,this);
        this.physics.add.overlap(player, stars, collectStar, null, this); 
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left',true)
        }

        if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right',true)
        }

        if (!cursors.right.isDown && !cursors.left.isDown) {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-300);
        }
    }
}



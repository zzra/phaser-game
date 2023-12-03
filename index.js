import * as Phaser from 'phaser';
import InitScene from './src/InitScene';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [InitScene] /*{
        preload: InitScene.preload,
        create: InitScene.create,
        update: InitScene.update
    }
    */
};

window.game = new Phaser.Game(config);

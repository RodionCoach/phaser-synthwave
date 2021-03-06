import { DEPTH_LAYERS, GAME_RESOLUTION, SOUND_BUTTON_POSITION, SCORE_GRADIENT } from "../constants";
import { BUTTON_STYLE, SCORE_TITLE_STYLE, SCORE_NUMBERS_STYLE, SCORE_TEXT_STYLE } from "utils/styles";
import { SetAudio } from "sceneHooks/SetAudio";
import SoundButton from "objects/soundButton";
import { GUIContainer } from "objects/guiContainer";
import { IInitData } from "typings/types";
import { createRectangleHitArea } from "utils/createRectangleHitArea";
import api from "api";

class EndScene extends Phaser.Scene {
  currentScore: number;
  soundControl: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "EndScene",
    });

    this.currentScore = 0;
  }

  init(data: IInitData) {
    this.currentScore = data.currentScore;
  }

  create() {
    this.soundControl = new SoundButton({
      scene: this,
      x: SOUND_BUTTON_POSITION.x,
      y: SOUND_BUTTON_POSITION.y,
      texture: "volume",
      frameOn: "default.png",
      frameOff: "pressed.png",
    });

    this.sound.add("gameOver");

    const container = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2)
      .setName("container")
      .setDepth(DEPTH_LAYERS.one);

    const distanceBetweenButtons = -15;
    const buttonGroupPositionY = 75;

    this.add.image(0, 0, "backgroundSecondary").setOrigin(0);
    this.add
      .shader("pannerShader", GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height, GAME_RESOLUTION.width, 350, [
        "back_grid",
      ])
      .setOrigin(0.5, 1.0);
    this.add.image(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2, "backgroundScore").setOrigin(0.5, 0.5);

    const yourScoreText = this.add.text(0, -205, "Your Score", SCORE_TITLE_STYLE).setOrigin(0.5);
    container.add(yourScoreText);
    const scoreText = this.add
      .text(0, -135, `${this.currentScore}`, SCORE_NUMBERS_STYLE)
      .setOrigin(0.5)
      .setTint(SCORE_GRADIENT.topLeft, SCORE_GRADIENT.topRight, SCORE_GRADIENT.bottomLeft, SCORE_GRADIENT.bottomRight);
    container.add(scoreText);
    const bestScoreText = this.add.text(0, -55, this.IsBestScore(), SCORE_TEXT_STYLE).setOrigin(0.5);
    container.add(bestScoreText);

    const buttonRestart = new GUIContainer({
      scene: this,
      name: "buttonRestart",
      x: 0,
      y: buttonGroupPositionY,
      text: "PLAY AGAIN",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.RestartGame();
      },
    });
    createRectangleHitArea(buttonRestart.sprite, 20, 20);
    container.add(buttonRestart);

    const buttonReturn = new GUIContainer({
      scene: this,
      name: "buttonReturn",
      x: 0,
      y: buttonGroupPositionY + buttonRestart.sprite.height + distanceBetweenButtons,
      text: "MAIN MENU",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.ReturnToMainMenu();
      },
    });
    createRectangleHitArea(buttonReturn.sprite, 20, 20);
    container.add(buttonReturn);

    SetAudio(this, "gameOver", 0.5, false);

    api.onGameOver(this.game, this.currentScore);
  }

  IsBestScore() {
    const bestScore = this.registry.get("bestScore");

    return bestScore < this.currentScore ? "It is your best score!" : `Your best Score is ${bestScore}`;
  }

  RestartGame() {
    this.sound.stopAll();
    this.scene.start("CountdownScene");
  }

  ReturnToMainMenu() {
    this.sound.stopAll();
    this.scene.start("StartScene");
  }
}

export default EndScene;

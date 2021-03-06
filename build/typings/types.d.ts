/// <reference types="phaser" />
import type GameScene from "scenes/GameScene";
import type PauseScene from "scenes/PauseScene";
import type RulesScene from "scenes/RulesScene";
import type StartScene from "scenes/StartScene";
import type EndScene from "scenes/EndScene";
import BasePlugin = Phaser.Plugins.BasePlugin;
export interface IInitData {
    currentScore: number;
}
export interface IScore {
    pts: number;
    textObject: Phaser.GameObjects.Text;
}
declare type AllScenesType = GameScene | PauseScene | RulesScene | StartScene | EndScene;
export interface ILevelConfig {
    numbersAmount: number;
    targetNumber: number;
    isExpression?: boolean;
}
export declare type GlowObjectType = {
    glowTask: Phaser.Tweens.Tween;
} & Phaser.GameObjects.Image & Phaser.GameObjects.Text;
export declare type RandomPlacePluginType = {
    randomPlace: Function;
    start: Function;
} & BasePlugin;
export declare type GlowPluginType = {
    add: (object: GlowObjectType) => {};
    start: Function;
} & BasePlugin;
export interface IToggleAudioConfig {
    scene: AllScenesType;
    texture: string;
    frameOn: string;
    frameOff: string;
}
export {};

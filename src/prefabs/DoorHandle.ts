import { Container, Sprite, Texture } from "pixi.js";
import Keyboard from "../core/Keyboard";

export type HandleRotation = number;

export type DoorHandleConfig = {
    textures: {
        handle: string;
        shadow: string;
    };
    width?: number;
    height?: number;
    x?: number;
    y?: number;
};

export default class DoorHandle extends Container {
    name = "Door";

    sprite: Sprite;
    private _handleRotation: HandleRotation = 0;

    private textures: Record<string, Texture>;

    private secret: number[] = [7, -3, 5] //Positive numbers are CW, negative ones are CCW

    private currentCombination: number[] = []

    private keyboard = Keyboard.getInstance();

    constructor(config: DoorHandleConfig) {
        super();

        // Load all textures
        this.textures = {
            [config.textures.handle]: Texture.from(config.textures.handle),
            [config.textures.shadow]: Texture.from(config.textures.shadow)
        };

        console.log(this.textures)

        this.sprite = new Sprite(this.textures[config.textures.handle]);

        if (config.width !== undefined) {
            this.sprite.width = config.width;
        }
        if (config.height !== undefined) {
            this.sprite.height = config.height;
        }

        this.sprite.x = config.x ? config.x * window.innerWidth : 0;
        this.sprite.y = config.y ? config.y * window.innerHeight : 0;

        const handleImageAspectRatio = this.textures[config.textures.handle].width / this.textures[config.textures.handle].height
        if (window.innerWidth > window.innerHeight) {
            this.sprite.height = 0.25 * window.innerHeight;
            this.sprite.width = 0.25 * window.innerHeight * handleImageAspectRatio;
        }
        else {
            this.sprite.width = 0.25 * window.innerWidth;
            this.sprite.height = 0.25 * window.innerWidth * handleImageAspectRatio;
        }

        this.sprite.anchor.set(0.5);

        this.addChild(this.sprite);

        this.keyboard.onAction(({ action, buttonState }) => {
            if (buttonState === "pressed") this.onActionPress(action);
            else if (buttonState === "released") this.onActionRelease(action);
        });
    }


    get state(): HandleRotation {
        return this._handleRotation;
    }

    rotate(amount: number) {
        this._handleRotation += amount;
        this.sprite.rotation += amount * 1.0472; //1.0472 radians in 60 degrees

        if (this.currentCombination.length === 0) {
            this.currentCombination.push(amount);
            console.log("yes")
        }
        else if (this.currentCombination[this.currentCombination.length - 1] > 0) {
            if (amount > 0) {
                this.currentCombination[this.currentCombination.length - 1]++;
            }
            else {
                this.currentCombination.push(amount)
            }
        }
        else if (this.currentCombination[this.currentCombination.length - 1] < 0) {
            if (amount < 0) {
                this.currentCombination[this.currentCombination.length - 1]--;
            }
            else {
                this.currentCombination.push(amount)
            }
        }

        if (this.currentCombination.length > 3) {
            this.currentCombination = this.currentCombination.slice(1)
        }

        console.log(this.currentCombination)
        if (this.currentCombination.length === this.secret.length) {
            let equal = true;
            for (let i = 0; i < this.currentCombination.length; i++) {
                if (this.currentCombination[i] !== this.secret[i]) {
                    equal = false;
                    break;
                }
            }

            if (equal) {
                //WIN THE GAME
                console.log("BANGARANGA")
            }
        }

    }

    private static getRandom() {

    }

    onActionPress = (action: string) => {
        if (action === "UP") {
            this.rotate(1);
        }
        else if (action === "DOWN") {
            this.rotate(-1);
        }
    }

    onActionRelease = (action: string) => {
    }

}
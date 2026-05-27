import { Container, Sprite, Texture } from "pixi.js";
import Door from "./Door";

export type BgConfig = {
    texture: string;
};

export default class Background extends Container {
    name = "Background";

    sprite: Sprite;

    door!: Door

    constructor(
        protected config: BgConfig = {
            texture: "",
        }
    ) {
        super();

        const texture = Texture.from(this.config.texture);
        this.sprite = new Sprite(texture);

        this.sprite.anchor.set(0.5);


        let w = this.sprite.width;
        let h = this.sprite.height;

        const imageAspectRatio: number = w / h;
        const screenAspectRatio: number = window.innerWidth / window.innerHeight;

        if (imageAspectRatio > screenAspectRatio) {
            this.sprite.width = window.innerWidth * (imageAspectRatio / screenAspectRatio)
            this.sprite.height = window.innerHeight;
        }
        else {
            this.sprite.width = window.innerWidth;
            this.sprite.height = window.innerWidth / imageAspectRatio
        }

        this.sprite.x = window.innerWidth / 2;
        this.sprite.y = window.innerHeight / 2;
        this.addChild(this.sprite);

        let doorHeight: number = this.sprite.height * 0.515
        let doorWidth: number = (794 / 723) * doorHeight;

        this.door = new Door({
            textures: {
                open: "door-open",
                closed: "door-closed"
            },
            width: doorWidth,
            height: doorHeight,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        })
        this.addChild( this.door);



    }

    resize(width: number, height: number) {
        this.sprite.width = width;
        this.sprite.height = height;
    }
}
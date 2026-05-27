import { Container, Sprite, Texture } from "pixi.js";

export type BgConfig = {
    texture: string;
};

export default class Background extends Container {
    name = "Background";

    sprite: Sprite;

    constructor(
        protected config: BgConfig = {
            texture: "",
        }
    ) {
        super();

        const texture = Texture.from(this.config.texture);
        this.sprite = new Sprite(texture);

        this.addChild(this.sprite);
    }

    resize(width: number, height: number) {
        this.sprite.width = width;
        this.sprite.height = height;
    }
}
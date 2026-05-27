import { Container, Sprite, Texture } from "pixi.js";
import { Application } from "pixi.js";

export type DoorState = "closed" | "open" | "opening" | "closing";

export type DoorConfig = {
    textures: {
        closed: string;
        open: string;
        opening?: string; // optional, fallback to closed/open if missing
        closing?: string; // optional, fallback to closed/open if missing
    };
    width?: number;
    height?: number;
    x?: number;
    y: number;
};

export default class Door extends Container {
    name = "Door";

    sprite: Sprite;
    private _state: DoorState = "closed";

    private textures: Record<DoorState, Texture>;

    constructor(config: DoorConfig) {
        super();

        // Load all textures
        this.textures = {
            closed: Texture.from(config.textures.closed),
            open: Texture.from(config.textures.open),
            opening: config.textures.opening
                ? Texture.from(config.textures.opening)
                : Texture.from(config.textures.closed),
            closing: config.textures.closing
                ? Texture.from(config.textures.closing)
                : Texture.from(config.textures.open),
        };

        this.sprite = new Sprite(this.textures[this._state]);

        if (config.width !== undefined) {
            this.sprite.width = config.width;
        }
        if (config.height !== undefined) {
            this.sprite.height = config.height;
        }

        this.sprite.x = config.x || 0;
        this.sprite.y = config.y || 0;

        this.sprite.anchor.set(0.45,0.5);

        this.addChild(this.sprite);
    }

    get state(): DoorState {
        return this._state;
    }

    setState(state: DoorState) {
        if (this._state === state) return;

        this._state = state;
        this.sprite.texture = this.textures[state];
    }

    open() {
        this.setState("open");
    }

    close() {
        this.setState("closed");
    }
}
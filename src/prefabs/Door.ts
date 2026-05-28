import { Container, Sprite, Texture } from "pixi.js";
import DoorHandle from "./DoorHandle";
import gsap from "gsap";

export type DoorState = "closed" | "open" | "opening" | "closing";

export type DoorConfig = {
    textures: {
        closed: string;
        open: string;
        shine: string;
        opening?: string; // optional, fallback to closed/open if missing
        closing?: string; // optional, fallback to closed/open if missing
    };
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    restart: () => void
};

export default class Door extends Container {
    name = "Door";

    private doorHandle: DoorHandle;

    sprite: Sprite;
    shineSprite: Sprite;
    private _state: DoorState = "closed";

    private textures: Record<DoorState, Texture>;

    constructor(config: DoorConfig) {
        super();

        this.doorHandle = new DoorHandle({
            textures: { handle: "door-handle", shadow: "door-handle-shadow" }, x: 0.5, y: 0.5, win: () => {
                this.removeChild(this.doorHandle);
                this.setState("open")
                gsap.to(this.shineSprite, {
                    alpha: 1,           // increase opacity (0 to 1)
                    width: this.sprite.width * 1.5,    // increase size by 50%
                    height: this.sprite.height * 1.5,  // increase size by 50%
                    rotation: this.sprite.rotation + Math.PI / 4,  // rotate 45 degrees more
                    duration: 0.3,       // half a second,

                    onComplete: () => {
                        // Second tween runs after the first one completes
                        gsap.to(this.shineSprite, {
                            alpha: 0,
                            width: this.sprite.width * 0.7,
                            height: this.sprite.height * 0.7,
                            rotation: this.sprite.rotation + Math.PI / 4,
                            duration: 0.3
                        });
                    }
                });
                gsap.delayedCall(5, config.restart);
            }
        });

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

        this.sprite.anchor.set(0.45, 0.5);


        this.shineSprite = new Sprite(Texture.from(config.textures.shine))
        this.shineSprite.anchor.set(0.5)
        this.shineSprite.x = window.innerWidth / 2;
        this.shineSprite.y = window.innerHeight / 2;
        this.shineSprite.alpha = 0;

        this.addChild(this.sprite, this.doorHandle, this.shineSprite);
    }


    get state(): DoorState {
        return this._state;
    }

    setState(state: DoorState) {
        if (this._state === state) return;

        this._state = state;
        this.sprite.texture = this.textures[state];
        this.sprite.anchor.set(-0.5, 0.5);

    }

    open() {
        this.setState("open");
    }

    close() {
        this.setState("closed");
    }
}
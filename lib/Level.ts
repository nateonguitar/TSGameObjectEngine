interface LevelParams {
	managingGameObjectClass: Function,
	imageSrcs?: string[],
}

class Level {
	// Inherit from this class.
	// Leave your constructor empty.
	// Override the init() function with the contents:
	// - Set the managingGameObject like this.managingGameObject = ZeldaController
	// - set the images array for each image you will.
	public gameObjects: GameObject[] = [];

	private _cachedImages: {[k:string]: any} = {};
	private imageSrcs: string[] = [];
	private managingGameObjectClass: Function;
	private managingGameObject: GameObject = null;

	constructor(params:LevelParams) {
		for (let key in params) {
			this[key] = params[key];
		}

		for (let src of this.imageSrcs) {
			let img = new Image();
			img.src = src;
			if (this._cachedImages[src]) {
				console.warn("Duplicate image source:");
				console.warn("- Class:  " + this.constructor.name);
				console.warn("- Source: " + src);
			}
			this._cachedImages[src] = img;
			console.log(this._cachedImages);
		}
	}

	public init(): void {
		this.managingGameObject = new (<any>this.managingGameObjectClass)();
	}

	public get cachedImages(): {[k:string]: any} { return this._cachedImages; }

	public update(): void {
		for (let gameObject of this.gameObjects) {
			gameObject.update();
		}
	}

	public draw(): void {
		Canvas.wipe();
		let drawnObjects: GameObject[] = [];

		// loop through our layers
		for (let i=0; i<GameManager.options.layers; i++) {
			// draw gameobjects on that layer
			for (let j=0; j<this.gameObjects.length; j++) {
				let gameObject = this.gameObjects[j];
				if (gameObject.getLayer() == i) {
					drawnObjects.push(gameObject);
					gameObject.draw();
				}
			}
		}

		if (drawnObjects.length < this.gameObjects.length) {
			for (let gameObject of this.gameObjects) {
				if (drawnObjects.indexOf(gameObject) == -1) {
					console.warn(
						gameObject.constructor.name +
						" GameObject was not drawn, did you set its layers properly?"
					);
				}
			}
		}
	}

	public updateAnimations(): void {
		for (let gameObject of this.gameObjects) {
			gameObject.updateAnimations();
		}
	}

	public registerGameObject(gameObject: GameObject): void {
		this.gameObjects.push(gameObject);
	}
}

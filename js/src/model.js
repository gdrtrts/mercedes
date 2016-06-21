//envMap images
	var urls = [
	  'js/textures/urls/pos-x.jpg',
	  'js/textures/urls/neg-x.jpg',
	  'js/textures/urls/pos-y.jpg',
	  'js/textures/urls/neg-y.jpg',
	  'js/textures/urls/pos-z.jpg',
	  'js/textures/urls/neg-z.jpg'
	],

	cubemap = THREE.ImageUtils.loadTextureCube(urls);
	cubemap.format = THREE.RGBFormat;

	var Model = {

		enableWireFrame: false,
		wheelTexture: THREE.ImageUtils.loadTexture('js/textures/clean.jpg'),
		wheelBump: THREE.ImageUtils.loadTexture('js/textures/bump.jpg'),
		flare: THREE.ImageUtils.loadTexture('js/textures/flare.png'),
		modelData: [
						{
							path: "js/models/doorFL.json",
							metal: true,
							shininess: 25,
							specular: 0x222222,
							color: 0xffffff,
							envMap: cubemap,	
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							reflectivity: 0.5,
							wireFrame: this.enableWireFrame,
							isDoor: true

						},

						{

							path: "js/models/interior.json",
							metal: false,
							shininess: 0.15,
							specular: null,
							color: 0x444444,
							envMap: cubemap,	
							side: THREE.DoubleSide,
							texture: THREE.ImageUtils.loadTexture('js/textures/InteriorColor.jpg'),
							bump: THREE.ImageUtils.loadTexture('js/textures/InteriorBump.jpg'),
							bumpScale:  0.25,
							mat: null,
							mesh: null,
							reflectivity: 0.05,
							wireFrame: this.enableWireFrame,
							other: true
							

						},


						{

							path: "js/models/doors.json",
							metal: true,
							shininess: 25,
							specular: 0x222222,
							color: 0xffffff,
							envMap: cubemap,	
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							reflectivity: 0.5,
							wireFrame: this.enableWireFrame,
							other: true
							
						},

						
						{

							path: "js/models/under.json",
							metal: true,
							shininess: 25,
							specular: 0x222222,
							color: 0xffffff,
							envMap: cubemap,	
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							wireFrame: this.enableWireFrame,
							other: true
							

						},

						{

							path: "js/models/frame.json",
							metal: true,
							shininess: 15,
							specular: 0x222222,
							color: 0xffffff,
							envMap: cubemap,	
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							reflectivity: 0.5,
							wireFrame: this.enableWireFrame,
							other: true
							

						},


						{

							path: "js/models/grills.json",
							metal: true,
							shininess: 100,
							specular: 0xffffff,
							color: 0x333333,
							envMap: cubemap,
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							wireFrame: this.enableWireFrame,
							other: true

						},


						{

							path: "js/models/frontLights.json",
							metal: true,
							shininess: 100,
							specular: 0xffffff,
							color: 0x333333,
							envMap: cubemap,
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							wireFrame: this.enableWireFrame,
							other: true

						},


						{

							path: "js/models/windows.json",
							metal: false,
							shininess: 25,
							specular: 0x222222,
							color: 0x111111,
							envMap: cubemap,		
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							opacity: 0.5,
							transparent: true,
							reflectivity: 0.5,
							wireFrame: this.enableWireFrame,
							other: true

						},


						{

							path: "js/models/tailLights.json",
							metal: true,
							shininess: 25,
							specular: 0xffffff,
							color: 0x4c0000,
							envMap: cubemap,
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							wireFrame: this.enableWireFrame,
							other: true
					

						},


							{

							path: "js/models/plane.json",
							metal: false,
							shininess: 15,
							specular: 0x333333,
							color: 0x000000,
							envMap: cubemap,
							reflectivity: 0.10,
							side: THREE.DoubleSide,
							mat: null,
							mesh: null,
							receiveShadow: true,
							scale: 50,
							bump: THREE.ImageUtils.loadTexture('js/textures/steel.jpg'),
							repeatBump: 50,
							isPlane: true,
							bumpScale: 0.15	

						}

					]
	


	}
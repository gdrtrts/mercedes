
(function() {

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
		        window.webkitRequestAnimationFrame ||
		        window.mozRequestAnimationFrame    ||
		        function( callback ){
		        	window.setTimeout(callback, 1000 / 60);
		      };
	})();


	var scene, camera, renderer, controls, wrapper, wheels, doorFL, carParts, modelLoader, el, plane, tween, raycaster, hotSpot,middleSpot;
	var r, g, b, r1, r2, r3;
	var isLoaded = false;


	var
	ANGLE = 60,
	NEAR = 0.1,
	FAR = 10000,
	W = window.innerWidth,
	H = window.innerHeight,
	ASPECT = W/H;

    //GUI	
   var guiControl = 0; 
   guiControl = new function() {

    	this.BgColor =  "#202020";
    	this.CarColor =  "#414141";
    	this.speed = 0.2;
    	this.wireframe = false;
    	this.colorObj = new THREE.Color( guiControl.BgColor );
    	this.lightColorObj = new THREE.Color( guiControl.CarColor );
    	this.xOr = -26;
    	this.zOr = -25;
    	this.openDoor = function() {


    				controls.minDistance = 0;
					controls.maxDistance = 1000;
			

			    	tween = new TWEEN.Tween(camera.position)
			        .to({ x: 0, y: 0, z: 0 }, 4000)
			        .start();

			        tween.easing(TWEEN.Easing.Quadratic.Out);

			        			var currentPosition = camera.position.clone();
								var middlePosition = new THREE.Vector3(200, 60, 25);
								var endPosition = new THREE.Vector3(0, 0, -5);
								var curve = new THREE.QuadraticBezierCurve3(

									currentPosition,
									middlePosition,
									endPosition

								);

							        	//during tween execution
										tween.onUpdate(function(t) {
											camera.position.copy(curve.getPoint(t));
										});

												tween.onComplete(function() {
						
															controls.enableZoom = false;
															middleSpot.visible = true;				
													});

															//rotate door
												    		TweenLite.to(doorFL.rotation, 2, {
																		y: -80 * Math.PI/180
																	});


    	}


    	this.closeDoor = function() {

							    	var tween = new TWEEN.Tween(camera.position)
							        .to({ x: 100, y: 15, z: 15 }, 4000)
							        .start();

							        tween.easing(TWEEN.Easing.Quadratic.InOut);

											tween.onUpdate(function(t) {

												middleSpot.visible = false;
												if (t > 0.25) { TweenLite.to(doorFL.rotation, 2, { y: 0 }); }
											});


													tween.onComplete(function() {

																controls.enableZoom = true;
																controls.minDistance = 75;
																controls.maxDistance = 250;
													});
    							}
	  
   
    };


   	var gui = new dat.GUI();
   	//gui.close();
    gui.add(guiControl, 'speed', 0, 0.4);
    gui.add(guiControl, 'wireframe');
   	gui.add(guiControl, 'openDoor');
   	gui.add(guiControl, 'closeDoor');
    gui.addColor(guiControl,'CarColor');

	initialize();
	animate();

	function initialize() {



		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x888888, 1000, 5000);

		wheels = new THREE.Object3D();
		carParts = new THREE.Object3D();
		plane = new THREE.Object3D();
		doorFL = new THREE.Object3D();
		hotSpot = new THREE.Object3D();
		middleSpot = new THREE.Object3D();
		middleSpot.visible = false;
		
		wheels.position.set(-24.5, 0, -40 - 250);
		carParts.position.set(-30, 0, -50 - 250);
		doorFL.position.set(Math.abs(guiControl.xOr), 0, -225);
		plane.position.copy(carParts.position);

		camera = new THREE.PerspectiveCamera(ANGLE, ASPECT, NEAR, FAR);
		camera.useQuaternion = true;
		camera.position.y = 0;
		camera.position.z = 125;
		scene.add(camera);
		scene.add(wheels);
		scene.add(carParts);
		scene.add(doorFL);
		scene.add(plane);


		renderer = new THREE.WebGLRenderer({

      		  antialias: true,
      		  alpha: true

   		 });

		mouse = new THREE.Vector2();
		raycaster = new THREE.Raycaster();
		renderer.setSize(W, H);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		wrapper = document.getElementById('wrapper');
		el = document.getElementById('loader');
		document.body.appendChild(wrapper);
		wrapper.appendChild(renderer.domElement);	
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.rotateSpeed = 0.1;
		controls.maxPolarAngle = Math.PI/2 - 0.1;
		controls.minPolarAngle = Math.PI/180 * 20;
		controls.enableDamping = true;
		controls.dampingFactor = 0.15;
		controls.minDistance = 75;
		controls.maxDistance = 250;
		
		//MODEL AND LIGHTS
		drawWheel();
		initModels();
		lights();	

		//INIT HOTSPOTS
		var hotSpotOne = new HotSpot(2, 0, -25, hotSpot, doorFL);
		var hotSpotTwo = new HotSpot(20, 0, 10, middleSpot, scene);
		hotSpotOne.make();
		hotSpotTwo.make();
		
		//EVENTS
		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousedown', mouseDown, false )
		
	}



	function mouseDown(event) {

		//calc mouse postion in normalized coordinates. from -1 to +1
		mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

		raycaster.setFromCamera(mouse, camera );
		var intersects = raycaster.intersectObjects( hotSpot.children );

			if (intersects.length>0) guiControl.openDoor();

		var intersect2 = raycaster.intersectObjects( middleSpot.children );

			if (intersect2.length>0) guiControl.closeDoor();

	}


	function initModels() {


			modelLoader = new THREE.JSONLoader();
			
			for (var i = 0; i < Model.modelData.length; i++) {

				//making sure the for loop does not always ends up with only the last one
				//you could use .map as well
				(function(data) {
					modelLoader.load(data.path, function(geometry) {


							if (data.repeatBump) {
								data.bump.repeat.set(data.repeatBump, data.repeatBump);
								data.bump.wrapS = data.bump.wrapT = THREE.RepeatWrapping;
							}

							data.mat = new THREE.MeshPhongMaterial({
									
									metal: data.metal,
									shininess: data.shininess,
									specular: data.specular,
									color: data.color,
									envMap: data.envMap,	
									side: data.side,
									map: data.texture,
									bumpMap: data.bump,
									bumpScale: data.bumpScale,
									reflectivity: data.reflectivity,
									transparent: data.transparent,
									opacity: data.opacity,
									wireframe: data.wireFrame
							});


							data.mesh = new THREE.Mesh(geometry, data.mat);
							data.mesh.scale.set(3, 3, 3);
							data.mesh.position.set(30, -30, 50);
							data.mesh.rotation.y = 0;

							if (data.receiveShadow) {
								data.mesh.receiveShadow = true;

							} else {
								data.mesh.castShadow = true;
							}

							if (data.scale) {
								data.mesh.scale.set(data.scale, data.scale, data.scale);	
							}


									//add door, place and other carparts to different object3D's
									 if (data.isDoor ) {

									 	data.mesh.position.x = guiControl.xOr;
									 	data.mesh.position.z = guiControl.zOr;
										doorFL.add(data.mesh);
									}

											if (data.isPlane ) {
												plane.add(data.mesh);
											}

													if (data.other)  {
														carParts.add(data.mesh);
													}

										});
				//invoke anonymous function
				})(Model.modelData[i]);	
			}
	}


			

	function onWindowResize() {
				
				W = window.innerWidth / 2;
				H = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}

	


	function lights() {

		var light, light2, light3, light4;

		light = new THREE.DirectionalLight( new THREE.Color("rgb(255,255,255)"), 1.5);
		light.position.set( 0, 500, -300 );
		light.castShadow = true;
		light.shadowDarkness = 0.8;
		light.target = carParts;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;

		light2 = new THREE.PointLight( new THREE.Color("rgb(100, 100, 100)"), 1.5, 5000);
		light2.position.set( -200, 590, 500 );

		var light3 = new THREE.DirectionalLight( new THREE.Color("rgb(255,255,255)"), 1);
		light3.position.set( -150, 200, 0 );
		light3.target = carParts;
		light3.castShadow = true;
		light3.shadowDarkness = 0.2;
		light3.shadowMapWidth = 2048;
		light3.shadowMapHeight = 2048;

		var light4 = new THREE.DirectionalLight( new THREE.Color("rgb(255,255,255)"), 1);
		light4.position.set( 100, 200, 0 );
		light4.target = carParts;
		light4.castShadow = true;
		light4.shadowDarkness = 0.2;
		light4.shadowMapWidth = 2048;
		light4.shadowMapHeight = 2048;

		/*
		for (var i = 0; i < 2; i++) {
			var flareLight = new THREE.PointLight( new THREE.Color("rgb(255,255,255)"), 0.5);
			flareLight.position.set( 20 + i * -40, -6, 63 );
			var flareColor = new THREE.Color( 0xffffff );
			flareColor.setHSL( 255, 255, 255);
			var lensFlare = new THREE.LensFlare( Model.flare, 200, 0.0, THREE.AdditiveBlending, flareColor );
			lensFlare.customUpdateCallback = lensFlareUpdateCallback;
			lensFlare.position.copy( flareLight.position);
			scene.add ( lensFlare );
				
			}

		*/

		
		scene.add ( light );
		scene.add ( light2 );
		scene.add ( light3 );
		scene.add ( light4 );
		//scene.add ( flareLight );
		

	}



	 function lensFlareUpdateCallback( object ) {

				var f, fl = object.lensFlares.length;
				var flare;
				var vecX = -object.positionScreen.x * 2;
				var vecY = -object.positionScreen.y * 2;
				
				for( f = 0; f < fl; f++ ) {

					   flare = object.lensFlares[ f ];
					   flare.x = object.positionScreen.x + vecX * flare.distance;
					   flare.y = object.positionScreen.y + vecY * flare.distance;
					   flare.z = -object.positionScreen.y + vecY * flare.distance;
					   flare.rotation = 0;

				}
			}


	function drawWheel() {

		modelLoader = new THREE.JSONLoader();
		modelLoader.load("js/models/wheel1.json", function(geometry) {

			addModelToScene(geometry, Model.wheelTexture, Model.wheelBump );
			
		});
	}

	//wheels
	function addModelToScene(geo, t, b) {

		var material = new THREE.MeshPhongMaterial({
			
			envMap: cubemap,
 			shininess:  25,
			bumpMap: b,
			map: t,
			bumpScale:  0.2,
			side: THREE.DoubleSide

		});

		for (var j = 0; j<2; j++) {
			for (var i = 0; i<2; i++) {
					var mesh = new THREE.Mesh(geo, material);
					mesh.scale.set(3, 3, 3);
					mesh.position.set(0  + i * 48, 12 - 30, 0 + j * 80);
					mesh.rotation.y = Math.PI + i * Math.PI;
					wheels.add(mesh);
			}
		}
	
	}


	//convert "#000000" to seperated r, g and b values
	function hexToRgb(hex) {
		    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		        return r + r + g + g + b + b;
		    });

		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		}

		

	function animate() {

		requestAnimFrame(animate);
		TWEEN.update();
		render();

	}

	var counter = 0;
	var RADIUS_DIVIDER = 3, MIN_RADIUS = 4, DELAY = 1.5;


	function render() {


			//hotspot behaviour
			counter += 0.04;

			for (var i=0; i<2; i++) {
				hotSpot.children[i].scale.x = hotSpot.children[i].scale.y = (Math.cos(counter) * i*DELAY + Math.sin(counter) + MIN_RADIUS) / RADIUS_DIVIDER;
				middleSpot.children[i].scale.x = middleSpot.children[i].scale.y = (Math.cos(counter) * i*DELAY + Math.sin(counter) + MIN_RADIUS) / RADIUS_DIVIDER;
				
			}
		
				
			// move plane under wheels
			plane.position.z -= guiControl.speed * Math.PI * 2;
			if (plane.position.z < -2000) {
					plane.position.z = 0;
			}

			//get RGB values
			r = hexToRgb(guiControl.BgColor).r;
			g = hexToRgb(guiControl.BgColor).g;
			b = hexToRgb(guiControl.BgColor).b;

			r1 = hexToRgb(guiControl.CarColor).r;
			g1 = hexToRgb(guiControl.CarColor).g;
			b1 = hexToRgb(guiControl.CarColor).b;

		
			//preloader
			el.textContent = carParts.children.length * 10 + ' %';

				//this is when all carparts are added
				if ( carParts.children.length > Model.modelData.length - 3) {

							//fade in content + move carparts from back to front
							$('#wrapper').animate({   opacity: 1.0}, { duration: 2000 });
								TweenLite.to(carParts.position, 2, { z: -50 });
									TweenLite.to(wheels.position, 2, { z: -40 });
										TweenLite.to(doorFL.position, 2, { z: 25 });

											//set wireframe for all carparts
											for (var i = 0; i < Model.modelData.length - 1; i++) {
												Model.modelData[i].mat.wireframe = guiControl.wireframe;
											}

												isLoaded = true;
												el.textContent = '100 %';
							
													wrapper.style.backgroundColor = "rgb("+r+","+g+","+b+")";
													Model.modelData[0].mat.color.setRGB(r1/150, g1/150, b1/150);
													Model.modelData[2].mat.color.setRGB(r1/150, g1/150, b1/150);
													Model.modelData[4].mat.color.setRGB(r1/150, g1/150, b1/150);

															for (var i = 0; i<4; i++) {
																wheels.children[i].rotation.x += guiControl.speed;
															}
																	//remove preloader
																	if (isLoaded) el.textContent = '';
									
											//endif	
											}


		 controls.update();
		 camera.lookAt(scene.position);
		 renderer.render(scene, camera);

	}

})();
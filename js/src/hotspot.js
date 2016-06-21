function HotSpot(x, y, z, obj, scene) {

	this.x = x;
	this.y = y;
	this.z = z;
	this.obj = obj;
	this.scene = scene;
}

HotSpot.prototype.make = function() {

		var self = this;
		var geo, mat, mesh;


		for (var i=0; i<2; i++) {
			geo = new THREE.CircleGeometry(0.75 + i/1.5, 32);
			mat = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				side: THREE.DoubleSide,
				opacity: 0.35

			});

			mesh = new THREE.Mesh( geo, mat );
			mesh.position.set(self.x + i * 0.1, self.y, self.z);
			mesh.rotation.y = Math.PI/2;
			self.obj.add(mesh);

			}


		self.scene.add(self.obj);


}
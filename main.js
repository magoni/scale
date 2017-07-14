const detail = 30;

const scene = new THREE.Scene();

// light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 100;

scene.add(pointLight);

// camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 4 );

var time = 1;

// parametric function for geometry
function parafunc ( u, t, optionalTarget ) {
	var result = optionalTarget || new THREE.Vector3();

	var v = 2 * Math.PI * t;
	var x, y, z;

    x = t * t + Math.sin(time*0.1 + v * v);
    // x = (t * t + Math.log2(v/5));
	// x = t*Math.cos( time * v ) * (Math.random() * 0.1) * u * u * 5;
	y = Math.cos( v * v * 3 * (Math.cos(u/2) * 0.1) );
	z = Math.sin ( u ) * Math.cos (u * 10);

	return result.set( x, y, z );
}

// meshes
var geometry = new THREE.ParametricGeometry( parafunc, detail, detail );
geometry.dynamic = true;
const material = new THREE.MeshLambertMaterial( {
	color: 0xffffff,
	side: THREE.DoubleSide,
	shading: THREE.FlatShading
} );

material.emissive = new THREE.Color( 0x555555 );

const mesh = new THREE.Mesh( geometry, material ) ;
scene.add( mesh );

// renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000 );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// controls
const controls = new THREE.OrbitControls( camera, renderer.domElement );

// clock
var clock = new THREE.Clock();

animate();

window.addEventListener( 'resize', onResize );

function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function updateGeometry() {
	mesh.geometry.dispose();
	mesh.geometry = new THREE.ParametricGeometry(parafunc, detail, detail);
}

function animate() {
	requestAnimationFrame( animate );
    // mesh.rotation.x+=.01;
    // mesh.rotation.y+=.01;

	render();
}

function render() {
	var delta = clock.getDelta();
	time = clock.getElapsedTime() * 10;

	// change geometry here
	// TODO figure out how to update the vertices??? uuh
	// geometry = new THREE.ParametricGeometry( parafunc, 25, 25 );
	updateGeometry();

	renderer.render( scene, camera );
}

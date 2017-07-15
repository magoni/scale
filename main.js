// audio
var context = new (window.AudioContext || window.webkitAudioContext)();
var audio = new Audio();
audio.src = 'scale.mp3';
audio.autoplay = true;
document.body.appendChild(audio);

var analyser = context.createAnalyser();

window.addEventListener('load', function(e) {
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
}, false);

analyser.smoothingTimeConstant = 1;
analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var timeDomainData = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(timeDomainData);
var normalisedLevel = 0;
var smoothedLevel = 0;

// visual
const detail = 25;
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
var peakInstantaneousPowerDecibels = 0;

// parametric function for geometry
function parafunc ( u, t, optionalTarget ) {
	var result = optionalTarget || new THREE.Vector3();

	var v = 2 * Math.PI * t;
	var x, y, z;

    // x = t * t + Math.sin(time*0.1 + v * v);
    // x = (t * t + Math.log2(v/5)); //static
	// x = Math.cos(Math.sqrt(v)+0.1*time);
	x = Math.cos(Math.sqrt(v)+0.01*normalisedLevel);
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

function updateAudioLevel() {
	let sum = 0;
	let peakInstantaneousPower = 0;
	analyser.getByteTimeDomainData(timeDomainData);

	//TODO experiment - raising i = hipass?
	for (let i = 0; i < timeDomainData.length; i++) {
		const power = timeDomainData[i] ** 2;
		peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
	}

	peakInstantaneousPowerDecibels = 10 * Math.log10(peakInstantaneousPower);
	normalisedLevel = (peakInstantaneousPowerDecibels-42.0)*100;
	//todo smooth levels
}

function render() {
	var delta = clock.getDelta();
	time = clock.getElapsedTime() * 10;

	updateGeometry();
	updateAudioLevel();

	renderer.render( scene, camera );
}

animate();
window.addEventListener( 'resize', onResize );

var Present = function() {

    THREE.Group.apply(this, arguments);

     // A random color assignment
    var colors = ['#ff0051', '#a53c6c','#f19fa0','#72bdbf','#47689b'],
        boxColor = colors.splice( Math.floor(Math.random()*colors.length), 1 )[0];
        colors.push('#393839'),
        ribbonColor = colors.splice( Math.floor(Math.random()*colors.length), 1 )[0],
        boxMaterial = new THREE.MeshStandardMaterial( {
            color: boxColor,
            shading: THREE.FlatShading,
            metalness: 0,
            roughness: 1
        }),
        ribbonMaterial = new THREE.MeshStandardMaterial( {
            color: ribbonColor,
            shading: THREE.FlatShading,
            metalness: 0,
            roughness: 1
        });

    var box = new THREE.Mesh(
        new THREE.BoxGeometry( 8, 7, 10 ),
        boxMaterial
    );

    box.castShadow = true;
    box.receiveShadow = true;
    this.add(box);

    box = new THREE.Mesh(
        new THREE.BoxGeometry( 2, 8, 11),
        ribbonMaterial
    );

    box.castShadow = true;
    box.receiveShadow = true;
    this.add(box);

    box = new THREE.Mesh(
        new THREE.BoxGeometry( 9, 8, 2),
        ribbonMaterial
    );

    box.castShadow = true;
    box.receiveShadow = true;
    this.add(box);

    var bow = new THREE.Mesh(
        new THREE.TorusGeometry(1.5,1.2,5,5),
        ribbonMaterial
    );
    bow.position.x += 2;
    bow.position.y += 4.5;

    bow.castShadow = true;
    bow.receiveShadow = true;
    this.add(bow);

    bow = new THREE.Mesh(
        new THREE.TorusGeometry(1.5,1.2,5,5),
        ribbonMaterial
    );
    bow.position.x -= 2;
    bow.position.y += 4.5;
    bow.castShadow = true;
    bow.receiveShadow = true;
    this.add(bow);

    this.scale.set(2,2,2);

}
Present.prototype = Object.create(THREE.Group.prototype);
Present.prototype.constructor = Present;

// We'll define a Decoration, which is just a THREE.Group with some customisation
var Decoration = function() {

    // Run the Group constructor with the given arguments
    THREE.Group.apply(this, arguments);

    this.rotationSpeed = Math.random() * 0.02 + 0.005;
    this.rotationPosition = Math.random();

    // A random color assignment
    var colors = ['#ff0051', '#f56762','#a53c6c','#f19fa0','#72bdbf','#47689b'];

    // The main bauble is an Octahedron
    var bauble = new THREE.Mesh(
        addNoise(new THREE.OctahedronGeometry(12,1), 2),
        new THREE.MeshStandardMaterial( {
            color: colors[Math.floor(Math.random()*colors.length)],
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25
    } )
    );
    bauble.castShadow = true;
    bauble.receiveShadow = true;
    bauble.rotateZ(Math.random()*Math.PI*2);
    bauble.rotateY(Math.random()*Math.PI*2);
    this.add(bauble);

    // A cylinder to represent the top attachement
    var shapeOne = new THREE.Mesh(
        addNoise(new THREE.CylinderGeometry(4, 6, 10, 6, 1), 0.5),
        new THREE.MeshStandardMaterial( {
            color: 0xf8db08,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25
        } )
    );
    shapeOne.position.y += 8;
    shapeOne.castShadow = true;
    shapeOne.receiveShadow = true;
    this.add(shapeOne);

    // A Torus to represent the top hook
    var shapeTwo = new THREE.Mesh(
        addNoise(new THREE.TorusGeometry( 2,1, 6, 4, Math.PI), 0.2),
        new THREE.MeshStandardMaterial( {
            color: 0xf8db08,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25

        } )
    );
    shapeTwo.position.y += 13;
    shapeTwo.castShadow = true;
    shapeTwo.receiveShadow = true;
    this.add(shapeTwo);

};
Decoration.prototype = Object.create(THREE.Group.prototype);
Decoration.prototype.constructor = Decoration;
Decoration.prototype.updatePosition = function() {
    this.rotationPosition += this.rotationSpeed;
    this.rotation.y = (Math.sin(this.rotationPosition));
};

// Create a scene which will hold all our meshes to be rendered
var scene = new THREE.Scene();

// Create and position a camera
var camera = new THREE.PerspectiveCamera(
    60,                                   // Field of view
    window.innerWidth/window.innerHeight, // Aspect ratio
    0.1,                                  // Near clipping pane
    1000                                  // Far clipping pane
);

// Reposition the camera
camera.position.set(0,30,50);

// Point the camera at a given coordinate
camera.lookAt(new THREE.Vector3(0,15,0))

// Create a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Size should be the same as the window
renderer.setSize( window.innerWidth, window.innerHeight );

// Set a near white clear color (default is black)
renderer.setClearColor( 0xfff6e6 );

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Append to the document
document.body.appendChild( renderer.domElement );

// Add an ambient lights
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
scene.add( ambientLight );

// Add a point light that will cast shadows
var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add( pointLight );

// A basic material that shows the ground
var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
shadowMaterial.opacity = 0.5;
var groundMesh = new THREE.Mesh(
	new THREE.BoxGeometry( 100, .1, 100 ),
	shadowMaterial
);
groundMesh.receiveShadow = true;
scene.add( groundMesh );

var PotColor = new THREE.Color( "#E55233" );
var pot = new THREE.Mesh(
        new THREE.CylinderGeometry( 10, 8, 11, 8 ),
        new THREE.MeshStandardMaterial( {
            color: PotColor.getHex(),
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25
        } )
    );
scene.add(pot);
var potRim = new THREE.Mesh(
        new THREE.CylinderGeometry( 12, 12, 4, 8 ),
        new THREE.MeshStandardMaterial( {
            color: PotColor.getHex(),
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25
        } )
    );
scene.add(potRim);
potRim.position.y=5;
var PillarColor = new THREE.Color( "#6A1F0F" );
var pillar = new THREE.Mesh(
        new THREE.CylinderGeometry( 5, 6, 9, 8 ),
        new THREE.MeshStandardMaterial( {
            color: PillarColor.getHex(),
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25
        } )
    );
scene.add(pillar);
pillar.position.y=8;

var logo = new THREE.Shape();
    logo.moveTo(3.43, 96.86);
    logo.bezierCurveTo(2.01, 96.86, 1.38, 95.87, 2.04, 94.63);
    logo.lineTo (9.07, 83.43);
    logo.bezierCurveTo(9.72, 82.2, 11.42, 81.2, 12.84, 81.2);
    logo.lineTo (67.94, 81.2);
    logo.bezierCurveTo(69.37, 81.2 , 70, 80.2, 69.34, 78.97);
    logo.lineTo (41.58, 24.87);
    logo.bezierCurveTo(40.92, 23.64, 40.92, 21.65, 41.58, 20.0);
    logo.lineTo (49.44, 5.66);
    logo.bezierCurveTo(49.44+0.65, 5.66-1.23, 49.44+1.72, 5.66-1.23, 51.82, 5.66);
    logo.lineTo (99.22,94.63);
    logo.bezierCurveTo(99.22+0.65, 94.63+1.23, 99.22+0.02, 94.63+2.23, 97.82, 96.86);

    var extrudeSettings = {
        steps: 1,
        amount: 16,
        curveSegments: 1,
        bevelEnabled: true,
        bevelThickness: 5,
        bevelSize: 5,
        bevelSegments: 1
    };

    var treeGroup = new THREE.Group();

    var logoGeometry = new THREE.ExtrudeGeometry( logo, extrudeSettings );
    addNoise(logoGeometry, 2,2,0.5)
    var mesh = new THREE.Mesh( logoGeometry, new THREE.MeshStandardMaterial( {
            color: 0x15a46b,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25
        } ) ) ;

mesh.castShadow = true;
mesh.receiveShadow = true;
treeGroup.add( mesh );

scene.add(treeGroup);
treeGroup.rotateZ(Math.PI);
treeGroup.rotateY(Math.PI);
treeGroup.position.y += 114;
treeGroup.position.x -= 50;
treeGroup.position.z += 10;

var p = new Present();
for(var angle = 0; angle < 360; angle += Math.random()*20+20) {
    var p = new Present();
    var radius = Math.random() * 40 + 50;
    p.position.x =  Math.cos(angle * Math.PI / 180) * radius;
    p.position.z =  Math.sin(angle * Math.PI / 180) * radius;
    p.scale.set(Math.random() + 1, Math.random() + 1,Math.random() + 1);
    scene.add(p);
}
// Render the scene/camera combnation
renderer.render(scene, camera);

// Add an orbit control which allows us to move around the scene. See the three.js example for more details
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target = new THREE.Vector3(0,15,0);
controls.maxPolarAngle = Math.PI / 2;

requestAnimationFrame(render);

function render() {

    controls.update();

    // Update the decoration positions

var p = new Present();

    // Render the scene/camera combnation
    renderer.render(scene, camera);

    // Repeat
    requestAnimationFrame(render);
}

/**
 * Helper function to add random noise to geometry vertixes
 *
 * @param geometry The geometry to alter
 * @param noiseX Amount of noise on the X axis
 * @param noiseY Amount of noise on the Y axis
 * @param noiseZ Amount of noise on the Z axis
 * @returns the geometry object
 */
function addNoise(geometry, noiseX, noiseY, noiseZ) {

    noiseX = noiseX || 2;
    noiseY = noiseY || noiseX;
    noiseZ = noiseZ || noiseY;

    // loop through each vertix in the geometry and move it randomly
    for(var i = 0; i < geometry.vertices.length; i++){
        var v = geometry.vertices[i];
        v.x += -noiseX / 2 + Math.random() * noiseX;
        v.y += -noiseY / 2 + Math.random() * noiseY;
        v.z += -noiseZ / 2 + Math.random() * noiseZ;
    }

    return geometry;
}

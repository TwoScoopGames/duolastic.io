var camera;
var scene;
var renderer;
var stars=[];

function init(){
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 5;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x7609A2, 1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}



function makeSprite(options) {
  var texture = new THREE.TextureLoader().setPath("./").load(options.texture);
  texture.generateMipmaps = true;
  var material = new THREE.SpriteMaterial({
    useScreenCoordinates: false,
    map: texture
  });

  // material.blending = THREE.CustomBlending;
  // material.blendSrc = THREE.OneFactor;
  // material.blendDst = THREE.OneMinusSrcAlphaFactor;
  var sprite = new THREE.Sprite(material);
  sprite.scale.set(options.width, options.height, 1.0); // imageWidth, imageHeight
  return sprite;
}

function addSpheres(){
  for ( var z= -1000; z < 1000; z+=8 ) {
    // var texture = new THREE.TextureLoader().setPath("./").load("images/star.png");
    // console.log(texture);
    // texture.generateMipmaps = true;
    // var material = new THREE.SpriteMaterial({
    //   useScreenCoordinates: false,
    //   map: texture
    // });
    // var sprite = new THREE.Sprite(material);
    // sprite.scale.set(64, 64, 1.0); // imageWidth, imageHeight
    // return sprite;

    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;
    sphere.position.z = z;
    scene.add( sphere );
    stars.push(sphere);
  }
}

function animateStars() {
  for(var i = 0; i < stars.length; i++) {
    star = stars[i];
    star.position.z +=  i/10;
    if(star.position.z>1000) star.position.z-=2000;
  }
}

THREEx.WindowResize(renderer, camera);
function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
  animateStars();
}

init();
addSpheres();
render();







var random = {
  "inRange": function(min, max) {
    return min + Math.random() * (max - min);
  },
  "from": function(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
};

module.exports = { // eslint-disable-line no-unused-vars
  spawn: function(game, options) {
    for (var i = 0; i < options.stars; i++) {
      var position = {};
      var cubeSides = getCubeSides(options.cube);
      position.x = random.inRange(cubeSides.left, cubeSides.right);
      position.y = random.inRange(cubeSides.top, cubeSides.bottom);
      position.z = random.inRange(cubeSides.front, cubeSides.back);
      this.createStar(game, position, options);
    }
  },
  createStar: function(game, position, options) {
    var newEntity = game.entities.create();

    var model = game.entities.addComponent(newEntity, "model");
    model.name = "sprite";
    model.options = {};

    model.options.color = "0xffffff";
    model.options.height = 64;
    model.options.width = 64;
    model.options.texture = options.image;

    var newPosition = game.entities.addComponent(newEntity, "position");
    newPosition.x = position.x;
    newPosition.y = position.y;
    newPosition.z = position.z;

    var velocity = game.entities.addComponent(newEntity, "velocity");
    velocity[options.direction] = options.velocity;

    game.entities.addComponent(newEntity, "size");

    var resetIfOutsideCube = game.entities.addComponent(newEntity, "resetIfOutsideCube");
    resetIfOutsideCube.origin = position;
    resetIfOutsideCube.cube = options.cube;

    return newEntity;
  }
};

function getCubeSides(cube) {
  var cubeSides = {};

  var half_of_box_width = cube.width / 2;
  cubeSides.left = cube.x - half_of_box_width;
  cubeSides.right = cube.x + half_of_box_width;

  var half_of_box_height = cube.height / 2;
  cubeSides.bottom = cube.y - half_of_box_height;
  cubeSides.top = cube.y + half_of_box_height;

  var half_of_box_depth = cube.depth / 2;
  cubeSides.back = cube.z - half_of_box_depth;
  cubeSides.front = cube.z + half_of_box_depth;

  return cubeSides;
}

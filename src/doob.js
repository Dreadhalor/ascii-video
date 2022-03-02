// webcam

var video = document.createElement('video');
video.width = 640;
video.height = 480;

var constraints = { video: { facingMode: 'user' } };
navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
  video.srcObject = stream;
  video.onloadedmetadata = function () {
    video.play();
    init();
  };
});

//

var camera, scene, material, renderer;

var slider = document.getElementById('slider');

var save = document.getElementById('save');
save.addEventListener(
  'click',
  function (event) {
    window.open(renderer.domElement.toDataURL('image/png'), '_blank');
  },
  false
);

var init = function () {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 500;

  scene = new THREE.Scene();

  texture = new THREE.Texture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  //

  var width = video.width;
  var height = video.height;

  var triangles = width * height * 2;

  var geometry = new THREE.BufferGeometry();
  geometry.attributes = {
    index: {
      itemSize: 1,
      array: new Int16Array(triangles * 3),
      numItems: triangles * 3,
    },
    position: {
      itemSize: 3,
      array: new Float32Array(triangles * 3 * 3),
      numItems: triangles * 3 * 3,
    },
    uv: {
      itemSize: 2,
      array: new Float32Array(triangles * 3 * 2),
      numItems: triangles * 3 * 2,
    },
  };

  var chunkSize = 20000;

  var indices = geometry.attributes.index.array;

  for (var i = 0; i < indices.length; i++) {
    indices[i] = i % (3 * chunkSize);
  }

  var positions = geometry.attributes.position.array;
  var uvs = geometry.attributes.uv.array;

  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var i = 0,
    j = 0;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      positions[i++] = x - halfWidth;
      positions[i++] = y - halfHeight;
      positions[i++] = 0;

      positions[i++] = x - halfWidth;
      positions[i++] = y - halfHeight - 1;
      positions[i++] = 0;

      positions[i++] = x - halfWidth + 1;
      positions[i++] = y - halfHeight;
      positions[i++] = 0;

      uvs[j++] = x / width;
      uvs[j++] = y / height;

      uvs[j++] = x / width;
      uvs[j++] = (y - 1) / height;

      uvs[j++] = (x + 1) / width;
      uvs[j++] = y / height;

      //

      positions[i++] = x - halfWidth + 1;
      positions[i++] = y - halfHeight;
      positions[i++] = 0;

      positions[i++] = x - halfWidth;
      positions[i++] = y - halfHeight - 1;
      positions[i++] = 0;

      positions[i++] = x - halfWidth + 1;
      positions[i++] = y - halfHeight - 1;
      positions[i++] = 0;

      uvs[j++] = (x + 1) / width;
      uvs[j++] = y / height;

      uvs[j++] = x / width;
      uvs[j++] = (y - 1) / height;

      uvs[j++] = (x + 1) / width;
      uvs[j++] = (y - 1) / height;
    }
  }

  geometry.offsets = [];

  var start = 0;
  var index = 0;
  var left = triangles * 3;

  for (;;) {
    var count = Math.min(chunkSize * 3, left);

    var chunk = { start: start, count: count, index: index };

    geometry.offsets.push(chunk);

    start += count;
    index += chunkSize * 3;

    left -= count;

    if (left <= 0) break;
  }

  geometry.computeBoundingSphere();

  //

  material = new THREE.ShaderMaterial({
    uniforms: {
      map: { type: 't', value: texture },
      amount: { type: 'f', value: 200 },
    },
    vertexShader: document.getElementById('vs').textContent,
    fragmentShader: document.getElementById('fs').textContent,
    side: THREE.BackSide,
  });

  var mesh = new THREE.Mesh(geometry, material);
  mesh.scale.x = -1;
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  animate();
};

var onWindowResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

var animate = function () {
  requestAnimationFrame(animate);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    texture.needsUpdate = true;
  }

  material.uniforms.amount.value = slider.value;

  renderer.render(scene, camera);
};

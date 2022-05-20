p5.disableFriendlyErrors = true;

  const amount = {
    darkWater: 0,
    lightWater: 0,
    sand: 0,
    grass: 0,
    forest: 0,
    rock: 0,
    snow: 0,
    oil: 0,
    cave: 0
  };

const opts = {
  // Generation Details
  height: 919,
  tile_size: 10,
  outline: true,
  outline_width: 1,
  noise_mod: 1,
  noise_scale: .01,
  noise_max: 120,
  island_size: .62,
  
  // Initial Colors
  dark_water: [120, 120, 225], // RGB array
  light_water: [150, 150, 255],
  sand: [237, 201, 175],
  grass: [207, 241, 135],
  forest: [167, 201, 135],
  rocks: [170, 170, 170],
  snow: [255, 255, 255],
  oil: [70, 67, 67],
  cave: [190, 127, 88],
  outline_color: '#918585',
  
  // Initial Height Ranges
  snow_height: 0.72,
  rocks_height:.6,
  forest_height:.49,
  grass_height: .36, 
  sand_height: .26,
  light_water_height: .23,
  dark_water_height: .13,

  // Chances
  cave_chance: .01 ,
  oil_chance: 3,

  //Nft Functions
  saveAmount: 100,
  nftCreate: () => nftCreate(),
  
  // Additional Functions
  randomize: () => randomize(),
  save: () => save()
  
};

window.onload = function() {
  var gui = new dat.GUI({width:300, hideable: true});
  var general = gui.addFolder('Generation Details')
  general.add(opts, 'height', 500, 2000).onChange(setup);
  general.add(opts, 'tile_size', 2, 20).onChange(setup);
  
  general.add(opts, 'outline_width', 1, 5).onChange(setup);
  
  general.add(opts, 'island_size', 0, 2).onChange(setup);
  general.add(opts, 'noise_scale', 0, .04).onChange(setup);
  general.add(opts, 'noise_mod', 1, 3).onChange(setup);
  general.addColor(opts, 'outline_color').onChange(setup);
  general.add(opts, 'outline').onChange(setup);
  
  var colors = gui.addFolder('Biome Colors');
  colors.addColor(opts, 'snow').onChange(setup);
  colors.addColor(opts, 'rocks').onChange(setup);
  colors.addColor(opts, 'forest').onChange(setup);
  colors.addColor(opts, 'grass').onChange(setup);
  colors.addColor(opts, 'sand').onChange(setup);
  colors.addColor(opts, 'light_water').onChange(setup);
  colors.addColor(opts, 'dark_water').onChange(setup);
  colors.addColor(opts, 'oil').onChange(setup);
  colors.addColor(opts, 'cave').onChange(setup);
 

  var heights = gui.addFolder('Height Ranges');
  heights.add(opts, 'snow_height', 0, 1).onChange(setup);
  heights.add(opts, 'rocks_height', 0, 1).onChange(setup);
  heights.add(opts, 'forest_height', 0, 1).onChange(setup);
  heights.add(opts, 'grass_height', 0, 1).onChange(setup);
  heights.add(opts, 'sand_height', 0, 1).onChange(setup);
  heights.add(opts, 'light_water_height', 0, 1).onChange(setup);
  heights.add(opts, 'dark_water_height', 0, 1).onChange(setup);

  var random = gui.addFolder('Chances');
  random.add(opts, 'cave_chance', 0, 100).onChange(setup);
  random.add(opts, 'oil_chance', 0, 100).onChange(setup);

  var nftTools = gui.addFolder('NftTools');
  nftTools.add(opts, 'saveAmount', 0, 1000).onChange(setup);
  nftTools.add(opts, 'nftCreate').onChange(setup);

  gui.add(opts, "randomize").name("Randomize");
  gui.add(opts, "save").name("Save");
};
  let json = {};

function resetAmount() {
  amount.darkWater = 0;
  amount.lightWater = 0;
  amount.sand = 0;
  amount.grass = 0;
  amount.forest = 0;
  amount.rock = 0;
  amount.snow = 0;
  amount.oil = 0;
  amount.cave = 0;
}
function setupMeta() { 
  json.name = 'Lion'; 
  json.id = 0;
  json.species = 'Panthera leo';
}

function randomize() {
  noiseSeed();
  setup();
  resetAmount();
  setupMeta();
}

function save() {
  let i = 0;
  randomize();
  randomize();
  randomize();
  save('photo.png');
}

function nftCreate() {
  randomize();
  randomize();
  randomize();
  for (let i = 0; i < opts.saveAmount; i++) {
     randomize();
     save(i + '.png');
     let name = (i + '.json');
     saveJSON(json, name);
  }
}

function setup()
{
  var canvasDiv = document.getElementById('sketchdiv');
  var width = canvasDiv.offsetWidth;
  var height = opts.height;


  pixelDensity(2);
  
  var cnv = createCanvas(width, height);
  cnv.parent('sketchdiv');
  
  background(255)
  strokeWeight(1);
  stroke(0);
  
  draw_hexagon(30, 30, 30, 3);
  
  var hexagon_size = opts.tile_size

  var map_height = int(1.5 * height / (.86 * hexagon_size))
  var map_width =  int(1.5 * width / (hexagon_size * 3))
  
  var hex_map = []
  for(i = 0; i < map_height ; i++) { 
    hex_map.push([])
  }
  
  var y = 0
  var x = 0

  for (i = 0; i < map_height; i++) {
    y = i * (.86 * hexagon_size)
    for (j = 0; j < map_width; j++) {
      if (i%2 == 0) {
        x = j * (hexagon_size * 3)
      } else {
        x = (hexagon_size * 1.5) + j * (hexagon_size * 3)
      }
      
      // Calculate initial noise value
      let noiseVal = noise((x / opts.noise_mod)*opts.noise_scale, (y / opts.noise_mod)*opts.noise_scale);
      
      
      // Adjust for distance if desired
      let dist = sqrt(pow((x - width/2), 2) + pow((y - height/2), 2))
      let grad = dist / (opts.island_size * min(width, height))
      
      noiseVal -= pow(grad, 3)
      noiseVal = max(noiseVal, 0)
      
      hex_map[i].push([x, y, noiseVal])
    }
  }
  
  for (r = 0; r < hex_map.length; r++) {
    for (c = 0; c < hex_map[r].length; c++) {
      var t = hex_map[r][c]
      draw_hexagon(t[0], t[1], hexagon_size, t[2], 0)
    }
  }
  var totalTiles = + amount.cave + amount.oil + amount.snow + amount.rock + amount.forest + amount.grass + amount.sand + amount.lightWater + amount.darkWater;
  console.log('\n'.repeat('25'));
  console.log('Dark Water Tiles: ' + ((amount.darkWater / totalTiles) * 100) + '%');
  console.log('Light Water Tiles: ' + ((amount.lightWater / totalTiles) * 100) + '%');
  console.log('Sand Tiles: ' + ((amount.sand / totalTiles) * 100) + ' %');
  console.log('Grass Tiles: ' + ((amount.grass / totalTiles) * 100) + ' %');
  console.log('Forest Tiles: ' + ((amount.forest / totalTiles) * 100) + ' %');
  console.log('Rocks Tiles: ' + ((amount.rock / totalTiles) * 100) + ' %');
  console.log('Snow Tiles: ' + ((amount.snow / totalTiles) * 100) + ' %');
  console.log('Oil Tiles: ' + ((amount.oil / totalTiles) * 100) + ' %');
  console.log('Cave Tiles: ' + ((amount.cave / totalTiles) * 100) + ' %');
  console.log('Total Tiles: ' + totalTiles);

  setupMeta();
}

function draw_hexagon(x, y, side, n, h) {
    let v = int(n * 255.0)
    let c;
    if (v < opts.dark_water_height * 255) {
      c = opts.dark_water;
      amount.darkWater++;
    } else if(v < opts.light_water_height * 255) {
      c = opts.light_water;
      amount.lightWater++;
    } else if (v < opts.sand_height * 255) {
      c = opts.sand;
      amount.sand++;
    } else if (v < opts.grass_height * 255) {
      c = opts.grass
      amount.grass++;
    } else if (v < opts.forest_height * 255) {
      c = opts.forest;
      amount.forest++;
    } else if (v < opts.rocks_height * 255) {
      if(Math.random() * 100 <= opts.cave_chance) {
        c = opts.cave;
        amount.cave++;
      } else {
        c = opts.rocks;
        amount.rock++;
      }
    } else {
      if (Math.random() * 100 <= opts.oil_chance) {
        c = opts.oil;
        amount.oil++;
      } else {
        c = opts.snow;
        amount.snow++;
      }
    }
  
    fill(c)
    
    strokeWeight(opts.outline_width);
    if (opts.outline) {
      stroke(opts.outline_color);
    } else {
      stroke(c)
    }
    
    beginShape()
    vertex(x + side * sin(PI/2), y + side * cos(PI/2) - h)
    vertex(x + side * sin(PI/6), y + side * cos(PI/6) - h)
    vertex(x + side * sin(11 * PI/6), y + side * cos(11 * PI/6) - h)
    vertex(x + side * sin(3 * PI/2), y + side * cos(3 * PI/2) - h)
    vertex(x + side * sin(7 * PI/6), y + side * cos(7 * PI/6) - h)
    vertex(x + side * sin(5 * PI/6), y + side * cos(5 * PI/6) - h)
    endShape(CLOSE)
}
p5.disableFriendlyErrors = true;


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
    dark_rock: [140, 140, 140],
    dark_rock_1: [140, 140, 140],
    dark_rock_2: [140, 140, 140],
    dark_rock_3: [140, 140, 140],
    light_rock: [190, 190, 190],
    light_rock_1: [190, 190, 190],
    light_rock_2: [190, 190, 190],
    outline_color: [102, 92, 92],

    // Initial Height Ranges
    dark_rock_3_height: 72, //= snow
    dark_rock_1_height: .6, //= rocks
    light_rock_1_height: .49, //= forest
    light_rock_2_height: .36, //= grass
    dark_rock_2_height: .26, //= sand
    light_rock_height: .23, //no touche is base
    dark_rock_height: .13, //no touche is base

    // Chances

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
    colors.addColor(opts, 'dark_rock').onChange(setup);
    colors.addColor(opts, 'dark_rock_1').onChange(setup);
    colors.addColor(opts, 'dark_rock_2').onChange(setup);
    colors.addColor(opts, 'dark_rock_3').onChange(setup);
    colors.addColor(opts, 'light_rock').onChange(setup);
    colors.addColor(opts, 'light_rock_1').onChange(setup);
    colors.addColor(opts, 'light_rock_2').onChange(setup);

    var heights = gui.addFolder('Height Ranges');
    heights.add(opts, 'dark_rock_height', 0, 1).onChange(setup);
    heights.add(opts, 'dark_rock_1_height', 0, 1).onChange(setup);
    heights.add(opts, 'dark_rock_2_height', 0, 1).onChange(setup);
    heights.add(opts, 'dark_rock_3_height', 0, 1).onChange(setup);
    heights.add(opts, 'light_rock_height', 0, 1).onChange(setup);
    heights.add(opts, 'light_rock_1_height', 0, 1).onChange(setup);
    heights.add(opts, 'light_rock_2_height', 0, 1).onChange(setup);

    gui.add(opts, "randomize").name("Randomize");
    gui.add(opts, "save").name("Save");
};

function randomize() {
    noiseSeed()
    setup()
}

function save() {
    save('photo.png');
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

}

function draw_hexagon(x, y, side, n, h) {
    let v = int(n * 255.0)
    let c;
    if (v < opts.dark_rock_height * 255) {
        c = opts.dark_rock;
    } else if (v < opts.light_rock_height * 255) {
        c = opts.light_rock;
    } else if (v < opts.dark_rock_2_height * 255) {
        c = opts.dark_rock_2;
    } else if (v < opts.light_rock_2_height * 255) {
        c = opts.light_rock_2;
    } else if (v < opts.light_rock_1_height * 255) {
        c = opts.light_rock_1;
    } else if (v < opts.dark_rock_1 * 255) {
        c = opts.dark_rock_1;
    } else {
        c = opts.dark_rock_3;
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
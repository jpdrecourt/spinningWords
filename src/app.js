/*
* Spinning words
* Author: Jean-Philippe Drecourt
*/

// Dependencies
// ----------------------------------------------------------------------------
import $ from 'jquery';
let createFps;
import { Howl } from 'howler';
// Data
// ----------------------------------------------------------------------------
// Poem as a set of strings
import {poem} from './data';
// DOM elements
// ----------------------------------------------------------------------------
let $poem = $('#poem');
// Constants
// ----------------------------------------------------------------------------
// Controls
const KEY = {
  LEFT: 'o',
  RIGHT: 'p',
  DOWN: 'a',
  UP: 'q'
};
// Assets
const SOUND_DIR = './assets/sounds/';
let SOUNDS = {
  'anneHathawayMix': SOUND_DIR + 'anne_hathaway_final_mix',
  'mangledVerse1'  : SOUND_DIR + 'mangled_verse01',
  'mangledVerse2'  : SOUND_DIR + 'mangled_verse02',
  'mangledVerse3'  : SOUND_DIR + 'mangled_verse03',
  'mangledVerse4'  : SOUND_DIR + 'mangled_verse04',
  'mangledVerse5'  : SOUND_DIR + 'mangled_verse05',
  'mangledVerse6'  : SOUND_DIR + 'mangled_verse06',
  'mangledVerse7'  : SOUND_DIR + 'mangled_verse07',
  'mangledVerse8'  : SOUND_DIR + 'mangled_verse08',
  'mangledVerse9'  : SOUND_DIR + 'mangled_verse09',
  'mangledVerse10' : SOUND_DIR + 'mangled_verse10',
  'mangledVerse11' : SOUND_DIR + 'mangled_verse11',
  'mangledVerse12' : SOUND_DIR + 'mangled_verse12',
  'mangledVerse13' : SOUND_DIR + 'mangled_verse13',
  'mangledVerse14' : SOUND_DIR + 'mangled_verse14',
  'fullPoem'       : SOUND_DIR + 'FullPoem'
};
let sounds = {};
const IMG_DIR = './assets/img/';
const IMG = {};
let img = {};
// Verse data
const VERSE_STARTS = [0, 2986, 6546, 10146, 12966, 16516, 19930, 23261, 27033, 30247, 34470, 38090, 42056, 45635];
const VERSE_LENGTHS = [2986, 3560, 3600, 2820, 3550, 3404, 3441, 3772, 3214, 4223, 3620, 3966, 3579, 4500];
//3504
// Physics
// TODO: Figure out the exact physics
const DV = 1500, // Acceleration
  FRICTION = 2; // Friction coefficient
// Global variables
// ----------------------------------------------------------------------------
// Spinning planets
let planets = [];
// Star
let $star;
// Interaction object
let player = {
  input: {left: false, right: false, up: false, down: false}
};
// Currently destroying a planet
let isPlanetDestroyed = false;
// Ready for the final scene
let isReadyForFinal = false;
// Visualisation Functions
// ----------------------------------------------------------------------------
// Activating and deactivating the star
let activateStar = () => {
  isPlanetDestroyed = false;
  $star.removeClass('dim').addClass('bright');
};
let deactivateStar = () => {
  isPlanetDestroyed = true;
  $star.removeClass('bright').addClass('dim');
};
// Create words at given coordinates
let $createFlyingWord = (offset, word, parent = 'body') => {
  return $newObject(offset, 'flyingWord', parent).text(word);
};
// Create the planets
let createPlanets = (callback) => {
  const PLANET_DELAY = 2500;
  setTimeout(callback, $('.verse').length * PLANET_DELAY);
  planetSoundSprites();
  // Create one planet per verse
  $('.verse').each((i, d) => {
    setTimeout( (i, d) => {
      // Extract the words
      let verseWords = stringToWords(d.innerText);
      let verseLetters = wordsToLetters(verseWords);
      // Extract the words position
      spanify($(d), verseWords, `verse${i}`);
      // FIXME: Offset between the flying words final position and the words in the poem
      let wordPositions = spannifiedPositions(`verse${i}`);
      // Create a new planet
      let offset = {
        'top': $(document).height() / 2 + randomValue(-maxRadius(), maxRadius()),
        'left': $(document).width() / 2 + randomValue(-maxRadius(), maxRadius())
      };
      let $thisPlanet = $newObject(offset, 'planet', '.poemContainer');
      $thisPlanet.animate({'opacity': 1}, 1000);
      sounds[`mangledVerse${i + 1}`].play();
      verseLetters.forEach( (l) => {
        let $l = $(`<span class='letter'>${l}</span>`);
        $thisPlanet.append($l);
        $l.offset({
          left: randomValue($thisPlanet.width()) + $thisPlanet.offset().left,
          top: randomValue($thisPlanet.height()) + $thisPlanet.offset().top
        });
      });
      $thisPlanet.data({
        'sprite': `verse${i + 1}`,
        'verse': $(d),
        'words': verseWords,
        'positions': wordPositions,
        'centre': {
          'top': $(document).height() / 2,
          'left': $(document).width() / 2
        },
        'direction': Math.floor(Math.random() * 2) * 2 - 1,
        'period': randomValue(7, 9)
      });
      planets.push($thisPlanet);
    }, PLANET_DELAY*i, i, d);
  });
};
// Create planets sound sprites
let planetSoundSprites = () => {
  let sprites = {};
  VERSE_STARTS.forEach( (v, i) => {
    sprites[`verse${i + 1}`] = [v, VERSE_LENGTHS[i]];
  });
  sounds.anneHathawayMix._sprite = sprites;
};
// Destroys the planet as a jquery object
let destroyPlanet = ($p) => {
  deactivateStar();
  let currentOffset = $p.offset();
  let $verse = $p.data('verse');
  let wordPositions = $p.data('positions');
  let planetSprite = $p.data('sprite');
  let planetSoundId = sounds.anneHathawayMix.play(planetSprite);
  planets.splice(planets.indexOf($p), 1);
  $p.remove();
  if (planets.length === 0) {
    isReadyForFinal = true;
  }
  wordPositions.forEach((data, index, array) => {
    let w = data.word;
    let pos = data.offset;
    let $flyingWord = $createFlyingWord(currentOffset, w, '.poemContainer');
    $flyingWord.animate(pos, sounds.anneHathawayMix.duration(planetSoundId) * 1000, () => {
      $flyingWord.remove();
      $verse.css('opacity', 1);
      activateStar();
      if (isReadyForFinal) {
        isReadyForFinal = false;
        playFinal();
      }
    });
  });
};
// Create a new moving object with a given initial position
// as jquery coordinate and a class name. Returns a jQuery object
let $newObject = (offset, objectClass='', parent='body') => {
  return $('<div></div>')
  .addClass(objectClass)
  .css('position', 'absolute')
  .offset(offset)
  .appendTo(parent);
};
// Make the object orbit around a point as an jQuery coordinate object from its current position at a given orbital speed in frames - Direction 1 is clockwise.
let orbitObject = ($object, centre, speed, direction = 1) => {
  let dTheta = 2 * Math.PI / speed * direction,
  origin = $object.offset();
  $object.offset({
    'left': centre.left +
    (origin.left - centre.left) * Math.cos(dTheta) -
    (origin.top - centre.top) * Math.sin(dTheta),
    'top' : centre.top +
    (origin.top - centre.top) * Math.cos(dTheta) +
    (origin.left - centre.left) * Math.sin(dTheta)
  });
};
// Turns the poem array into divs with class 'verse'
let versify = (arrayOfStrings) => {
  return '<div class="verse">' +
    arrayOfStrings.reduce((prev, curr) => {
      return prev + '</div><div class="verse">' + curr;
    }) + '</div>';
};
// Data processing functions
// ---------------------------------------------------------------------------
// Calculate the distance between two two jQuery coordinate object
let dist = (coord1, coord2) => {
  return Math.sqrt(Math.pow(coord1.left - coord2.left, 2) +
  Math.pow(coord1.top - coord2.top, 2));
};
// Loading assets
let loadAssets = (callback) => {
  let assetCount = Object.keys(SOUNDS).length + Object.keys(IMG).length;
  // Loading sounds
  let canPlay = () => {if (--assetCount === 0) callback();};
  // General sound setup
  $.each(SOUNDS, (key, value) => {
    sounds[key] = new Howl({
      src: [value + '.mp3', value + '.ogg'],
      onload: canPlay
    });
  });
  // Loading images
  // TODO Loading image assets
};
// Calculate the max orbit radius according to current documents parameters
let maxRadius = () => {
  return Math.min($(document).width(), $(document).height()) * 0.8 / 2;
};
// Extract the positions of each word in a given class created by spannify
// and returns them in an array
let spannifiedPositions = (spanClass) => {
  let positions = [];
  $(`.${spanClass}`).each((i, d) => {
    positions.push({
      'word': d.innerText,
      'offset': $(d).offset()
    });
  });
  return positions;
};
// Crawls the jquery $object and creates a span around each word of the word
// list. The span gets one class [spanClass]
let spanify = ($object, words, spanClass='word') => {
  // let sortedWords = sortPerLength(words);
  words.forEach((word, index) => {
    // Only match entire words outside of HTML tags
    // http://stackoverflow.com/questions/26951003/javascript-replace-all-but-only-outside-html-tags
    let regEx = new RegExp("(\\b" + word + "\\b)(?!([^<]+)?>)", 'ig');
    $object.html($object.html().replace(regEx, (x) => {
      return `<span class='${spanClass}'>${x}</span>`;
    }));
  });
};
// Concatenate a string into an array of lowerccase words without punctuation
// Keeps - and '
let stringToWords = (string) => {
  return string
    .replace(/[^a-zA-Z0-9\'\-]+/g,' ')
    // .toLowerCase()
    .trim()
    .split(' ');
};
// Outputs a random value in [val1, val2) or [0 val1( with one argument
let randomValue = (val1, val2 = null) => {
  if (val2 === null) {
    val2 = val1;
    val1 = 0;
  }
  return Math.random() * (val2 - val1) + val1;
};
// Extracts unique values of the array
let uniqueValues = (array) => {
  return array.filter((v, i, a) => a.indexOf(v) === i);
};
// Turns an array of words into an array of all their letters with repetitions
let wordsToLetters = (words) => {
  let letters = [];
  words.forEach( (word) => {
    letters = letters.concat(word.split(''));
  });
  return letters;
};
// Input management functions
// ----------------------------------------------------------------------------
// Key handling
let onkey = (e, key, pressed) => {
  switch (key) {
    case KEY.LEFT:  player.input.left  = pressed; e.preventDefault(); break;
    case KEY.RIGHT: player.input.right = pressed; e.preventDefault(); break;
    case KEY.UP:    player.input.up    = pressed; e.preventDefault(); break;
    case KEY.DOWN:  player.input.down  = pressed; e.preventDefault(); break;
  }
};
// Game management (inspired by http://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/)
// ----------------------------------------------------------------------------
// All times in seconds
// Options object:
// step: The mechanics updating timestep (default: 1/60)
// slow: The slow motion scaling factor (default: 1)
// update: the mechanics update function (no default)
// render: the rendering function (no default)
let Game = {
  run: (options) => {
    const MAX_DT = 1;
    let last,
        dt       = 0,
        slow     = options.slow || 1,
        step     = 1/(options.fps || 60), // Fixed timestep
        slowStep = slow * step,
        update   = options.update,
        // The rendering (once per )
        render   = options.render;
    let frame = (now) => {
      if (!last) last = now;
      dt = dt + Math.min(MAX_DT, (now - last) / 1000);
      while (dt > slowStep) {
        dt = dt - slowStep;
        update(step);
      }
      render(dt/slow);
      last = now;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
};
// Calculate the centre of a jquery element
let calculateCentre = ($elt) => {
  let centre = $elt.offset();
  centre.left += $elt.width() / 2;
  centre.top += $elt.height() / 2;
  return centre;
};
// Collision detection between two jquery elements looking like circles
// Assumes equal width and height
let collideCircle = ($elt1, $elt2) => {
  return dist(calculateCentre($elt1), calculateCentre($elt2)) <
    ($elt1.width() / 2 + $elt2.width() / 2);
};
// Final scene
let playFinal = () => {
  $star.animate({'opacity': 0}, 1000, () => {
    $star.remove();
  });
  sounds.fullPoem.play();
};
// Star movement with drag according to http://stackoverflow.com/questions/667034/simple-physics-based-movement
let moveStar = (step) => {
  let starVelocity = $star.data('velocity');
  let starOffset = $star.offset();
  // Acceleration
  if (player.input.right) {
    starVelocity.x += DV * step;
  }
  if (player.input.left) {
    starVelocity.x -= DV * step;
  }
  if (player.input.down) {
    starVelocity.y += DV * step;
  }
  if (player.input.up) {
    starVelocity.y -= DV * step;
  }
  // FRICTION
  starVelocity.x -= FRICTION * step * starVelocity.x;
  starVelocity.y -= FRICTION * step * starVelocity.y;
  // Update the star position
  $star.data('velocity', starVelocity);
  starOffset.left += starVelocity.x * step;
  starOffset.top += starVelocity.y * step;
  // Boundary counditions
  starOffset.left = Math.min(Math.max(starOffset.left, 0),
  $(window).width() - $star.width());
  starOffset.top = Math.min(Math.max(starOffset.top, 0),
  $(window).height() - $star.height());
  $star.offset(starOffset);
};
// Rendering function
let render = (dt) => {
  return;
};
// Collision detection between the star and the planets
let starCollision = () => {
  planets.forEach( ($p) => {
    if (collideCircle($p, $star) && !isPlanetDestroyed) {
      destroyPlanet($p);
    }
  });
};
// Updating function
let update = (step) => {
  updatePlanets(step);
  moveStar(step);
  starCollision();
};
// Updating the planet according to its orbit
let updatePlanets = (step) => {
  planets.forEach(($p) => {
    let centre = $p.data('centre');
    let period = $p.data('period');
    let direction = $p.data('direction');
    orbitObject($p, centre, period/step, direction);
  });
};
// Event listeners
// ----------------------------------------------------------------------------
$(document)
  .keydown( (e) => {
    return onkey(e, e.key.toLowerCase(), true);
  })
  .keyup ( (e) => {
    return onkey(e, e.key.toLowerCase(), false);
  });
// Main execution
// ----------------------------------------------------------------------------
let main = () => {
  $(document).ready(() => {
    if (import.meta.env.DEV) {
      import('fps-indicator').then(mod => {
        createFps = mod.default;
        const fps = createFps({
          updatePeriod: 500
        });
        fps.element.style.color = 'darkgrey';
      });
    }
    // Divide the poem in verses
    $poem.html(versify(poem));
    // Create shooting star
    $star = $newObject({'top': $(document).height() / 2,
    'left': $(document).width() / 2},
    'star', '.poemContainer')
      .data('velocity', {'x': 0, 'y': 0})
      .css('visibility', 'hidden');
    deactivateStar();
    // Display the planets
    createPlanets(() => {
      $star.css('visibility', 'visible');
      activateStar();});
    // Run Game
    Game.run({update: update, render: render});
  });
};
loadAssets(main);

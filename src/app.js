/*
* Spinning words
* Author: Jean-Philippe Drecourt
*/

// Dependencies
// ----------------------------------------------------------------------------
const $ = require('jquery');
const createFps = require('fps-indicator'); // DEBUG

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

// Visualisation Functions
// ----------------------------------------------------------------------------

// Turns the poem array into divs with class 'verse'
let versify = (arrayOfStrings) => {
  return '<div class="verse">' +
    arrayOfStrings.reduce((prev, curr) => {
      return prev + '</div><div class="verse">' + curr;
    }) + '</div>';
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

// Create words at given coordinates
let $createFlyingWord = (offset, word, parent = 'body') => {
  return $newObject(offset, 'flyingWord', parent).text(word);
};

// Destroys the planet as a jquery object
let destroyPlanet = ($p) => {
  isPlanetDestroyed = true;
  $star.addClass('dim');
  let currentOffset = $p.offset();
  let $verse = $p.data('verse');
  let wordPositions = $p.data('positions');
  planets.splice(planets.indexOf($p), 1);
  $p.remove();
  wordPositions.forEach((data) => {
      let w = data.word;
      let pos = data.offset;
      let $flyingWord = $createFlyingWord(currentOffset, w, '.poemContainer');
      $flyingWord.animate(pos, 2000, () => {
        $flyingWord.remove();
        $verse.css('opacity', 1);
        isPlanetDestroyed = false;
        $star.removeClass('dim');
      });
    });
};

// Calculate the distance between two two jQuery coordinate object
let dist = (coord1, coord2) => {
  return Math.sqrt(Math.pow(coord1.left - coord2.left, 2) +
    Math.pow(coord1.top - coord2.top, 2));
};

// Calculate the max orbit radius according to current documents parameters
let maxRadius = () => {
  return Math.min($(document).width(), $(document).height()) * 0.8 / 2;
};

// Create a random HEX color (from CSS Tricks)
let randomColor = () => {
  return Math.floor(Math.random()*16777215).toString(16);
};

// Data processing functions
// ---------------------------------------------------------------------------

// Concatenate a string into an array of lowerccase words without punctuation
// Keeps - and '
let stringToWords = (string) => {
  return string
    .replace(/[^a-zA-Z0-9\'\-]+/g,' ')
    // .toLowerCase()
    .trim()
    .split(' ');
};

// Turns an array of words into an array of all their letters with repetitions
let wordsToLetters = (words) => {
  let letters = [];
  words.forEach( (word) => {
    letters = letters.concat(word.split(''));
  });
  return letters;
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

// Extracts unique values of the array
let uniqueValues = (array) => {
  return array.filter((v, i, a) => a.indexOf(v) === i);
};

// Outputs a random value in [val1, val2) or [0 val1( with one argument
let randomValue = (val1, val2 = 0) => {
  return val1 + Math.random() * (val2 - val1);
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

// Updating function
let update = (step) => {
  updatePlanets(step);
  moveStar(step);
  starCollision();
};

// Rendering function
let render = (dt) => {
  return;
};

let updatePlanets = (step) => {
  planets.forEach(($p) => {
    let centre = $p.data('centre');
    let period = $p.data('period');
    let direction = $p.data('direction');
    orbitObject($p, centre, period/step, direction);
  });
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

// Collision detection between the star and the planets
let starCollision = () => {
  let starOffset = $star.offset();
  planets.forEach( ($p) => {
    // FIXME Magic number + Proper collision
    if (dist(starOffset, $p.offset()) < 40 && !isPlanetDestroyed) {
      destroyPlanet($p);
    }
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


// Display the poem

$(document).ready(() => {
  // FPS indicator // DEBUG
  let fps = createFps({
    updatePeriod: 500
  });
  fps.element.style.color = 'darkgrey';

  // Divide the poem in verses
  $poem.html(versify(poem));

  // Get the dimensions of the poem
  let topLeftCorner = $poem.filter(':first').offset();
  let bottomRightCorner = $poem.filter(':last').offset();
  bottomRightCorner.left += $poem.filter(':last').width();
  bottomRightCorner.top += $poem.filter(':last').height();

  // Create one planet per verse
  $('.verse').each((i, d) => {
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
    verseLetters.forEach( (l) => {
      let $l = $(`<span class='letter'>${l}</span>`);
      $thisPlanet.append($l);
      $l.offset({
        left: randomValue($thisPlanet.width()) + $thisPlanet.offset().left,
        top: randomValue($thisPlanet.height()) + $thisPlanet.offset().top
      });
    });
//    $thisPlanet.css('background', '#' + randomColor());
    $thisPlanet.data({
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
  });

  // Create shooting star
  // FIXME Magic number
  $star = $newObject({'top': 100, 'left': 100}, 'star', '.poemContainer');
  $star.data('velocity', {'x': 0, 'y': 0});

  // Run Game
  Game.run({update: update, render: render});

});

/*
* Spinning words
* Author: Jean-Philippe Drecourt
*/

// Dependencies
// ----------------------------------------------------------------------------
let $ = require('jquery');

// Data
// ----------------------------------------------------------------------------
// Poem as a set of strings
import {poem} from './data';

// DOM elements
// ----------------------------------------------------------------------------
let $poem = $('#poem');

// Global variables
// ----------------------------------------------------------------------------
// Positions of the various words in the poem
let wordPositions = {};
// Spinning planets
let planets = [];
// Animation variables
let previousStep = null; // Previous time step

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
  planets.splice(planets.indexOf($p), 1);
  $p.remove();
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

// Calculate the epicentre of all the words
let calculateOrbitCentre = ($p) => {
  let centre = {'left': 0, 'top': 0}, count = 0;
  $p.data('words').forEach((w) => {
      wordPositions[w].forEach((offset) => {
          count++;
          centre.left += offset.left;
          centre.top += offset.top;
      });
  });
  centre.left = centre.left / count;
  centre.top = centre.top / count;
  return centre;
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

// Main execution
// ----------------------------------------------------------------------------
// Display the poem

$(document).ready(() => {
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
    // Extract the words position
    spanify($(d), verseWords, `verse${i}`);
    let wordPositions = spannifiedPositions(`verse${i}`);
    // Create a new planet
    let offset = {
      'top': $(document).height() / 2 + randomValue(-maxRadius(), maxRadius()),
      'left': $(document).width() / 2 + randomValue(-maxRadius(), maxRadius())
    };
    let $thisPlanet = $newObject(offset, 'planet', '.poemContainer');
    $thisPlanet.css('background', '#' + randomColor());
    $thisPlanet.data({
      'verse': $(d),
      'words': verseWords,
      'positions': wordPositions,
      'centre': {
        'top': $(document).height() / 2,
        'left': $(document).width() / 2
      },
      'direction': Math.floor(Math.random() * 2) * 2 - 1,
      'period': randomValue(5000, 9000)
    });
    // Destruction on hover
    $thisPlanet.hover(() => {
      let currentOffset = $thisPlanet.offset();
      let $verse = $thisPlanet.data('verse');
      destroyPlanet($thisPlanet);
      wordPositions.forEach((data) => {
          let w = data.word;
          let pos = data.offset;
          let $flyingWord = $createFlyingWord(currentOffset, w, '.poemContainer');
          $flyingWord.animate(pos, 2000, () => {
            $flyingWord.remove();
            $verse.css('opacity', 1);
          });
        });
    });
    planets.push($thisPlanet);
  });

  // Display loop
  //-----------------------------------------------------------------------------
  let displayLoop = (timestamp) => {
    if (!previousStep) previousStep = timestamp;
    let progress = timestamp - previousStep;
    planets.forEach(($p) => {
      let centre = $p.data('centre');
      let period = $p.data('period');
      let direction = $p.data('direction');
      orbitObject($p, centre, period/progress, direction);
    });
    previousStep = timestamp;
    window.requestAnimationFrame(displayLoop);
  };
  window.requestAnimationFrame(displayLoop);
  //-----------------------------------------------------------------------------
});


// Update word positions on resize
$( window ).resize( () => {
  wordPositions = eltPosition(words);
});

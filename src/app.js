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
// Spinning worlds
let worlds = [];
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

// Create a new moving object with a given initial position as an offset
// and a class name. Returns a jQuery object
let $newObject = (offset, objectClass='', parent='body') => {
  let $object = $('<div></div>').appendTo(parent);
  $object.addClass(objectClass);
  $object.offset(offset);
  return $object;
};

// Make the object orbit around a point as an jQuery coordinate object from its current position at a given orbital speed in frames
let orbitObject = ($object, centre, speed) => {
  let dTheta = 2 * Math.PI / speed,
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

// Destroys the world as a jquery object
let destroy = ($w) => {
  $w.css({
    'background': 'black',
    'border': 'solid white 3px'
  });
};

// Calculate the distance between two two jQuery coordinate object
let dist = (coord1, coord2) => {
  return Math.sqrt(Math.pow(coord1.left - coord2.left, 2) +
    Math.pow(coord1.top - coord2.top, 2));
};

// Data processing functions
// ---------------------------------------------------------------------------

// Concatenate a string into an array of lowerccase words without punctuation
// Keeps - and '
let stringToWords = (string) => {
  return string
    .replace(/[^a-zA-Z0-9\'\-]+/g,' ')
    .toLowerCase()
    .trim()
    .split(' ');
};

// Crawls the jquery $object and creates a span around each word of the word
// list. The span gets two classes [spanClass] and [spanClass]_[i] with i the
// index of the given word
let spanify = ($object, words, spanClass='word') => {
  // let sortedWords = sortPerLength(words);
  words.forEach((word, index) => {
    // Only match entire words outside of HTML tags
    // http://stackoverflow.com/questions/26951003/javascript-replace-all-but-only-outside-html-tags
    let regEx = new RegExp("(\\b" + word + "\\b)(?!([^<]+)?>)", 'ig');
    $object.html($object.html().replace(regEx, (x) => {
      return `<span class='${spanClass} word_${index}'>${x}</span>`;
    }));
  });
};

// Extracts unique values of the array
let uniqueValues = (array) => {
  return array.filter((v, i, a) => a.indexOf(v) === i);
};

// Create a list of the position of elements created by spannify
let eltPosition = (words, eltClass='word') => {
  let positions = {};
  words.forEach((word, index) => {
    $(`.${eltClass}.${eltClass}_${index}`).each( (i, domObject) => {
      if (positions.hasOwnProperty(words[index])) {
        positions[words[index]].push($(domObject).offset());
      } else {
        positions[words[index]] = [$(domObject).offset()];
      }
    });
  });
  return positions;
};

// Main execution
// ----------------------------------------------------------------------------
// Display the poem

$poem.html(versify(poem));

// Identify the position of the words
let words = [];
poem.forEach((verse) => {
  words = words.concat(stringToWords(verse));
});
words = uniqueValues(words);
spanify($poem, words);
wordPositions = eltPosition(words);

// TODO: Generalise
// ----------------------------------------------------------------------------
// jshint -W069
let center = wordPositions['upon'][0];
worlds.push($newObject({'top': 200, 'left': 200}, 'world', '.poemContainer'));
worlds.push($newObject({'top': 400, 'left': 400}, 'world', '.poemContainer'));
worlds[1].css({
  'background': 'green',
});
// Destruction on hover
worlds.forEach(($w) => {
  let that = $w;
  $w.hover(() => {
    destroy(that);
  });
});
// jshint +W069
//-----------------------------------------------------------------------------

// Display loop
//-----------------------------------------------------------------------------
let stepOrbit = (timestamp) => {
  if (!previousStep) previousStep = timestamp;
  let period = 5000; // TODO: Generalise
  let progress = timestamp - previousStep;
  worlds.forEach(($w, index) => {
    orbitObject($w, center, period/progress);
  });
  previousStep = timestamp;
  window.requestAnimationFrame(stepOrbit);
};
window.requestAnimationFrame(stepOrbit);
//-----------------------------------------------------------------------------


// Update word positions on resize
$( window ).resize( () => {
  wordPositions = eltPosition(words);
});

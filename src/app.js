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

// Create words at given coordinates
let $createFlyingWord = (offset, word, parent) => {
  return $newObject(offset, 'flyingWord').text(word);
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

$(document).ready(() => {
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
  planets.push($newObject({'top': 200, 'left': 200}, 'planet', '.poemContainer').data('words', ['upon', 'best']));
  planets.push($newObject({'top': 400, 'left': 400}, 'planet', '.poemContainer').data('words', ['a']));
  planets[1].css({
    'background': 'green',
  });
  // Destruction on hover
  planets.forEach(($p) => {
    let that = $p;
    $p.hover(() => {
      let offset = that.offset();
      let words = that.data('words');
      destroyPlanet(that);
      words.forEach((w) => {
        wordPositions[w].forEach((pos) => {
          let $flyingWord = $createFlyingWord(offset, w);
          $flyingWord.animate(pos, 2000, () => {
            return;
          });

        });
      });
    });
  });
  // jshint +W069
  //-----------------------------------------------------------------------------

  // Display loop
  //-----------------------------------------------------------------------------
  let displayLoop = (timestamp) => {
    if (!previousStep) previousStep = timestamp;
    let period = 5000; // TODO: Generalise
    let progress = timestamp - previousStep;
    planets.forEach(($p) => {
      let centre = calculateOrbitCentre($p);
      orbitObject($p, centre, period/progress);
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

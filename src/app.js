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


// Visualisation Functions
// ----------------------------------------------------------------------------

// Display HTML into a container with a given Id
let htmlToId = (divId, html) => {
  $('#' + divId).html(html);
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

// Concatenate a string into an array of lowerccase words without punctuation
// Keeps - and '
let stringToWords = (string) => {
  return string
    .replace(/[^a-zA-Z0-9\'\-]+/g,' ')
    .toLowerCase()
    .trim()
    .split(' ');
};

htmlToId('poem', versify(poem));

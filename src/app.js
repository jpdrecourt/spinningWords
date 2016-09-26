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

// Visualisation Functions
// ----------------------------------------------------------------------------

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

// Crawls the jquery $object and creates a span around each word of the word
// list. The span gets a class word_index
let spanify = ($object, words) => {
  words.forEach((word, index) => {
    let regEx = new RegExp(word, 'ig');
    $object.html().replace(regEx, (x) => {
      return `<span class='word_${index}>${x}</span>`;
    });
  });
};

// Extracts unique values of the array
let uniqueValues = (array) => {
  return array.filter((v, i, a) => a.indexOf(v) === i);
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
console.log(words);
spanify($poem, words);

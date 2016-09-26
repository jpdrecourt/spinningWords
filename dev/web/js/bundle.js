(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _data = require('./data');

/*
* Spinning words
* Author: Jean-Philippe Drecourt
*/

// Dependencies
// ----------------------------------------------------------------------------
var $ = require('jquery');

// Data
// ----------------------------------------------------------------------------
// Poem as a set of strings


// DOM elements
// ----------------------------------------------------------------------------
var $poem = $('#poem');

// Global variables
// ----------------------------------------------------------------------------
// Positions of the various words in the poem
var wordPositions = {};

// Visualisation Functions
// ----------------------------------------------------------------------------

// Turns the poem array into divs with class 'verse'
var versify = function versify(arrayOfStrings) {
  return '<div class="verse">' + arrayOfStrings.reduce(function (prev, curr) {
    return prev + '</div><div class="verse">' + curr;
  }) + '</div>';
};

// Data processing functions
// ---------------------------------------------------------------------------

// Concatenate a string into an array of lowerccase words without punctuation
// Keeps - and '
var stringToWords = function stringToWords(string) {
  return string.replace(/[^a-zA-Z0-9\'\-]+/g, ' ').toLowerCase().trim().split(' ');
};

// Crawls the jquery $object and creates a span around each word of the word
// list. The span gets two classes [spanClass] and [spanClass]_[i] with i the
// index of the given word
var spanify = function spanify($object, words) {
  var spanClass = arguments.length <= 2 || arguments[2] === undefined ? 'word' : arguments[2];

  // let sortedWords = sortPerLength(words);
  words.forEach(function (word, index) {
    // Only match entire words outside of HTML tags
    // http://stackoverflow.com/questions/26951003/javascript-replace-all-but-only-outside-html-tags
    var regEx = new RegExp("(\\b" + word + "\\b)(?!([^<]+)?>)", 'ig');
    $object.html($object.html().replace(regEx, function (x) {
      return '<span class=\'' + spanClass + ' word_' + index + '\'>' + x + '</span>';
    }));
  });
};

// Extracts unique values of the array
var uniqueValues = function uniqueValues(array) {
  return array.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
};

// Create a list of the position of elements created by spannify
var eltPosition = function eltPosition(words) {
  var eltClass = arguments.length <= 1 || arguments[1] === undefined ? 'word' : arguments[1];

  var positions = {};
  words.forEach(function (word, index) {
    $('.' + eltClass + '.' + eltClass + '_' + index).each(function (i, domObject) {
      if (positions.hasOwnProperty(words[index])) {
        positions[words[index]].push($(domObject).offset());
      } else {
        positions[words[index]] = [$(domObject).offset()];
      }
    });
  });
  console.log(positions);
  return positions;
};

// Main execution
// ----------------------------------------------------------------------------

// Display the poem
$poem.html(versify(_data.poem));

// Identify the position of the words
var words = [];
_data.poem.forEach(function (verse) {
  words = words.concat(stringToWords(verse));
});
words = uniqueValues(words);
spanify($poem, words);
wordPositions = eltPosition(words);

// Update word positions on resize
$(window).resize(function () {
  wordPositions = eltPosition(words);
});

},{"./data":2,"jquery":"jquery"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var poem = exports.poem = ["The bed we loved in was a spinning world", "of forests, castles, torchlight, cliff-tops, seas", "where he would dive for pearls. My lover's words", "were shooting stars which fell to earth as kisses", "on these lips; my body now a softer rhyme", "to his, now echo, assonance; his touch", "a verb dancing in the centre of a noun.", "Some nights I dreamed he'd written me, the bed", "a page beneath his writer's hands. Romance", "and drama played by touch, by scent, by taste.", "In the other bed, the best, our guests dozed on,", "dribbling their prose. My living laughing love – ", "I hold him in the casket of my widow's head", "as he held me upon that next best bed."];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2RhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ1lBOztBQVpBOzs7OztBQUtBO0FBQ0E7QUFDQSxJQUFJLElBQUksUUFBUSxRQUFSLENBQVI7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsSUFBSSxRQUFRLEVBQUUsT0FBRixDQUFaOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQWdCLEVBQXBCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsY0FBRCxFQUFvQjtBQUNoQyxTQUFPLHdCQUNMLGVBQWUsTUFBZixDQUFzQixVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWdCO0FBQ3BDLFdBQU8sT0FBTywyQkFBUCxHQUFxQyxJQUE1QztBQUNELEdBRkQsQ0FESyxHQUdBLFFBSFA7QUFJRCxDQUxEOztBQU9BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksZ0JBQWdCLFNBQWhCLGFBQWdCLENBQUMsTUFBRCxFQUFZO0FBQzlCLFNBQU8sT0FDSixPQURJLENBQ0ksb0JBREosRUFDeUIsR0FEekIsRUFFSixXQUZJLEdBR0osSUFISSxHQUlKLEtBSkksQ0FJRSxHQUpGLENBQVA7QUFLRCxDQU5EOztBQVFBO0FBQ0E7QUFDQTtBQUNBLElBQUksVUFBVSxTQUFWLE9BQVUsQ0FBQyxPQUFELEVBQVUsS0FBVixFQUFzQztBQUFBLE1BQXJCLFNBQXFCLHlEQUFYLE1BQVc7O0FBQ2xEO0FBQ0EsUUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFpQjtBQUM3QjtBQUNBO0FBQ0EsUUFBSSxRQUFRLElBQUksTUFBSixDQUFXLFNBQVMsSUFBVCxHQUFnQixtQkFBM0IsRUFBZ0QsSUFBaEQsQ0FBWjtBQUNBLFlBQVEsSUFBUixDQUFhLFFBQVEsSUFBUixHQUFlLE9BQWYsQ0FBdUIsS0FBdkIsRUFBOEIsVUFBQyxDQUFELEVBQU87QUFDaEQsZ0NBQXVCLFNBQXZCLGNBQXlDLEtBQXpDLFdBQW1ELENBQW5EO0FBQ0QsS0FGWSxDQUFiO0FBR0QsR0FQRDtBQVFELENBVkQ7O0FBWUE7QUFDQSxJQUFJLGVBQWUsU0FBZixZQUFlLENBQUMsS0FBRCxFQUFXO0FBQzVCLFNBQU8sTUFBTSxNQUFOLENBQWEsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFBQSxXQUFhLEVBQUUsT0FBRixDQUFVLENBQVYsTUFBaUIsQ0FBOUI7QUFBQSxHQUFiLENBQVA7QUFDRCxDQUZEOztBQUlBO0FBQ0EsSUFBSSxjQUFjLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFBNEI7QUFBQSxNQUFwQixRQUFvQix5REFBWCxNQUFXOztBQUM1QyxNQUFJLFlBQVksRUFBaEI7QUFDQSxRQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWlCO0FBQzdCLFlBQU0sUUFBTixTQUFrQixRQUFsQixTQUE4QixLQUE5QixFQUF1QyxJQUF2QyxDQUE2QyxVQUFDLENBQUQsRUFBSSxTQUFKLEVBQWtCO0FBQzdELFVBQUksVUFBVSxjQUFWLENBQXlCLE1BQU0sS0FBTixDQUF6QixDQUFKLEVBQTRDO0FBQzFDLGtCQUFVLE1BQU0sS0FBTixDQUFWLEVBQXdCLElBQXhCLENBQTZCLEVBQUUsU0FBRixFQUFhLE1BQWIsRUFBN0I7QUFDRCxPQUZELE1BRU87QUFDTCxrQkFBVSxNQUFNLEtBQU4sQ0FBVixJQUEwQixDQUFDLEVBQUUsU0FBRixFQUFhLE1BQWIsRUFBRCxDQUExQjtBQUNEO0FBQ0YsS0FORDtBQU9ELEdBUkQ7QUFTQSxVQUFRLEdBQVIsQ0FBWSxTQUFaO0FBQ0EsU0FBTyxTQUFQO0FBQ0QsQ0FiRDs7QUFlQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxJQUFOLENBQVcsbUJBQVg7O0FBRUE7QUFDQSxJQUFJLFFBQVEsRUFBWjtBQUNBLFdBQUssT0FBTCxDQUFhLFVBQUMsS0FBRCxFQUFXO0FBQ3RCLFVBQVEsTUFBTSxNQUFOLENBQWEsY0FBYyxLQUFkLENBQWIsQ0FBUjtBQUNELENBRkQ7QUFHQSxRQUFRLGFBQWEsS0FBYixDQUFSO0FBQ0EsUUFBUSxLQUFSLEVBQWUsS0FBZjtBQUNBLGdCQUFnQixZQUFZLEtBQVosQ0FBaEI7O0FBRUE7QUFDQSxFQUFHLE1BQUgsRUFBWSxNQUFaLENBQW9CLFlBQU07QUFDeEIsa0JBQWdCLFlBQVksS0FBWixDQUFoQjtBQUNELENBRkQ7Ozs7Ozs7O0FDbkdPLElBQU0sc0JBQU8sQ0FDbEIsMENBRGtCLEVBRWxCLG1EQUZrQixFQUdsQixrREFIa0IsRUFJbEIsbURBSmtCLEVBS2xCLDJDQUxrQixFQU1sQix3Q0FOa0IsRUFPbEIseUNBUGtCLEVBUWxCLGdEQVJrQixFQVNsQiw0Q0FUa0IsRUFVbEIsZ0RBVmtCLEVBV2xCLGtEQVhrQixFQVlsQixtREFaa0IsRUFhbEIsNkNBYmtCLEVBY2xCLHdDQWRrQixDQUFiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4qIFNwaW5uaW5nIHdvcmRzXG4qIEF1dGhvcjogSmVhbi1QaGlsaXBwZSBEcmVjb3VydFxuKi9cblxuLy8gRGVwZW5kZW5jaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5sZXQgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4vLyBEYXRhXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQb2VtIGFzIGEgc2V0IG9mIHN0cmluZ3NcbmltcG9ydCB7cG9lbX0gZnJvbSAnLi9kYXRhJztcblxuLy8gRE9NIGVsZW1lbnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5sZXQgJHBvZW0gPSAkKCcjcG9lbScpO1xuXG4vLyBHbG9iYWwgdmFyaWFibGVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQb3NpdGlvbnMgb2YgdGhlIHZhcmlvdXMgd29yZHMgaW4gdGhlIHBvZW1cbmxldCB3b3JkUG9zaXRpb25zID0ge307XG5cbi8vIFZpc3VhbGlzYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFR1cm5zIHRoZSBwb2VtIGFycmF5IGludG8gZGl2cyB3aXRoIGNsYXNzICd2ZXJzZSdcbmxldCB2ZXJzaWZ5ID0gKGFycmF5T2ZTdHJpbmdzKSA9PiB7XG4gIHJldHVybiAnPGRpdiBjbGFzcz1cInZlcnNlXCI+JyArXG4gICAgYXJyYXlPZlN0cmluZ3MucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICByZXR1cm4gcHJldiArICc8L2Rpdj48ZGl2IGNsYXNzPVwidmVyc2VcIj4nICsgY3VycjtcbiAgICB9KSArICc8L2Rpdj4nO1xufTtcblxuLy8gRGF0YSBwcm9jZXNzaW5nIGZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIENvbmNhdGVuYXRlIGEgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgbG93ZXJjY2FzZSB3b3JkcyB3aXRob3V0IHB1bmN0dWF0aW9uXG4vLyBLZWVwcyAtIGFuZCAnXG5sZXQgc3RyaW5nVG9Xb3JkcyA9IChzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHN0cmluZ1xuICAgIC5yZXBsYWNlKC9bXmEtekEtWjAtOVxcJ1xcLV0rL2csJyAnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnICcpO1xufTtcblxuLy8gQ3Jhd2xzIHRoZSBqcXVlcnkgJG9iamVjdCBhbmQgY3JlYXRlcyBhIHNwYW4gYXJvdW5kIGVhY2ggd29yZCBvZiB0aGUgd29yZFxuLy8gbGlzdC4gVGhlIHNwYW4gZ2V0cyB0d28gY2xhc3NlcyBbc3BhbkNsYXNzXSBhbmQgW3NwYW5DbGFzc11fW2ldIHdpdGggaSB0aGVcbi8vIGluZGV4IG9mIHRoZSBnaXZlbiB3b3JkXG5sZXQgc3BhbmlmeSA9ICgkb2JqZWN0LCB3b3Jkcywgc3BhbkNsYXNzPSd3b3JkJykgPT4ge1xuICAvLyBsZXQgc29ydGVkV29yZHMgPSBzb3J0UGVyTGVuZ3RoKHdvcmRzKTtcbiAgd29yZHMuZm9yRWFjaCgod29yZCwgaW5kZXgpID0+IHtcbiAgICAvLyBPbmx5IG1hdGNoIGVudGlyZSB3b3JkcyBvdXRzaWRlIG9mIEhUTUwgdGFnc1xuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjY5NTEwMDMvamF2YXNjcmlwdC1yZXBsYWNlLWFsbC1idXQtb25seS1vdXRzaWRlLWh0bWwtdGFnc1xuICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoXCIoXFxcXGJcIiArIHdvcmQgKyBcIlxcXFxiKSg/IShbXjxdKyk/PilcIiwgJ2lnJyk7XG4gICAgJG9iamVjdC5odG1sKCRvYmplY3QuaHRtbCgpLnJlcGxhY2UocmVnRXgsICh4KSA9PiB7XG4gICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPScke3NwYW5DbGFzc30gd29yZF8ke2luZGV4fSc+JHt4fTwvc3Bhbj5gO1xuICAgIH0pKTtcbiAgfSk7XG59O1xuXG4vLyBFeHRyYWN0cyB1bmlxdWUgdmFsdWVzIG9mIHRoZSBhcnJheVxubGV0IHVuaXF1ZVZhbHVlcyA9IChhcnJheSkgPT4ge1xuICByZXR1cm4gYXJyYXkuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpO1xufTtcblxuLy8gQ3JlYXRlIGEgbGlzdCBvZiB0aGUgcG9zaXRpb24gb2YgZWxlbWVudHMgY3JlYXRlZCBieSBzcGFubmlmeVxubGV0IGVsdFBvc2l0aW9uID0gKHdvcmRzLCBlbHRDbGFzcz0nd29yZCcpID0+IHtcbiAgbGV0IHBvc2l0aW9ucyA9IHt9O1xuICB3b3Jkcy5mb3JFYWNoKCh3b3JkLCBpbmRleCkgPT4ge1xuICAgICQoYC4ke2VsdENsYXNzfS4ke2VsdENsYXNzfV8ke2luZGV4fWApLmVhY2goIChpLCBkb21PYmplY3QpID0+IHtcbiAgICAgIGlmIChwb3NpdGlvbnMuaGFzT3duUHJvcGVydHkod29yZHNbaW5kZXhdKSkge1xuICAgICAgICBwb3NpdGlvbnNbd29yZHNbaW5kZXhdXS5wdXNoKCQoZG9tT2JqZWN0KS5vZmZzZXQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3NpdGlvbnNbd29yZHNbaW5kZXhdXSA9IFskKGRvbU9iamVjdCkub2Zmc2V0KCldO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgY29uc29sZS5sb2cocG9zaXRpb25zKTtcbiAgcmV0dXJuIHBvc2l0aW9ucztcbn07XG5cbi8vIE1haW4gZXhlY3V0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIERpc3BsYXkgdGhlIHBvZW1cbiRwb2VtLmh0bWwodmVyc2lmeShwb2VtKSk7XG5cbi8vIElkZW50aWZ5IHRoZSBwb3NpdGlvbiBvZiB0aGUgd29yZHNcbmxldCB3b3JkcyA9IFtdO1xucG9lbS5mb3JFYWNoKCh2ZXJzZSkgPT4ge1xuICB3b3JkcyA9IHdvcmRzLmNvbmNhdChzdHJpbmdUb1dvcmRzKHZlcnNlKSk7XG59KTtcbndvcmRzID0gdW5pcXVlVmFsdWVzKHdvcmRzKTtcbnNwYW5pZnkoJHBvZW0sIHdvcmRzKTtcbndvcmRQb3NpdGlvbnMgPSBlbHRQb3NpdGlvbih3b3Jkcyk7XG5cbi8vIFVwZGF0ZSB3b3JkIHBvc2l0aW9ucyBvbiByZXNpemVcbiQoIHdpbmRvdyApLnJlc2l6ZSggKCkgPT4ge1xuICB3b3JkUG9zaXRpb25zID0gZWx0UG9zaXRpb24od29yZHMpO1xufSk7XG4iLCJleHBvcnQgY29uc3QgcG9lbSA9IFtcbiAgXCJUaGUgYmVkIHdlIGxvdmVkIGluIHdhcyBhIHNwaW5uaW5nIHdvcmxkXCIsXG4gIFwib2YgZm9yZXN0cywgY2FzdGxlcywgdG9yY2hsaWdodCwgY2xpZmYtdG9wcywgc2Vhc1wiLFxuICBcIndoZXJlIGhlIHdvdWxkIGRpdmUgZm9yIHBlYXJscy4gTXkgbG92ZXIncyB3b3Jkc1wiLFxuICBcIndlcmUgc2hvb3Rpbmcgc3RhcnMgd2hpY2ggZmVsbCB0byBlYXJ0aCBhcyBraXNzZXNcIixcbiAgXCJvbiB0aGVzZSBsaXBzOyBteSBib2R5IG5vdyBhIHNvZnRlciByaHltZVwiLFxuICBcInRvIGhpcywgbm93IGVjaG8sIGFzc29uYW5jZTsgaGlzIHRvdWNoXCIsXG4gIFwiYSB2ZXJiIGRhbmNpbmcgaW4gdGhlIGNlbnRyZSBvZiBhIG5vdW4uXCIsXG4gIFwiU29tZSBuaWdodHMgSSBkcmVhbWVkIGhlJ2Qgd3JpdHRlbiBtZSwgdGhlIGJlZFwiLFxuICBcImEgcGFnZSBiZW5lYXRoIGhpcyB3cml0ZXIncyBoYW5kcy4gUm9tYW5jZVwiLFxuICBcImFuZCBkcmFtYSBwbGF5ZWQgYnkgdG91Y2gsIGJ5IHNjZW50LCBieSB0YXN0ZS5cIixcbiAgXCJJbiB0aGUgb3RoZXIgYmVkLCB0aGUgYmVzdCwgb3VyIGd1ZXN0cyBkb3plZCBvbixcIixcbiAgXCJkcmliYmxpbmcgdGhlaXIgcHJvc2UuIE15IGxpdmluZyBsYXVnaGluZyBsb3ZlIOKAkyBcIixcbiAgXCJJIGhvbGQgaGltIGluIHRoZSBjYXNrZXQgb2YgbXkgd2lkb3cncyBoZWFkXCIsXG4gIFwiYXMgaGUgaGVsZCBtZSB1cG9uIHRoYXQgbmV4dCBiZXN0IGJlZC5cIlxuXTtcbiJdfQ==

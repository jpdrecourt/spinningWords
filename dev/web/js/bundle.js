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
// list. The span gets a class word_index
var spanify = function spanify($object, words) {
  words.forEach(function (word, index) {
    var regEx = new RegExp(word, 'ig');
    $object.html().replace(regEx, function (x) {
      return '<span class=\'word_' + index + '>' + x + '</span>';
    });
  });
};

// Extracts unique values of the array
var uniqueValues = function uniqueValues(array) {
  return array.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
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
console.log(words);
spanify($poem, words);

},{"./data":2,"jquery":"jquery"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var poem = exports.poem = ["The bed we loved in was a spinning world", "of forests, castles, torchlight, cliff-tops, seas", "where he would dive for pearls. My lover's words", "were shooting stars which fell to earth as kisses", "on these lips; my body now a softer rhyme", "to his, now echo, assonance; his touch", "a verb dancing in the centre of a noun.", "Some nights I dreamed he'd written me, the bed", "a page beneath his writer's hands. Romance", "and drama played by touch, by scent, by taste.", "In the other bed, the best, our guests dozed on,", "dribbling their prose. My living laughing love – ", "I hold him in the casket of my widow's head", "as he held me upon that next best bed."];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2RhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ1lBOztBQVpBOzs7OztBQUtBO0FBQ0E7QUFDQSxJQUFJLElBQUksUUFBUSxRQUFSLENBQVI7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsSUFBSSxRQUFRLEVBQUUsT0FBRixDQUFaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsY0FBRCxFQUFvQjtBQUNoQyxTQUFPLHdCQUNMLGVBQWUsTUFBZixDQUFzQixVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWdCO0FBQ3BDLFdBQU8sT0FBTywyQkFBUCxHQUFxQyxJQUE1QztBQUNELEdBRkQsQ0FESyxHQUdBLFFBSFA7QUFJRCxDQUxEOztBQU9BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksZ0JBQWdCLFNBQWhCLGFBQWdCLENBQUMsTUFBRCxFQUFZO0FBQzlCLFNBQU8sT0FDSixPQURJLENBQ0ksb0JBREosRUFDeUIsR0FEekIsRUFFSixXQUZJLEdBR0osSUFISSxHQUlKLEtBSkksQ0FJRSxHQUpGLENBQVA7QUFLRCxDQU5EOztBQVFBO0FBQ0E7QUFDQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDaEMsUUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFpQjtBQUM3QixRQUFJLFFBQVEsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFpQixJQUFqQixDQUFaO0FBQ0EsWUFBUSxJQUFSLEdBQWUsT0FBZixDQUF1QixLQUF2QixFQUE4QixVQUFDLENBQUQsRUFBTztBQUNuQyxxQ0FBNEIsS0FBNUIsU0FBcUMsQ0FBckM7QUFDRCxLQUZEO0FBR0QsR0FMRDtBQU1ELENBUEQ7O0FBU0E7QUFDQSxJQUFJLGVBQWUsU0FBZixZQUFlLENBQUMsS0FBRCxFQUFXO0FBQzVCLFNBQU8sTUFBTSxNQUFOLENBQWEsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFBQSxXQUFhLEVBQUUsT0FBRixDQUFVLENBQVYsTUFBaUIsQ0FBOUI7QUFBQSxHQUFiLENBQVA7QUFDRCxDQUZEOztBQUlBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLElBQU4sQ0FBVyxtQkFBWDs7QUFFQTtBQUNBLElBQUksUUFBUSxFQUFaO0FBQ0EsV0FBSyxPQUFMLENBQWEsVUFBQyxLQUFELEVBQVc7QUFDdEIsVUFBUSxNQUFNLE1BQU4sQ0FBYSxjQUFjLEtBQWQsQ0FBYixDQUFSO0FBQ0QsQ0FGRDtBQUdBLFFBQVEsYUFBYSxLQUFiLENBQVI7QUFDQSxRQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsUUFBUSxLQUFSLEVBQWUsS0FBZjs7Ozs7Ozs7QUN2RU8sSUFBTSxzQkFBTyxDQUNsQiwwQ0FEa0IsRUFFbEIsbURBRmtCLEVBR2xCLGtEQUhrQixFQUlsQixtREFKa0IsRUFLbEIsMkNBTGtCLEVBTWxCLHdDQU5rQixFQU9sQix5Q0FQa0IsRUFRbEIsZ0RBUmtCLEVBU2xCLDRDQVRrQixFQVVsQixnREFWa0IsRUFXbEIsa0RBWGtCLEVBWWxCLG1EQVprQixFQWFsQiw2Q0Fia0IsRUFjbEIsd0NBZGtCLENBQWIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiogU3Bpbm5pbmcgd29yZHNcbiogQXV0aG9yOiBKZWFuLVBoaWxpcHBlIERyZWNvdXJ0XG4qL1xuXG4vLyBEZXBlbmRlbmNpZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmxldCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbi8vIERhdGFcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBvZW0gYXMgYSBzZXQgb2Ygc3RyaW5nc1xuaW1wb3J0IHtwb2VtfSBmcm9tICcuL2RhdGEnO1xuXG4vLyBET00gZWxlbWVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmxldCAkcG9lbSA9ICQoJyNwb2VtJyk7XG5cbi8vIFZpc3VhbGlzYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFR1cm5zIHRoZSBwb2VtIGFycmF5IGludG8gZGl2cyB3aXRoIGNsYXNzICd2ZXJzZSdcbmxldCB2ZXJzaWZ5ID0gKGFycmF5T2ZTdHJpbmdzKSA9PiB7XG4gIHJldHVybiAnPGRpdiBjbGFzcz1cInZlcnNlXCI+JyArXG4gICAgYXJyYXlPZlN0cmluZ3MucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICByZXR1cm4gcHJldiArICc8L2Rpdj48ZGl2IGNsYXNzPVwidmVyc2VcIj4nICsgY3VycjtcbiAgICB9KSArICc8L2Rpdj4nO1xufTtcblxuLy8gRGF0YSBwcm9jZXNzaW5nIGZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIENvbmNhdGVuYXRlIGEgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgbG93ZXJjY2FzZSB3b3JkcyB3aXRob3V0IHB1bmN0dWF0aW9uXG4vLyBLZWVwcyAtIGFuZCAnXG5sZXQgc3RyaW5nVG9Xb3JkcyA9IChzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHN0cmluZ1xuICAgIC5yZXBsYWNlKC9bXmEtekEtWjAtOVxcJ1xcLV0rL2csJyAnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnICcpO1xufTtcblxuLy8gQ3Jhd2xzIHRoZSBqcXVlcnkgJG9iamVjdCBhbmQgY3JlYXRlcyBhIHNwYW4gYXJvdW5kIGVhY2ggd29yZCBvZiB0aGUgd29yZFxuLy8gbGlzdC4gVGhlIHNwYW4gZ2V0cyBhIGNsYXNzIHdvcmRfaW5kZXhcbmxldCBzcGFuaWZ5ID0gKCRvYmplY3QsIHdvcmRzKSA9PiB7XG4gIHdvcmRzLmZvckVhY2goKHdvcmQsIGluZGV4KSA9PiB7XG4gICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cCh3b3JkLCAnaWcnKTtcbiAgICAkb2JqZWN0Lmh0bWwoKS5yZXBsYWNlKHJlZ0V4LCAoeCkgPT4ge1xuICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz0nd29yZF8ke2luZGV4fT4ke3h9PC9zcGFuPmA7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLy8gRXh0cmFjdHMgdW5pcXVlIHZhbHVlcyBvZiB0aGUgYXJyYXlcbmxldCB1bmlxdWVWYWx1ZXMgPSAoYXJyYXkpID0+IHtcbiAgcmV0dXJuIGFycmF5LmZpbHRlcigodiwgaSwgYSkgPT4gYS5pbmRleE9mKHYpID09PSBpKTtcbn07XG5cbi8vIE1haW4gZXhlY3V0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIERpc3BsYXkgdGhlIHBvZW1cbiRwb2VtLmh0bWwodmVyc2lmeShwb2VtKSk7XG5cbi8vIElkZW50aWZ5IHRoZSBwb3NpdGlvbiBvZiB0aGUgd29yZHNcbmxldCB3b3JkcyA9IFtdO1xucG9lbS5mb3JFYWNoKCh2ZXJzZSkgPT4ge1xuICB3b3JkcyA9IHdvcmRzLmNvbmNhdChzdHJpbmdUb1dvcmRzKHZlcnNlKSk7XG59KTtcbndvcmRzID0gdW5pcXVlVmFsdWVzKHdvcmRzKTtcbmNvbnNvbGUubG9nKHdvcmRzKTtcbnNwYW5pZnkoJHBvZW0sIHdvcmRzKTtcbiIsImV4cG9ydCBjb25zdCBwb2VtID0gW1xuICBcIlRoZSBiZWQgd2UgbG92ZWQgaW4gd2FzIGEgc3Bpbm5pbmcgd29ybGRcIixcbiAgXCJvZiBmb3Jlc3RzLCBjYXN0bGVzLCB0b3JjaGxpZ2h0LCBjbGlmZi10b3BzLCBzZWFzXCIsXG4gIFwid2hlcmUgaGUgd291bGQgZGl2ZSBmb3IgcGVhcmxzLiBNeSBsb3ZlcidzIHdvcmRzXCIsXG4gIFwid2VyZSBzaG9vdGluZyBzdGFycyB3aGljaCBmZWxsIHRvIGVhcnRoIGFzIGtpc3Nlc1wiLFxuICBcIm9uIHRoZXNlIGxpcHM7IG15IGJvZHkgbm93IGEgc29mdGVyIHJoeW1lXCIsXG4gIFwidG8gaGlzLCBub3cgZWNobywgYXNzb25hbmNlOyBoaXMgdG91Y2hcIixcbiAgXCJhIHZlcmIgZGFuY2luZyBpbiB0aGUgY2VudHJlIG9mIGEgbm91bi5cIixcbiAgXCJTb21lIG5pZ2h0cyBJIGRyZWFtZWQgaGUnZCB3cml0dGVuIG1lLCB0aGUgYmVkXCIsXG4gIFwiYSBwYWdlIGJlbmVhdGggaGlzIHdyaXRlcidzIGhhbmRzLiBSb21hbmNlXCIsXG4gIFwiYW5kIGRyYW1hIHBsYXllZCBieSB0b3VjaCwgYnkgc2NlbnQsIGJ5IHRhc3RlLlwiLFxuICBcIkluIHRoZSBvdGhlciBiZWQsIHRoZSBiZXN0LCBvdXIgZ3Vlc3RzIGRvemVkIG9uLFwiLFxuICBcImRyaWJibGluZyB0aGVpciBwcm9zZS4gTXkgbGl2aW5nIGxhdWdoaW5nIGxvdmUg4oCTIFwiLFxuICBcIkkgaG9sZCBoaW0gaW4gdGhlIGNhc2tldCBvZiBteSB3aWRvdydzIGhlYWRcIixcbiAgXCJhcyBoZSBoZWxkIG1lIHVwb24gdGhhdCBuZXh0IGJlc3QgYmVkLlwiXG5dO1xuIl19

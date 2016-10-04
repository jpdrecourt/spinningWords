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
var p5 = require('p5');

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
// Spinning worlds
var worlds = [];

// Visualisation Functions
// ----------------------------------------------------------------------------

// Turns the poem array into divs with class 'verse'
var versify = function versify(arrayOfStrings) {
  return '<div class="verse">' + arrayOfStrings.reduce(function (prev, curr) {
    return prev + '</div><div class="verse">' + curr;
  }) + '</div>';
};

// Create a new moving object with a given initial position and a class name
// Returns a jQuery object
var $newObject = function $newObject(left, top) {
  var objectClass = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var parent = arguments.length <= 3 || arguments[3] === undefined ? 'body' : arguments[3];

  var $object = $('<div></div>').appendTo(parent);
  $object.addClass(objectClass);
  $object.offset({
    'left': left,
    'top': top
  });
  return $object;
};

// Make the object orbit around a point as an jQuery coordinate object from its current position at a given orbital speed in frames
var orbitObject = function orbitObject($object, centre, speed) {
  var dTheta = 2 * Math.PI / speed,
      origin = $object.offset();
  $object.offset({
    'left': centre.left + (origin.left - centre.left) * Math.cos(dTheta) - (origin.top - centre.top) * Math.sin(dTheta),
    'top': centre.top + (origin.top - centre.top) * Math.cos(dTheta) + (origin.left - centre.left) * Math.sin(dTheta)
  });
};

// Calculate the distance between two two jQuery coordinate object
var dist = function dist(coord1, coord2) {
  return Math.sqrt(Math.pow(coord1.left - coord2.left, 2) + Math.pow(coord1.top - coord2.top, 2));
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

// p5 attempt
var sketch = function sketch(p) {

  var x = 100;
  var y = 100;

  p.setup = function () {
    var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.id = 'MyCanvas';
    canvas.parent('canvasHolder');
    worlds.push($newObject(50, 50, 'world', '.poemContainer'));
    worlds.push($newObject(200, 150, 'world', '.poemContainer'));
    worlds[1].css({
      'background': 'green'
    });
  };

  p.draw = function () {
    p.background(0, 0, 0);
    p.fill(255);
    p.rect(p.mouseX, p.mouseY, 50, 50);
    var center = {
      top: 300,
      left: 300
    };
    worlds.forEach(function ($w, index) {
      orbitObject($w, center, 300);
    });
  };
};
var myp5 = new p5(sketch);

// Update word positions on resize
$(window).resize(function () {
  wordPositions = eltPosition(words);
});

},{"./data":2,"jquery":"jquery","p5":"p5"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var poem = exports.poem = ["The bed we loved in was a spinning world", "of forests, castles, torchlight, cliff-tops, seas", "where he would dive for pearls. My lover's words", "were shooting stars which fell to earth as kisses", "on these lips; my body now a softer rhyme", "to his, now echo, assonance; his touch", "a verb dancing in the centre of a noun.", "Some nights I dreamed he'd written me, the bed", "a page beneath his writer's hands. Romance", "and drama played by touch, by scent, by taste.", "In the other bed, the best, our guests dozed on,", "dribbling their prose. My living laughing love – ", "I hold him in the casket of my widow's head", "as he held me upon that next best bed."];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2RhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ2FBOztBQWJBOzs7OztBQUtBO0FBQ0E7QUFDQSxJQUFJLElBQUksUUFBUSxRQUFSLENBQVI7QUFDQSxJQUFJLEtBQUssUUFBUSxJQUFSLENBQVQ7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsSUFBSSxRQUFRLEVBQUUsT0FBRixDQUFaOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQWdCLEVBQXBCO0FBQ0E7QUFDQSxJQUFJLFNBQVMsRUFBYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxVQUFVLFNBQVYsT0FBVSxDQUFDLGNBQUQsRUFBb0I7QUFDaEMsU0FBTyx3QkFDTCxlQUFlLE1BQWYsQ0FBc0IsVUFBQyxJQUFELEVBQU8sSUFBUCxFQUFnQjtBQUNwQyxXQUFPLE9BQU8sMkJBQVAsR0FBcUMsSUFBNUM7QUFDRCxHQUZELENBREssR0FHQSxRQUhQO0FBSUQsQ0FMRDs7QUFPQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLFNBQWIsVUFBYSxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQThDO0FBQUEsTUFBbEMsV0FBa0MseURBQXRCLEVBQXNCO0FBQUEsTUFBbEIsTUFBa0IseURBQVgsTUFBVzs7QUFDN0QsTUFBSSxVQUFVLEVBQUUsYUFBRixFQUFpQixRQUFqQixDQUEwQixNQUExQixDQUFkO0FBQ0EsVUFBUSxRQUFSLENBQWlCLFdBQWpCO0FBQ0EsVUFBUSxNQUFSLENBQWU7QUFDYixZQUFRLElBREs7QUFFYixXQUFPO0FBRk0sR0FBZjtBQUlBLFNBQU8sT0FBUDtBQUNELENBUkQ7O0FBVUE7QUFDQSxJQUFJLGNBQWMsU0FBZCxXQUFjLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBNEI7QUFDNUMsTUFBSSxTQUFTLElBQUksS0FBSyxFQUFULEdB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QUFQLENBQWUsVUFBQyxFQUFELEVBQUssS0FBTCxFQUFlO0FBQzVCLGtCQUFZLEVBQVosRUFBZ0IsTUFBaEIsRUFBd0IsR0FBeEI7QUFDRCxLQUZEO0FBR0QsR0FYRDtBQVlELENBNUJEO0FBNkJBLElBQUksT0FBTyxJQUFJLEVBQUosQ0FBTyxNQUFQLENBQVg7O0FBRUE7QUFDQSxFQUFHLE1BQUgsRUFBWSxNQUFaLENBQW9CLFlBQU07QUFDeEIsa0JBQWdCLFlBQVksS0FBWixDQUFoQjtBQUNELENBRkQ7Ozs7Ozs7O0FDcktPLElBQU0sc0JBQU8sQ0FDbEIsMENBRGtCLEVBRWxCLG1EQUZrQixFQUdsQixrREFIa0IsRUFJbEIsbURBSmtCLEVBS2xCLDJDQUxrQixFQU1sQix3Q0FOa0IsRUFPbEIseUNBUGtCLEVBUWxCLGdEQVJrQixFQVNsQiw0Q0FUa0IsRUFVbEIsZ0RBVmtCLEVBV2xCLGtEQVhrQixFQVlsQixtREFaa0IsRUFhbEIsNkNBYmtCLEVBY2xCLHdDQWRrQixDQUFiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4qIFNwaW5uaW5nIHdvcmRzXG4qIEF1dGhvcjogSmVhbi1QaGlsaXBwZSBEcmVjb3VydFxuKi9cblxuLy8gRGVwZW5kZW5jaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5sZXQgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xubGV0IHA1ID0gcmVxdWlyZSgncDUnKTtcblxuLy8gRGF0YVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUG9lbSBhcyBhIHNldCBvZiBzdHJpbmdzXG5pbXBvcnQge3BvZW19IGZyb20gJy4vZGF0YSc7XG5cbi8vIERPTSBlbGVtZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubGV0ICRwb2VtID0gJCgnI3BvZW0nKTtcblxuLy8gR2xvYmFsIHZhcmlhYmxlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUG9zaXRpb25zIG9mIHRoZSB2YXJpb3VzIHdvcmRzIGluIHRoZSBwb2VtXG5sZXQgd29yZFBvc2l0aW9ucyA9IHt9O1xuLy8gU3Bpbm5pbmcgd29ybGRzXG5sZXQgd29ybGRzID0gW107XG5cbi8vIFZpc3VhbGlzYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFR1cm5zIHRoZSBwb2VtIGFycmF5IGludG8gZGl2cyB3aXRoIGNsYXNzICd2ZXJzZSdcbmxldCB2ZXJzaWZ5ID0gKGFycmF5T2ZTdHJpbmdzKSA9PiB7XG4gIHJldHVybiAnPGRpdiBjbGFzcz1cInZlcnNlXCI+JyArXG4gICAgYXJyYXlPZlN0cmluZ3MucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICByZXR1cm4gcHJldiArICc8L2Rpdj48ZGl2IGNsYXNzPVwidmVyc2VcIj4nICsgY3VycjtcbiAgICB9KSArICc8L2Rpdj4nO1xufTtcblxuLy8gQ3JlYXRlIGEgbmV3IG1vdmluZyBvYmplY3Qgd2l0aCBhIGdpdmVuIGluaXRpYWwgcG9zaXRpb24gYW5kIGEgY2xhc3MgbmFtZVxuLy8gUmV0dXJucyBhIGpRdWVyeSBvYmplY3RcbmxldCAkbmV3T2JqZWN0ID0gKGxlZnQsIHRvcCwgb2JqZWN0Q2xhc3M9JycsIHBhcmVudD0nYm9keScpID0+IHtcbiAgbGV0ICRvYmplY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZFRvKHBhcmVudCk7XG4gICRvYmplY3QuYWRkQ2xhc3Mob2JqZWN0Q2xhc3MpO1xuICAkb2JqZWN0Lm9mZnNldCh7XG4gICAgJ2xlZnQnOiBsZWZ0LFxuICAgICd0b3AnOiB0b3BcbiAgfSk7XG4gIHJldHVybiAkb2JqZWN0O1xufTtcblxuLy8gTWFrZSB0aGUgb2JqZWN0IG9yYml0IGFyb3VuZCBhIHBvaW50IGFzIGFuIGpRdWVyeSBjb29yZGluYXRlIG9iamVjdCBmcm9tIGl0cyBjdXJyZW50IHBvc2l0aW9uIGF0IGEgZ2l2ZW4gb3JiaXRhbCBzcGVlZCBpbiBmcmFtZXNcbmxldCBvcmJpdE9iamVjdCA9ICgkb2JqZWN0LCBjZW50cmUsIHNwZWVkKSA9PiB7XG4gIGxldCBkVGhldGEgPSAyICogTWF0aC5QSSAvIHNwZWVkLFxuICAgIG9yaWdpbiA9ICRvYmplY3Qub2Zmc2V0KCk7XG4gICRvYmplY3Qub2Zmc2V0KHtcbiAgICAnbGVmdCc6IGNlbnRyZS5sZWZ0ICtcbiAgICAgIChvcmlnaW4ubGVmdCAtIGNlbnRyZS5sZWZ0KSAqIE1hdGguY29zKGRUaGV0YSkgLVxuICAgICAgKG9yaWdpbi50b3AgLSBjZW50cmUudG9wKSAqIE1hdGguc2luKGRUaGV0YSksXG4gICAgJ3RvcCcgOiBjZW50cmUudG9wICtcbiAgICAgIChvcmlnaW4udG9wIC0gY2VudHJlLnRvcCkgKiBNYXRoLmNvcyhkVGhldGEpICtcbiAgICAgIChvcmlnaW4ubGVmdCAtIGNlbnRyZS5sZWZ0KSAqIE1hdGguc2luKGRUaGV0YSlcbiAgfSk7XG59O1xuXG4vLyBDYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHR3byBqUXVlcnkgY29vcmRpbmF0ZSBvYmplY3RcbmxldCBkaXN0ID0gKGNvb3JkMSwgY29vcmQyKSA9PiB7XG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coY29vcmQxLmxlZnQgLSBjb29yZDIubGVmdCwgMikgK1xuICAgIE1hdGgucG93KGNvb3JkMS50b3AgLSBjb29yZDIudG9wLCAyKSk7XG59O1xuXG4vLyBEYXRhIHByb2Nlc3NpbmcgZnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQ29uY2F0ZW5hdGUgYSBzdHJpbmcgaW50byBhbiBhcnJheSBvZiBsb3dlcmNjYXNlIHdvcmRzIHdpdGhvdXQgcHVuY3R1YXRpb25cbi8vIEtlZXBzIC0gYW5kICdcbmxldCBzdHJpbmdUb1dvcmRzID0gKHN0cmluZykgPT4ge1xuICByZXR1cm4gc3RyaW5nXG4gICAgLnJlcGxhY2UoL1teYS16QS1aMC05XFwnXFwtXSsvZywnICcpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcgJyk7XG59O1xuXG4vLyBDcmF3bHMgdGhlIGpxdWVyeSAkb2JqZWN0IGFuZCBjcmVhdGVzIGEgc3BhbiBhcm91bmQgZWFjaCB3b3JkIG9mIHRoZSB3b3JkXG4vLyBsaXN0LiBUaGUgc3BhbiBnZXRzIHR3byBjbGFzc2VzIFtzcGFuQ2xhc3NdIGFuZCBbc3BhbkNsYXNzXV9baV0gd2l0aCBpIHRoZVxuLy8gaW5kZXggb2YgdGhlIGdpdmVuIHdvcmRcbmxldCBzcGFuaWZ5ID0gKCRvYmplY3QsIHdvcmRzLCBzcGFuQ2xhc3M9J3dvcmQnKSA9PiB7XG4gIC8vIGxldCBzb3J0ZWRXb3JkcyA9IHNvcnRQZXJMZW5ndGgod29yZHMpO1xuICB3b3Jkcy5mb3JFYWNoKCh3b3JkLCBpbmRleCkgPT4ge1xuICAgIC8vIE9ubHkgbWF0Y2ggZW50aXJlIHdvcmRzIG91dHNpZGUgb2YgSFRNTCB0YWdzXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNjk1MTAwMy9qYXZhc2NyaXB0LXJlcGxhY2UtYWxsLWJ1dC1vbmx5LW91dHNpZGUtaHRtbC10YWdzXG4gICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cChcIihcXFxcYlwiICsgd29yZCArIFwiXFxcXGIpKD8hKFtePF0rKT8+KVwiLCAnaWcnKTtcbiAgICAkb2JqZWN0Lmh0bWwoJG9iamVjdC5odG1sKCkucmVwbGFjZShyZWdFeCwgKHgpID0+IHtcbiAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9JyR7c3BhbkNsYXNzfSB3b3JkXyR7aW5kZXh9Jz4ke3h9PC9zcGFuPmA7XG4gICAgfSkpO1xuICB9KTtcbn07XG5cbi8vIEV4dHJhY3RzIHVuaXF1ZSB2YWx1ZXMgb2YgdGhlIGFycmF5XG5sZXQgdW5pcXVlVmFsdWVzID0gKGFycmF5KSA9PiB7XG4gIHJldHVybiBhcnJheS5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSk7XG59O1xuXG4vLyBDcmVhdGUgYSBsaXN0IG9mIHRoZSBwb3NpdGlvbiBvZiBlbGVtZW50cyBjcmVhdGVkIGJ5IHNwYW5uaWZ5XG5sZXQgZWx0UG9zaXRpb24gPSAod29yZHMsIGVsdENsYXNzPSd3b3JkJykgPT4ge1xuICBsZXQgcG9zaXRpb25zID0ge307XG4gIHdvcmRzLmZvckVhY2goKHdvcmQsIGluZGV4KSA9PiB7XG4gICAgJChgLiR7ZWx0Q2xhc3N9LiR7ZWx0Q2xhc3N9XyR7aW5kZXh9YCkuZWFjaCggKGksIGRvbU9iamVjdCkgPT4ge1xuICAgICAgaWYgKHBvc2l0aW9ucy5oYXNPd25Qcm9wZXJ0eSh3b3Jkc1tpbmRleF0pKSB7XG4gICAgICAgIHBvc2l0aW9uc1t3b3Jkc1tpbmRleF1dLnB1c2goJChkb21PYmplY3QpLm9mZnNldCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvc2l0aW9uc1t3b3Jkc1tpbmRleF1dID0gWyQoZG9tT2JqZWN0KS5vZmZzZXQoKV07XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcG9zaXRpb25zO1xufTtcblxuLy8gTWFpbiBleGVjdXRpb25cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIERpc3BsYXkgdGhlIHBvZW1cblxuJHBvZW0uaHRtbCh2ZXJzaWZ5KHBvZW0pKTtcblxuLy8gSWRlbnRpZnkgdGhlIHBvc2l0aW9uIG9mIHRoZSB3b3Jkc1xubGV0IHdvcmRzID0gW107XG5wb2VtLmZvckVhY2goKHZlcnNlKSA9PiB7XG4gIHdvcmRzID0gd29yZHMuY29uY2F0KHN0cmluZ1RvV29yZHModmVyc2UpKTtcbn0pO1xud29yZHMgPSB1bmlxdWVWYWx1ZXMod29yZHMpO1xuc3BhbmlmeSgkcG9lbSwgd29yZHMpO1xud29yZFBvc2l0aW9ucyA9IGVsdFBvc2l0aW9uKHdvcmRzKTtcblxuLy8gcDUgYXR0ZW1wdFxubGV0IHNrZXRjaCA9IGZ1bmN0aW9uKCBwICkge1xuXG4gIHZhciB4ID0gMTAwO1xuICB2YXIgeSA9IDEwMDtcblxuICBwLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGNhbnZhcyA9IHAuY3JlYXRlQ2FudmFzKHAud2luZG93V2lkdGgsIHAud2luZG93SGVpZ2h0KTtcbiAgICBjYW52YXMuaWQgPSAnTXlDYW52YXMnO1xuICAgIGNhbnZhcy5wYXJlbnQoJ2NhbnZhc0hvbGRlcicpO1xuICAgIHdvcmxkcy5wdXNoKCRuZXdPYmplY3QoNTAsIDUwLCAnd29ybGQnLCAnLnBvZW1Db250YWluZXInKSk7XG4gICAgd29ybGRzLnB1c2goJG5ld09iamVjdCgyMDAsIDE1MCwgJ3dvcmxkJywgJy5wb2VtQ29udGFpbmVyJykpO1xuICAgIHdvcmxkc1sxXS5jc3Moe1xuICAgICAgJ2JhY2tncm91bmQnOiAnZ3JlZW4nXG4gICAgfSk7XG4gIH07XG5cbiAgcC5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgcC5iYWNrZ3JvdW5kKDAsMCwwKTtcbiAgICBwLmZpbGwoMjU1KTtcbiAgICBwLnJlY3QocC5tb3VzZVgscC5tb3VzZVksNTAsNTApO1xuICAgIGxldCBjZW50ZXIgPSB7XG4gICAgICB0b3A6IDMwMCxcbiAgICAgIGxlZnQ6IDMwMFxuICAgIH07XG4gICAgd29ybGRzLmZvckVhY2goKCR3LCBpbmRleCkgPT4ge1xuICAgICAgb3JiaXRPYmplY3QoJHcsIGNlbnRlciwgMzAwKTtcbiAgICB9KTtcbiAgfTtcbn07XG5sZXQgbXlwNSA9IG5ldyBwNShza2V0Y2gpO1xuXG4vLyBVcGRhdGUgd29yZCBwb3NpdGlvbnMgb24gcmVzaXplXG4kKCB3aW5kb3cgKS5yZXNpemUoICgpID0+IHtcbiAgd29yZFBvc2l0aW9ucyA9IGVsdFBvc2l0aW9uKHdvcmRzKTtcbn0pO1xuIiwiZXhwb3J0IGNvbnN0IHBvZW0gPSBbXG4gIFwiVGhlIGJlZCB3ZSBsb3ZlZCBpbiB3YXMgYSBzcGlubmluZyB3b3JsZFwiLFxuICBcIm9mIGZvcmVzdHMsIGNhc3RsZXMsIHRvcmNobGlnaHQsIGNsaWZmLXRvcHMsIHNlYXNcIixcbiAgXCJ3aGVyZSBoZSB3b3VsZCBkaXZlIGZvciBwZWFybHMuIE15IGxvdmVyJ3Mgd29yZHNcIixcbiAgXCJ3ZXJlIHNob290aW5nIHN0YXJzIHdoaWNoIGZlbGwgdG8gZWFydGggYXMga2lzc2VzXCIsXG4gIFwib24gdGhlc2UgbGlwczsgbXkgYm9keSBub3cgYSBzb2Z0ZXIgcmh5bWVcIixcbiAgXCJ0byBoaXMsIG5vdyBlY2hvLCBhc3NvbmFuY2U7IGhpcyB0b3VjaFwiLFxuICBcImEgdmVyYiBkYW5jaW5nIGluIHRoZSBjZW50cmUgb2YgYSBub3VuLlwiLFxuICBcIlNvbWUgbmlnaHRzIEkgZHJlYW1lZCBoZSdkIHdyaXR0ZW4gbWUsIHRoZSBiZWRcIixcbiAgXCJhIHBhZ2UgYmVuZWF0aCBoaXMgd3JpdGVyJ3MgaGFuZHMuIFJvbWFuY2VcIixcbiAgXCJhbmQgZHJhbWEgcGxheWVkIGJ5IHRvdWNoLCBieSBzY2VudCwgYnkgdGFzdGUuXCIsXG4gIFwiSW4gdGhlIG90aGVyIGJlZCwgdGhlIGJlc3QsIG91ciBndWVzdHMgZG96ZWQgb24sXCIsXG4gIFwiZHJpYmJsaW5nIHRoZWlyIHByb3NlLiBNeSBsaXZpbmcgbGF1Z2hpbmcgbG92ZSDigJMgXCIsXG4gIFwiSSBob2xkIGhpbSBpbiB0aGUgY2Fza2V0IG9mIG15IHdpZG93J3MgaGVhZFwiLFxuICBcImFzIGhlIGhlbGQgbWUgdXBvbiB0aGF0IG5leHQgYmVzdCBiZWQuXCJcbl07XG4iXX0=

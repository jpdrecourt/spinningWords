/*
* Spinning words
* Author: Jean-Philippe Drecourt
*/

import {poem} from './data';

let greet = (divId, greeting) => {
  const elt = document.getElementById(divId);
  elt.innerText = greeting;
};

let stringify = (arrayOfStrings) => {
  return arrayOfStrings.reduce((prev, curr) => {
    return prev + '\n' + curr;
  });
};

greet('greeting', stringify(poem));

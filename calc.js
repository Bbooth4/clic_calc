// run with node calc '(add (multiply 2 1) (add (multiply 2 2) (add 1 1)))'

/**
 * Using regex, formats the array to based upon if add or multiply needs to be applied
 * More functions can easily be applied by copying the if statements below but for a new type of operator
 * @param {array} brackets
 * Counting the brackets is done to keep track of the appropriate opening/closing location of each function
 */
const calculate = async p => {
  let bracketCounter = 0, foundBrackets = 0, cont = false;
  await p.map(async (s, i) => {
    if (s.match(/[(]/)) bracketCounter += 1;
    if (s.match(/[)]/)) bracketCounter -= 1;
    if (s.match(/add/)) {
      if (p[i+1].match(/[(]/)) {
        // j used to start at i, but once you start nesting at different points
        // then it becomes necessary to restart from 0 everytime
        // e.g. node calc '(add (multiply 2 1) (add (multiply 2 2) (add 1 1)))'
        let j = 0;
        cont = true;
        while (cont) {
          if (p[j].match(/[)]/)) foundBrackets += 1;
          if (bracketCounter === foundBrackets) {
            if (p[i+1].match(/[(]/)) {
              p[i] =  s.replace(/add/, '');
              p[j] =  `${p[j]}+`;
              cont = false;
            } else {
              p[i] =  s.replace(/add/, '');
              p[j-1] =  `+${p[j-1]}`;
              cont = false;
            };
          };
          j++;
        };
        foundBrackets = 0;
      } else {
        p[i] =  s.replace(/add/, '');
        p[i+1] =  `${p[i+1]}+`;
      };
    };
    if (s.match(/multiply/)) {
      if (p[i+1].match(/[(]/)) {
        let j = 0;
        cont = true;
        while (cont) {
          if (p[j].match(/[)]/)) foundBrackets += 1;
          if (bracketCounter === foundBrackets) {
            if (p[i+1].match(/[(]/)) {
              p[i] =  s.replace(/multiply/, '');
              p[j] =  `${p[j]}*`;
              cont = false;
            } else {
              p[i] =  s.replace(/multiply/, '');
              p[j-1] =  `*${p[j-1]}`;
              cont = false;
            };
          };
          j++;
        };
        foundBrackets =  0;
      } else {
        p[i] =  s.replace(/multiply/, '');
        p[i+1] =  `${p[i+1]}*`;
      };
    };
  });

  return await p;
};

/**
 * counts total opening and closing brackets to ensure that the string is formatted correctly
 * @param {string} brackets
 */
const countOpening = brackets => ((brackets || '').match(/[(]/g) || []).length;
const countClosing = brackets => ((brackets || '').match(/[)]/g) || []).length;

/**
 * Formats and returns a string from the cli and returns an integer
 * @param {string} c string that sent from cli and parsed into workable math
 * example input '(add (multiply 2 1) (add (multiply 2 2) (add 1 1)))'
 */
const calc = async c => {
  let calculated;
  const addBracketSpaces = c.replace(/[)]/g, ' )').replace(/[(]/g, '( ');
  const split = await addBracketSpaces.split(' ');

  try {
    openingTotal = await countOpening(c);
    closingTotal = await countClosing(c);
  } catch(err) { console.log(err); };

  if (openingTotal === closingTotal) {
    try { calculated = await calculate(split); }
    catch(err) { console.log(err); };
  } else console.log('Failed to close all brackets');
  // for further error handling, I can use regex to ensure that multiply and add are spelled correctly

  const answer = calculated.join().replace(/,/g, '')

  await console.log(answer);
  await console.log(eval(answer));
};

calc(process.argv[2]);

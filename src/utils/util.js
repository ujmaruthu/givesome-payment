export let isNumeric = (text) => {

  let newText = '';
  let numbers = '0123456789';

  for (let val of text) {
      if (numbers.indexOf(val) > -1) {
          newText = newText + val;
      }else {
      }
  }

  return newText;
};
export let isAlphabetic = (inputString) => {
  var alphabeticRegex = /^[A-Za-z]+$/;
  return alphabeticRegex.test(inputString);
}
  
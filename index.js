(function () {

  var regex = /([-\+\*\/])/;
  var equal = document.getElementById("equal");
  var c = document.getElementById("clear");
  var ce = document.getElementById("clear-last");
  var input = "";
  var lastInput = "";
  //Keeps track of operators so several op:s cannot be
  //added in a row
  var canAdd = true;
  //Keeps track of dots so several dots cannot be added
  //in the same number or in a row
  var hasDot = false;

  var operators = {
    add: function add(a, b) {
      return a + b;
    },
    sub: function sub(a, b) {
      return a - b;
    },
    mul: function mul(a, b) {
      return a * b;
    },
    div: function div(a, b) {
      return a / b;
    }
  };

  //To get the last entry from the input string
  var getLastInput = function getLastInput(str) {
    var lastChar = str.charAt(str.length - 1);
    if (lastChar.search(regex) === -1) {
      return str.split(regex).pop();
    }
    return lastChar;
  };

  //To show value in top of display
  var toDisplayTop = function toDisplayTop(val) {
    var topDisplay = document.getElementById("top-display");
    topDisplay.innerHTML = val;
  };

  //To show value in bottom of display
  var toDisplayBot = function toDisplayBot(val) {
    var botDisplay = document.getElementById("bottom-display");
    botDisplay.innerHTML = val;
  };

  //To round off result to 4 decimals
  var fourDecimals = function fourDecimals(val) {
    return +(Math.round(val + "e+4") + "e-4");
  };

  //Add entries to input string
  function addInput() {
    var arr = Array.from(document.getElementsByClassName("btn"));
    //Get all buttons except C, CE and equals sign
    var chars = arr.slice(2, 18);

    chars.forEach(function (char) {
      char.onclick = function () {
        var current = this.innerHTML;
        //Input validation rules
        if (current === 'x' && canAdd && input) {
          input += '*';
          canAdd = false;
          hasDot = true;
        } else if (current === '÷' && canAdd && input) {
          input += '/';
          canAdd = false;
          hasDot = true;
        } else if (current === '+' && canAdd && input) {
          input += current;
          canAdd = false;
          hasDot = true;
        } else if (current === '-' && canAdd) {
          input += current;
          canAdd = false;
          hasDot = true;
        } else if (!isNaN(current) && input !== '0') {
          input += current;
          canAdd = true;
          hasDot = false;
        } else if (current === '.' && !hasDot && !/\./.test(lastInput) && input) {
          input += current;
          hasDot = true;
        }
        lastInput = getLastInput(input);
        if (lastInput.length > 13 || input.length > 21) {
          input = "";
          toDisplayTop("0");
          toDisplayBot("Digit limit reached");
        } else {
          toDisplayTop(lastInput);
          toDisplayBot(input);
        }
      };
    });
  }
  addInput();

  //Calculates the result when equals sign is clicked,
  //one operation at a time
  function evaluate() {
    var array = input.split(regex);
    console.log(array);
    var toOperate = void 0;
    var partRes = void 0;
    var result = void 0;

    function innerEval(array) {
      if (array.length >= 3) {
        toOperate = array.splice(0, 3);

        if (toOperate[1] === "+") {
          partRes = operators.add(Number(toOperate[0]), Number(toOperate[2]));
        }
        if (toOperate[1] === "-") {
          partRes = operators.sub(Number(toOperate[0]), Number(toOperate[2]));
        }
        if (toOperate[1] === "*") {
          partRes = operators.mul(Number(toOperate[0]), Number(toOperate[2]));
        }
        if (toOperate[1] === "/") {
          partRes = operators.div(Number(toOperate[0]), Number(toOperate[2]));
        }

        if (array.length) {
          array.unshift(partRes);
          innerEval(array);
        } else {
          result = fourDecimals(partRes);
          input = input + "=" + result;
          toDisplayTop(result);
          toDisplayBot(input);
          console.log(result);
          input = "";
        }
      }
    }
    innerEval(array);
  }
  equal.onclick = evaluate;

  function clear() {
    input = "";
    toDisplayTop("0");
    toDisplayBot("0");
  }
  c.onclick = clear;

  function clearLast() {
    var last = getLastInput(input);
    if (input === "") {
      clear();
    } else {
      input = input.substr(0, input.length - last.length);
      toDisplayTop("0");
      toDisplayBot(input);
      canAdd = true;
    }
  }
  ce.onclick = clearLast;
})();
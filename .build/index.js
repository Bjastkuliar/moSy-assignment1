var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_prompt_sync = __toModule(require("prompt-sync"));
var import_fs = __toModule(require("fs"));
const reset = "[0m";
const red = "[41m";
const green = "[42m";
const yellow = "[43m";
const input = (0, import_prompt_sync.default)();
const answers = (0, import_fs.readFileSync)("answers.txt", "utf-8").split("\n");
const words = (0, import_fs.readFileSync)("allwords.txt", "utf-8").split("\n");
const rowSeparator = "|---|---|---|---|---|";
const keySeparator = "|---|---|---|---|---|---|---|---|---|---|";
const rowEmpty = "|   |   |   |   |   |";
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM";
mainMenu();
function setMessage(settings, message) {
  let tmp = __spreadValues({}, settings);
  tmp.msg = message;
  return Object.freeze(tmp);
}
function setGameMessage(settings, message) {
  let tmp = __spreadValues({}, settings);
  tmp.msg = message;
  return Object.freeze(tmp);
}
function setMode(settings, mode) {
  let tmp = __spreadValues({}, settings);
  tmp.hardMode = mode;
  return Object.freeze(tmp);
}
function playMore(settings, answer) {
  let tmp = __spreadValues({}, settings);
  tmp.keepPlaying = answer;
  return Object.freeze(tmp);
}
function mainMenu(settings = {
  msg: "Welcome",
  keepPlaying: true,
  wins: 0,
  losses: 0
}) {
  while (settings.keepPlaying) {
    showMessage(settings.msg);
    const i = input(`enter a number between 0 and ${answers.length}: `);
    settings = processString(i, settings);
  }
}
function showMessage(message, inGame = false) {
  console.log(message + "\n");
  if (!inGame) {
    console.log("Type HELP to list all the commands\nor type QUIT to quit.\nTo choose an answer ");
  }
}
function processString(word, data) {
  switch (word.length) {
    case 5: {
      word = word.toLowerCase();
      if (data.hasOwnProperty("answer")) {
        return validateWord(word, data);
      } else {
        return setMessage(data, "Game has not started yet!\nEnter a number to start a game.");
      }
    }
    case 4: {
      word = word.toUpperCase();
      if (data.hasOwnProperty("answer")) {
        if (data.inGame) {
          return exitGame(data);
        }
      } else {
        return processCommand(word, data);
      }
    }
    case 1: {
      if (data.hasOwnProperty("answer")) {
        if (data.inGame) {
          return exitGame(data);
        }
      } else {
        return processNumber(word, data);
      }
    }
    default: {
      return setMessage(data, "Invalid input, please try again!");
    }
  }
}
function processCommand(input2, settings) {
  console.clear();
  switch (input2) {
    case "QUIT": {
      console.clear();
      return playMore(settings, false);
    }
    case "EASY": {
      if (settings.hardMode) {
        settings = setMessage(settings, "Hard mode disabled!");
        return setMode(settings, false);
      } else {
        return setMessage(settings, "Hard mode is already disabled!");
      }
    }
    case "HARD": {
      if (!settings.hardMode) {
        settings = setMessage(settings, "Hard mode enabled.");
        return setMode(settings, true);
      } else {
        return setMessage(settings, "Hard mode is already enabled!");
      }
    }
    case "HELP": {
      return setMessage(settings, "The available commands are:\nHELP       shows this list\nEASY/HARD  switches between easy and hard mode\nSTAT       prints the statistics\nQUIT       exits the game");
    }
    case "STAT": {
      return setMessage(settings, `Current statistics:

${settings.wins}  games won
${settings.losses}  games lost`);
    }
    default: {
      return setMessage(settings, "Invalid command, please try again!");
    }
  }
}
function processNumber(word, settings) {
  let i = parseInt(word);
  if (isNaN(i)) {
    return setMessage(settings, "Invalid input, please try again!");
  } else {
    let game = {
      answer: answers[i],
      inGame: true,
      round: 0
    };
    return newGame(settings, game);
  }
}
function setWin(settings) {
  let tmp = __spreadValues({}, settings);
  if (typeof tmp.wins === "undefined") {
    tmp.wins = 1;
  } else {
    tmp.wins++;
  }
  return Object.freeze(tmp);
}
function setLoss(settings) {
  let tmp = __spreadValues({}, settings);
  if (typeof tmp.losses === "undefined") {
    tmp.losses = 1;
  } else {
    tmp.losses++;
  }
  return Object.freeze(tmp);
}
function exitGame(game) {
  let tmp = __spreadValues({}, game);
  tmp.inGame = false;
  return Object.freeze(tmp);
}
function correctChars(game, guess) {
  let tmp = __spreadValues({}, game);
  if (typeof tmp.partialAnswer === "undefined") {
    tmp.partialAnswer = new Array();
  }
  for (let i = 0; i < guess.length; i++) {
    if (game.answer.includes(guess.charAt(i))) {
      if (tmp.partialAnswer.contains(guess.charAt(i))) {
        tmp.partialAnswer.push(guess.charAt(i));
      }
    }
  }
  return Object.freeze(tmp);
}
function newGame(settings, game) {
  game = fillGrid(game);
  game = playGame(game);
  if (typeof game.win !== "undefined") {
    if (game.win) {
      game = setGameMessage(game, "You Won!");
      settings = setMessage(settings, "You Won!");
      settings = setWin(settings);
    } else {
      settings = setMessage(settings, `You Lost! The answer was ${game.answer}`);
      settings = setLoss(settings);
      game = setGameMessage(game, `You Lost! The answer was ${game.answer}`);
    }
  } else {
    game = setGameMessage(game, "Game exited!");
    settings = setMessage(settings, `Game exited!`);
  }
  showMessage(game.msg);
  printGrid(game.grid);
  input("Press enter to get back to main menu");
  return settings;
}
function nextRound(game) {
  let tmp = __spreadValues({}, game);
  tmp.round++;
  return Object.freeze(tmp);
}
function updateKeyboard(game, keyboard) {
  let tmp = __spreadValues({}, game);
  tmp.keyboard = keyboard;
  return Object.freeze(tmp);
}
function playGame(game) {
  showMessage(game.msg);
  printGrid(game.grid);
  game = printKeyboard(game);
  console.log(`Round number: ${game.round}`);
  let word = input("Enter your guess: ");
  game = processString(word, game);
  if (word === game.answer) {
    return win(game);
  } else {
    if (game.round < 6) {
      if (game.inGame) {
        return playGame(game);
      } else {
        return game;
      }
    } else {
      return lost(game);
    }
  }
}
function lost(game) {
  let tmp = __spreadValues({}, game);
  tmp.win = false;
  return Object.freeze(tmp);
}
function validateWord(word, game) {
  if (words.includes(word)) {
    game = nextRound(game);
    game = fillGrid(game, word);
    return paintWord(word, game);
  } else {
    return setGameMessage(game, `${word} does not figure among valid words!`);
  }
}
function fillGrid(game, word = void 0) {
  let tmp = __spreadValues({}, game);
  if (typeof tmp.grid === "undefined") {
    tmp.grid = new Array(6).fill(void 0);
  } else {
    if (typeof word !== "undefined") {
      tmp.grid[tmp.round - 1] = Array.from(word);
    }
  }
  return Object.freeze(tmp);
}
function convertRow(gameRow, separator) {
  if (typeof gameRow !== "undefined") {
    let gridRow = "| ";
    gameRow.map((element) => gridRow += element + " | ");
    return gridRow + "\n" + separator + "\n";
  } else {
    return rowEmpty + "\n" + separator + "\n";
  }
}
function printGrid(grid) {
  let view = "";
  if (grid.length === 3) {
    view += keySeparator + "\n";
    grid.map((row) => view += convertRow(row, keySeparator));
  } else {
    view += rowSeparator + "\n";
    grid.map((row) => view += convertRow(row, rowSeparator));
  }
  console.log(view);
}
function printKeyboard(game) {
  let uK;
  if (typeof game.keyboard === "undefined") {
    let tmp = keys.split("P");
    tmp[0] += "P";
    tmp = tmp.concat(tmp[1].split("L"));
    tmp.splice(1, 1);
    tmp[1] += "L ";
    tmp[2] = " " + tmp[2] + "  ";
    uK = tmp.map((row) => row.split(""));
  } else {
    uK = [...game.keyboard];
  }
  printGrid(uK);
  return updateKeyboard(game, uK);
}
function paintWord(word, game) {
  if (word !== game.answer) {
    for (let idx = 0; idx < word.length; idx++) {
      let char = word.charAt(idx);
      if (char === game.answer.charAt(idx)) {
        game = paintKeyboard(char, green, game);
        game = paintGrid(char, green, game);
      } else {
        if (game.answer.includes(word.charAt(idx))) {
          if (count(word, char) > 1) {
            let scoredWord = scoreWord(word, game);
            if (idx !== maxScorePos(char, scoredWord) - 1) {
              game = paintKeyboard(char, green, game);
              game = paintGrid(char, reset, game);
            }
          } else {
            game = paintKeyboard(char, green, game);
            game = paintGrid(char, yellow, game);
          }
        } else {
          game = paintKeyboard(char, red, game);
        }
      }
    }
  } else {
    for (let idx = 0; idx < word.length; idx++) {
      let char = word.charAt(idx);
      game = paintKeyboard(char, green, game);
      game = paintGrid(char, green, game);
    }
  }
  return game;
}
function scoreWord(word, game) {
  let arr = new Array(word.length).fill(void 0);
  for (let idx = 0; idx < word.length; idx++) {
    let char = {
      char: word.charAt(idx),
      score: 0
    };
    char.repeated = count(word, char.char) > 1;
    if (game.answer.charAt(idx) === word.charAt(idx)) {
      char.score = 2;
    } else {
      if (game.answer.includes(char.char)) {
        char.score = 1;
      }
    }
    arr.splice(idx, 1, char);
  }
  return arr;
}
function hasDoubles(word) {
  let lowercase = word.toLocaleLowerCase();
  let set = new Set(lowercase);
  if (lowercase.length === set.size) {
    return false;
  } else {
    return true;
  }
}
function win(game) {
  let tmp = __spreadValues({}, game);
  tmp.win = true;
  return Object.freeze(tmp);
}
function paintKeyboard(char, colour, game) {
  let tmp = __spreadValues({}, game);
  tmp.keyboard = paintK(char, tmp.keyboard, colour);
  return Object.freeze(tmp);
}
function paintGrid(char, colour, game) {
  let tmp = __spreadValues({}, game);
  tmp.grid = paintG(char, tmp.grid, colour);
  return Object.freeze(tmp);
}
function paintK(char, data, colour) {
  let letter = char.toUpperCase();
  let tmp = [...data];
  for (let idx = 0; idx < tmp.length; idx++) {
    let row = tmp[idx];
    if (row.includes(letter)) {
      row[row.indexOf(letter)] = colour + letter + reset;
    }
  }
  return tmp;
}
function paintG(char, data, colour) {
  let tmp = [...data];
  for (let idx = 0; idx < tmp.length; idx++) {
    let row = tmp[idx];
    if (typeof row !== "undefined" && row.includes(char)) {
      row[row.indexOf(char)] = colour + char + reset;
    }
  }
  return tmp;
}
function count(word, c) {
  var result = 0, i = 0;
  for (i; i < word.length; i++)
    if (word[i] == c)
      result++;
  return result;
}
;
function maxScorePos(char, scoredWord) {
  let maxScorePos2 = 0;
  for (let idx = 0; idx < scoredWord.length; idx++) {
    if (scoredWord[idx].char === char) {
      maxScorePos2 = idx;
    }
  }
  return maxScorePos2 + 1;
}
//# sourceMappingURL=index.js.map

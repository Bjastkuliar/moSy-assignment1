var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
const Reset = "[0m";
const BgRed = "[41m";
const BgGreen = "[42m";
const BgYellow = "[43m";
const BgBlue = "[44m";
const BgMagenta = "[45m";
const BgCyan = "[46m";
const BgWhite = "[47m";
const input = (0, import_prompt_sync.default)();
const answers = (0, import_fs.readFileSync)("answers.txt", "utf-8").split("\n");
const words = (0, import_fs.readFileSync)("allwords.txt", "utf-8").split("\n");
const rowSeparator = "|---|---|---|---|---|";
const rowEmpty = "|   |   |   |   |   |";
const keyboardSeparator = "|---|---|---|---|---|---|---|---|---|---|";
const keyboard = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], ["A", "S", "D", "F", "G", "H", "J", "K", "L"], ["Z", "X", "C", "V", "B", "N", "M"]];
let keyboardColour = [...keyboard];
let message;
let answer;
let hardMode = false;
let keepPlaying = true;
let inGame = false;
let round = 0;
let wins = 0;
let losses = 0;
let game = new Array(6);
menu();
function menu() {
  while (keepPlaying) {
    showMessage();
    const i = input(`enter a number between 0 and ${answers.length}: `);
    processString(i);
  }
}
function showMessage() {
  if (typeof message !== "undefined") {
    console.log(message + "\n");
    if (!inGame) {
      console.log("Type HELP to list all the commands\nor type QUIT to quit.\nTo choose an answer ");
    }
  } else {
    console.log("Welcome!\n");
    console.log("Type HELP to list all the commands\nor type QUIT to quit.\nTo choose an answer ");
  }
}
function processString(input2) {
  switch (input2.length) {
    case 5: {
      processWord(input2);
      break;
    }
    case 4: {
      processCommand(input2);
      break;
    }
    case 1: {
      processNumber(input2);
      break;
    }
    default: {
      message = "Invalid input, please try again!";
      break;
    }
  }
}
function processCommand(input2) {
  switch (input2) {
    case "QUIT": {
      inGame = false;
      keepPlaying = false;
      console.clear();
      break;
    }
    case "EASY": {
      inGame = false;
      if (hardMode) {
        message = "Hard mode disabled.";
        hardMode = false;
      } else {
        message = "Hard mode is already disabled!";
      }
      break;
    }
    case "HARD": {
      inGame = false;
      if (!hardMode) {
        message = "Hard mode enabled.";
        hardMode = true;
      } else {
        message = "Hard mode is already enabled!";
      }
      break;
    }
    case "HELP": {
      inGame = false;
      message = "The available commands are:\nHELP       shows this list\nEASY/HARD  switches between easy and hard mode\nSTAT       prints the statistics\nQUIT       exits the game";
      break;
    }
    case "STAT": {
      inGame = false;
      message = `Current statistics:

${wins}  games won
${losses}  games lost`;
      break;
    }
    default: {
      message = "Invalid command, please try again!";
      break;
    }
  }
}
function processNumber(input2) {
  let i = parseInt(input2);
  if (isNaN(i)) {
    message = "Invalid input, please try again!";
  } else {
    answer = answers[i];
    newGame();
  }
}
function processWord(input2) {
  if (inGame) {
    if (words.includes(input2)) {
      fillGame(input2);
    } else {
      message = "Word does not figure among those valid!";
    }
  } else {
    message = "Game has not started yet!\nEnter a number to start a game.";
  }
}
function newGame() {
  inGame = true;
  round = 0;
  endGame(playRound());
}
function endGame(result) {
  message = "Game has ended!";
  if (result) {
    message += "\nYou Won!";
    wins++;
  } else {
    message += `
You Lost! The correct word was ${answer}`;
    losses++;
  }
  showMessage();
  printGrid();
  input("Press enter to continue");
  inGame = false;
  round = 0;
  game = new Array(6);
  message = void 0;
  menu();
}
function playRound() {
  let word;
  switch (round) {
    case 0: {
      message = "New game has started!";
      showMessage();
      printGrid();
      printKeyboard();
      word = input("Enter the first guess ");
      processString(word);
      break;
    }
    case 5: {
      message = "Last round!";
      showMessage();
      printGrid();
      printKeyboard();
      word = input("Enter your last guess ");
      processString(word);
      break;
    }
    default: {
      message = "Round " + round;
      showMessage();
      printGrid();
      printKeyboard();
      word = input("Enter the next guess ");
      processString(word);
      break;
    }
  }
  if (checkAnswer(word)) {
    return true;
  } else {
    if (round < 6 && keepPlaying !== false) {
      return playRound();
    }
  }
}
function fillGame(word) {
  const wordArray = Array.from(word);
  game[round] = wordArray;
  console.log(game);
  round++;
}
function convertRow(gameRow) {
  if (typeof gameRow !== "undefined") {
    let gridRow = "| ";
    for (let idx = 0; idx < gameRow.length; idx++) {
      gridRow = gridRow + gameRow[idx] + " | ";
    }
    return gridRow;
  } else {
    return rowEmpty;
  }
}
function printStats() {
  console.log("inGame " + inGame + "\nkeepPlaying " + keepPlaying + "\nround " + round + "\ngame " + game + "\ngame length " + game.length);
}
function printGrid() {
  let view = rowSeparator + "\n";
  for (let idx = 0; idx < 6; idx++) {
    view = view + convertRow(game[idx]) + "\n" + rowSeparator + "\n";
  }
  console.log(view);
}
function printKeyboard() {
  let keyGrid = keyboardSeparator + "\n";
  for (let idx = 0; idx < keyboard.length; idx++) {
    keyGrid += showKeyboard(idx);
  }
  console.log(keyGrid);
}
function showKeyboard(index) {
  switch (index) {
    case 0: {
      return convertRow(keyboardColour[index]) + "\n" + keyboardSeparator + "\n";
    }
    case 1: {
      return convertRow(keyboardColour[index]) + "  |\n" + keyboardSeparator + "\n";
    }
    case 2: {
      return "|   " + convertRow(keyboardColour[index]) + "  |   |\n" + keyboardSeparator + "\n";
    }
    default:
      return "error";
  }
}
function checkAnswer(input2) {
  if (input2 === answer) {
    return true;
  } else {
    return false;
  }
}
//# sourceMappingURL=index.js.map

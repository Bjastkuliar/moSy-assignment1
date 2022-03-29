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
let message;
let answer;
let hardMode = false;
let keepPlaying = true;
let inGame = false;
let round = 0;
let wins = 0;
let losses = 0;
let game = new Array();
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
  inGame = false;
  switch (input2) {
    case "QUIT": {
      keepPlaying = false;
      console.clear();
      break;
    }
    case "EASY": {
      if (hardMode) {
        message = "Hard mode disabled.";
        hardMode = false;
      } else {
        message = "Hard mode is already disabled!";
      }
      break;
    }
    case "HARD": {
      if (!hardMode) {
        message = "Hard mode enabled.";
        hardMode = true;
      } else {
        message = "Hard mode is already enabled!";
      }
      break;
    }
    case "HELP": {
      message = "The available commands are:\nHELP       shows this list\nEASY/HARD  switches between easy and hard mode\nSTAT       prints the statistics\nQUIT       exits the game";
      break;
    }
    case "STAT": {
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
      fillGrid(input2);
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
  let win = false;
  playRound();
  endGame(win);
}
function endGame(result) {
  if (result) {
    wins++;
  } else {
    losses++;
  }
  inGame = false;
  round = 0;
  game = new Array();
  menu();
}
function playRound() {
  let word;
  switch (round) {
    case 0: {
      round++;
      message = "Game has started!";
      showMessage();
      printStats();
      word = input("Enter the first guess ");
      processString(word);
      break;
    }
    case 5: {
      round++;
      message = "Last round!";
      showMessage();
      printStats();
      word = input("Enter your last guess ");
      processString(word);
      break;
    }
    default: {
      round++;
      message = "Round " + round;
      showMessage();
      printStats();
      word = input("Enter the next guess ");
      processString(word);
      break;
    }
  }
  if (round < 6 && keepPlaying !== false) {
    playRound();
  }
}
function fillGrid(word) {
  const wordArray = Array.from(word);
  printStats();
  game[round - 1] = wordArray;
  console.log(game);
}
function emptyGrid(grid) {
  let view = rowSeparator + "\n";
  for (let index = 0; index < grid.length; index++) {
    view = view + rowEmpty + "\n" + rowSeparator + "\n";
  }
  console.log(view);
}
function convertRow(gameRow) {
  if (typeof gameRow !== "undefined") {
    let gridRow = "| ";
    for (let index = 0; index < gameRow.length; index++) {
      gridRow = gridRow + gameRow[index] + " | ";
    }
    return gridRow + "\n" + rowSeparator + "\n";
  } else {
    return rowEmpty + "\n" + rowSeparator + "\n";
  }
}
function printStats() {
  console.log("inGame " + inGame + "\nkeepPlaying " + keepPlaying + "\nround " + round + "\ngame " + game);
}
function printGrid() {
  let view = rowSeparator + "\n";
  for (let index = 0; index < 6; index++) {
    view = view + convertRow(game[index]);
  }
  console.log(view);
}
//# sourceMappingURL=index.js.map

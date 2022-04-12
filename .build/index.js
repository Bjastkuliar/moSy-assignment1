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
const rs = "[0m";
const re = "[41m";
const gr = "[42m";
const ye = "[43m";
const bl = "[44m";
const ma = "[45m";
const cy = "[46m";
const wh = "[47m";
const input = (0, import_prompt_sync.default)();
const answers = (0, import_fs.readFileSync)("answers.txt", "utf-8").split("\n");
const words = (0, import_fs.readFileSync)("allwords.txt", "utf-8").split("\n");
const rowSeparator = "|---|---|---|---|---|";
const rowEmpty = "|   |   |   |   |   |";
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM";
const settingsTemplate = Object.freeze({
  msg: "Welcome",
  keepPlaying: true,
  wins: 0,
  losses: 0,
  hardMode: false
});
const gameTemplate = Object.freeze({
  msg: "",
  grid: [],
  keyboard: [],
  answer: "",
  round: 0,
  win: false
});
mainMenu();
function setMessage(settings, message) {
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
function mainMenu(settings = Object.freeze(__spreadValues({}, settingsTemplate))) {
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
      if (Object.hasOwn(data, "answer")) {
        return data;
      } else {
        return setMessage(data, "Game has not started yet!\nEnter a number to start a game.");
      }
    }
    case 4: {
      if (Object.hasOwn(data, "answer")) {
        return data;
      } else {
        return processCommand(word, data);
      }
    }
    case 1: {
      if (Object.hasOwn(data, "answer")) {
        return data;
      } else {
        return processNumber(word, data);
      }
    }
    default: {
      return setMessage(data, "Invalid input, please try again!");
    }
  }
}
function processCommand(input2, settings, game2) {
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
    let game2 = __spreadValues({}, gameTemplate);
    game2 = setAnswer(game2, answers[i]);
    return newGame(settings, game2);
  }
}
function setAnswer(game2, answer) {
  let tmp = __spreadValues({}, game2);
  tmp.answer = answer;
  return Object.freeze(tmp);
}
function setWin(settings) {
  let tmp = __spreadValues({}, settings);
  tmp.wins++;
  return Object.freeze(tmp);
}
function setLoss(settings) {
  let tmp = __spreadValues({}, settings);
  tmp.losses++;
  return Object.freeze(tmp);
}
function newGame(settings, game2) {
  const outcome = playGame(game2);
  if (typeof outcome !== "undefined") {
    if (outcome) {
      settings = setMessage(settings, "You Won!");
      settings = setWin(settings);
    } else {
      settings = setMessage(settings, `You Lost! The answer was ${game2.answer}`);
      settings = setLoss(settings);
    }
  }
  game2 = void 0;
  return settings;
}
function nextRound(game2) {
  let tmp = __spreadValues({}, game2);
  tmp.round++;
  return Object.freeze(tmp);
}
function updateGrid(game2, grid) {
  let tmp = __spreadValues({}, game2);
  tmp.grid = grid;
  return Object.freeze(tmp);
}
function updateKeyboard(game2, keyboard) {
  let tmp = __spreadValues({}, game2);
  tmp.keyboard = keyboard;
  return Object.freeze(tmp);
}
function playGame(game2) {
  while (game2.round < 6) {
    showMessage(game2.msg);
    printGrid(game2.grid);
    game2 = printKeyboard(game2);
    input();
    game2 = nextRound(game2);
    if (game2.win) {
      return true;
    } else {
      return false;
    }
  }
  return void 0;
}
function processWord(input2, game2) {
  if (words.includes(input2)) {
  } else {
    return setMessage(game2, "Word does not figure among those valid!");
  }
}
function fillGrid(word) {
  const wordArray = Array.from(word);
  game[round - 1] = wordArray;
  printGrid();
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
function printGrid(grid) {
  let view = rowSeparator + "\n";
  for (let index = 0; index < 6; index++) {
    view = view + convertRow(grid[index]);
  }
  console.log(view);
}
function printKeyboard(game2, keyboard) {
  let uK = new Array(3);
  if (typeof keyboard !== "object") {
    let tmp = keys.split("P");
    tmp[0] += "P";
    tmp = tmp.concat(tmp[1].split("L"));
    tmp.splice(1, 1);
    tmp[1] += "L";
    uK = tmp.map((row) => row.split(""));
    console.log(uK);
  }
  return updateKeyboard(game2, uK);
}
//# sourceMappingURL=index.js.map

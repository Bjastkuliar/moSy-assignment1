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
let hardMode = false;
let message;
readInput();
function readInput() {
  console.clear();
  if (typeof message !== "undefined") {
    console.log(message + "\n");
  }
  console.log("Welcome! To choose an answer ");
  console.log("or type QUIT to quit.");
  const i = input(`enter a number between 0 and ${answers.length} : `);
  if (isNaN(i)) {
    switch (i) {
      case "QUIT": {
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
        readInput();
        break;
      }
      case "HARD": {
        if (!hardMode) {
          message = "Hard mode enabled.";
          hardMode = true;
        } else {
          message = "Hard mode is already enabled!";
        }
        readInput();
        break;
      }
      case "HELP": {
        break;
      }
      case "STAT": {
        break;
      }
      default: {
        message = "What you entered is not a number!\nPlease try again!";
        readInput();
        break;
      }
    }
  } else {
    const n = parseInt(i);
    if (i < 0 || i > answers.length) {
      console.clear();
      console.log("The number is out of the valid range!");
      console.log("Please try again!\n");
      readInput();
    } else {
      console.log(`The word at index ${n} is ${words[n]}`);
      console.log(`The answer word at index ${n} is ${answers[n]}`);
      input("\npress enter to restart");
      readInput();
    }
  }
}
//# sourceMappingURL=index.js.map

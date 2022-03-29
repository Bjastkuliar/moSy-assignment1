// these are the two libraries we need
import prompt from 'prompt-sync'
import {readFileSync} from 'fs'

// these are some codes to get the console to print in colors
// see examples below
const Reset = "\x1b[0m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

const input = prompt();

// this is how to read data from the files
const answers:string[] = readFileSync('answers.txt', 'utf-8').split("\n")
const words: string[] = readFileSync('allwords.txt', 'utf-8').split("\n")

const rowSeparator: string = '|---|---|---|---|---|'
const rowEmpty: string = '|   |   |   |   |   |'
let message : string|undefined
let answer: string[]
let hardMode: boolean = false
let keepPlaying: boolean = true
let inGame: boolean = false
let round: number = 0
let wins: number = 0
let losses: number = 0
let game: string[][] = new Array(6)

//Step 1: User chooses answer (not known) --> random?
//Step 2: Setup game
//Step 3: Play
//Step 4: Win/Loss, add to stats

menu()

/*responsible of running the main menu*/
function menu(){
  while(keepPlaying){
    showMessage()
    const i = input(`enter a number between 0 and ${answers.length}: `)
    processString(i)
  }  
}

/*prints the message according to whether it is the
startup, the main menu or in-game, cases are sorted according to their usage*/
function showMessage(){
  //console.clear()
  if(typeof message !== 'undefined'){
     console.log(message+'\n')
    if(!inGame){
      console.log('Type HELP to list all the commands\nor type QUIT to quit.\nTo choose an answer ')
    }
  } else {
    console.log('Welcome!\n')
    console.log('Type HELP to list all the commands\nor type QUIT to quit.\nTo choose an answer ')
  }
}

/*Processes the input, by sorting it between words, commands or numbers. If it does not fall within these categories it is treated as invalid input*/
function processString(input: string){
  switch(input.length){
      //should be a grid input
    case 5:{
      processWord(input)
      break
    }
      //should be a command
    case 4:{
      processCommand(input)
      break
    }
      //should be a number
    case 1:{
      processNumber(input)
      break
    }
      //the rest is invalid
    default:{
      message = 'Invalid input, please try again!'
      break
    }
  }
}

/*process any given word in instructions,
provided that it is valid. Otherwise returns
an invalid input message*/
function processCommand(input: string) {
  inGame = false
  switch(input){
      case "QUIT":{
        keepPlaying = false
        console.clear()
        break
      }
        //both cases either switch the mode or do nothing
      case "EASY": {
        if(hardMode){
          message = 'Hard mode disabled.'
          hardMode = false
        } else {
          message = 'Hard mode is already disabled!'
        }
        break
      }
      case "HARD": {
        if(!hardMode){
          message = 'Hard mode enabled.'
          hardMode = true
        } else {
          message = 'Hard mode is already enabled!'
        }
        break
      }
        //prints the command list
      case "HELP": {
        message = 'The available commands are:\n'+
          'HELP       shows this list\nEASY/HARD  switches between easy and hard mode'+'\nSTAT       prints the statistics\nQUIT       exits the game'
        break
      }
      case "STAT": {
        message = `Current statistics:\n\n${wins}  games won\n${losses}  games lost`
        break
      }
        default:{
          message = 'Invalid command, please try again!'
          break
        }  
    }
}

/*process any single character word,
provided that it is a number, 
if so starts a new game. Otherwise returns
an invalid input message*/
function processNumber(input: string) {
  let i: number = parseInt(input)
  if(isNaN(i)){
    message = 'Invalid input, please try again!'
  } else {
    answer = Array.from(answers[i])
    newGame()
  }
}

/*inserts the word in the game-grid if the
game has started and it is valid, otherwise sends a warning.*/
function processWord(input: string) {
  if(inGame){
      if(words.includes(input)){
        fillGame(input)
      } else {
        message = 'Word does not figure among those valid!'
      }
  } else {
    message = 'Game has not started yet!\nEnter a number to start a game.'
  }
}

/*starts a new game*/
function newGame(){
  inGame = true
  round = 0
  let win: boolean = false 
  playRound()//let win = playRound()
  endGame(win)
}

/*Performs the closing operations of a game,
namely update statistics and reset the variables*/
function endGame(result: boolean) {
  message = 'Game has ended!'
  if(result){
    message+='\nYou Won!'
    wins++
  } else {
    message+='\nYou Lost!'
    losses++
  }  
  showMessage()
  showGrid()
  input('Press enter to continue')
  inGame = false
  round = 0
  game = new Array()
  message = undefined
  menu()
}

/*runs one round of the game*/
function playRound() {
  let word: string 
  switch(round){
    case 0:{
      message = 'New game has started!'
      showMessage()
      showGrid()
      word = input('Enter the first guess ')
      processString(word)
      break
    }
    case 5:{
      message = 'Last round!'
      showMessage()
      showGrid()
      word = input('Enter your last guess ')
      processString(word)
      break
    }
    default:{
      message = 'Round '+round
      showMessage()
      showGrid()
      word = input('Enter the next guess ')
      processString(word)
      break
    }
  }
  if(round < 6 && keepPlaying !== false){
    playRound()
  }
  //show table
  //show keyboard
  //await input
  //validate input
}

function fillGame(word: string) {
  const wordArray: string[] = Array.from(word)
  //printStats()
  game[round]= wordArray
  console.log(game)
  round++
}

function showGrid() {
  let view: string = rowSeparator+'\n'
  for (let index = 0; index < game.length; index++) {
    if(typeof game[index] !== 'undefined'){
      view = view + convertRow(game[index])
    } else {
      view = view + rowEmpty+'\n'+rowSeparator+'\n'
    }
  }
  console.log(view)
}

/*converts any provided array of strings into the
printable table format*/
function convertRow(gameRow : string[]): string {
  if(typeof gameRow !== 'undefined'){
    let gridRow: string = "| "
  for (let index = 0; index < gameRow.length; index++) {
    gridRow = gridRow + gameRow[index]+ " | "
  }
    return gridRow + '\n' + rowSeparator + '\n'
  } else {
    return rowEmpty + '\n' + rowSeparator + '\n'
  }
}

function printStats() {
  console.log('inGame '+inGame+'\nkeepPlaying '+keepPlaying+'\nround '+round+'\ngame '+game+
             '\ngame length '+game.length)
}

/*Converts the two-dimensional game array to
a formatted string table*/
function printGrid() {
  let view: string = rowSeparator+'\n'
  for (let index = 0; index < 6; index++) {
    view = view + convertRow(game[index])
  }
  console.log(view)
}

function printKeyboard() {
  let keyRowSep = '|---|---|---|---|---|---|---|---|---|'
}
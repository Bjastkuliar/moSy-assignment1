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
const keyboardSeparator = '|---|---|---|---|---|---|---|---|---|---|'
const keyboard = [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']]
let keyboardColour = [...keyboard]


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
  switch(input){
      case "QUIT":{
        inGame = false
        keepPlaying = false
        console.clear()
        break
      }
        //both cases either switch the mode or do nothing
      case "EASY": {
        inGame = false
        if(hardMode){
          message = 'Hard mode disabled.'
          hardMode = false
        } else {
          message = 'Hard mode is already disabled!'
        }
        break
      }
      case "HARD": {
        inGame = false
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
        inGame = false
        message = 'The available commands are:\n'+
          'HELP       shows this list\nEASY/HARD  switches between easy and hard mode'+'\nSTAT       prints the statistics\nQUIT       exits the game'
        break
      }
      case "STAT": {
        inGame = false
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
    answer = answers[i]
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

/*Performs the game initialization, instantiating or
reinstantiating the variables*/
function newGame(){
  inGame = true
  round = 0
  endGame(playRound())
}

/*Performs the closing operations of a game,
namely update statistics and reset the variables*/
function endGame(result: boolean) {
  message = 'Game has ended!'
  if(result){
    message+='\nYou Won!'
    wins++
  } else {
    message+=`\nYou Lost! The correct word was ${answer}`
    losses++
  }  
  showMessage()
  printGrid()
  input('Press enter to continue')
  inGame = false
  round = 0
  game = new Array(6)
  message = undefined
  menu()
}

/*runs one round of the game*/
function playRound(): boolean{
  let word: string 
  switch(round){
    case 0:{
      message = 'New game has started!'
      showMessage()
      printGrid()
      printKeyboard()
      word = input('Enter the first guess ')
      processString(word)
      break
    }
    case 5:{
      message = 'Last round!'
      showMessage()
      printGrid()
      printKeyboard()
      word = input('Enter your last guess ')
      processString(word)
      break
    }
    default:{
      message = 'Round '+round
      showMessage()
      printGrid()
      printKeyboard()
      word = input('Enter the next guess ')
      processString(word)
      break
    }
  }
  if(checkAnswer(word)){
    return true
  } else {
    if(round < 6 && keepPlaying !== false){
      return playRound()
    }
  }
}

/*inserts the word in the game array*/
function fillGame(word: string) {
  const wordArray: string[] = Array.from(word)
  //printStats()
  game[round]= wordArray
  console.log(game)
  round++
}

/*converts any provided array of strings into the
printable table format*/
function convertRow(gameRow : string[]): string {
  if(typeof gameRow !== 'undefined'){
    let gridRow: string = "| "
    for (let idx = 0; idx < gameRow.length; idx++) {
      gridRow = gridRow + gameRow[idx]+ " | "
    }
    return gridRow
  } else {
    return rowEmpty
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
  for (let idx = 0; idx < 6; idx++) {
    view = view + convertRow(game[idx])+'\n'+rowSeparator+'\n'
  }
  console.log(view)
}

/*loops over the keyboard array*/
function printKeyboard() {
  let keyGrid: string = keyboardSeparator+'\n'
  for(let idx = 0; idx<keyboard.length;idx++){
    keyGrid+=showKeyboard(idx)
  }
  console.log(keyGrid)
}

/*checks which line is requested by printKeyboard()
and acts accordingly, calling convertRow() on a
specific entry of the keyboardCopy array*/
function showKeyboard(index:number): string{
  switch(index){
    case 0:{
      return convertRow(keyboardColour[index])+'\n'+ keyboardSeparator+'\n'
    }
    case 1:{
      return convertRow(keyboardColour[index])+'  |'+'\n'+ keyboardSeparator+'\n'
    }
    case 2:{
      return '|   '+ convertRow(keyboardColour[index])+        '  |   |'+'\n'+ keyboardSeparator+'\n'
    }
    default: return 'error'
  }
}

/*processes the inserted word*/
function checkAnswer(input : string):boolean {
  if(input === answer){
    return true
  } else {
    return false
  }
}
//checks whether it is the correct word
//if not checks which letters figure in the solution and where, if they are in the correct place colour them green, otherwise yellow
//update keyboard, if letters enter in the answer paint them green, otherwise red
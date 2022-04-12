// these are the two libraries we need
import prompt from 'prompt-sync'
import {readFileSync} from 'fs'

// these are some codes to get the console to print in colors
// see examples below
const rs = "\x1b[0m"
const re = "\x1b[41m"
const gr = "\x1b[42m"
const ye = "\x1b[43m"
const bl = "\x1b[44m"
const ma = "\x1b[45m"
const cy = "\x1b[46m"
const wh = "\x1b[47m"

const input = prompt();

// this is how to read data from the files
const answers:string[] = readFileSync('answers.txt', 'utf-8').split("\n")
const words: string[] = readFileSync('allwords.txt', 'utf-8').split("\n")

const rowSeparator: string = '|---|---|---|---|---|'
const rowEmpty: string = '|   |   |   |   |   |'

const keys: string = 'QWERTYUIOPASDFGHJKLZXCVBNM'

const settingsTemplate: object = Object.freeze(
    {
      msg : 'Welcome',
      keepPlaying : true,
      wins : 0,
      losses: 0,
      hardMode: false
    }
  )

const gameTemplate: object = Object.freeze(
  {
    msg: '',
    grid: [],
    keyboard: [],
    answer: '',
    round : 0,
    win: false
  }
)

mainMenu()

function setMessage (settings: object, message: string): object{
  let tmp = {...settings}
  tmp.msg = message
  return Object.freeze(tmp)
}

function setMode(settings: object, mode: boolean): object{
  let tmp = {...settings}
  tmp.hardMode = mode
  return Object.freeze(tmp)
}

function playMore (settings: object, answer: boolean): object{
  let tmp = {...settings}
  tmp.keepPlaying = answer
  return Object.freeze(tmp)
}

/*starts the game by reading input and filtering 
if there are commands. Needed in order to handle 
each possible case of the input function*/
function mainMenu (settings : object = Object.freeze({...settingsTemplate})){
  while(settings.keepPlaying){
    showMessage(settings.msg)
    const i = input(`enter a number between 0 and ${answers.length}: `)
    settings = processString(i, settings)
  }
}

/*prints the message according to whether it is the
startup, the main menu or in-game*/
function showMessage(message : string, inGame : boolean = false){
  //console.clear()
  console.log(message+'\n')
    if(!inGame){
      console.log('Type HELP to list all the commands\nor type QUIT to quit.\nTo choose an answer ')
    }
}

/*Processes the input, by sorting it between words, commands or numbers. If it does not fall within these categories it is treated as invalid input*/
function processString(word: string, data: object|undefined):object{
  switch(word.length){
       /*this case can be accessed in 2 contexts, if we are in the main menu we need to signal an error, if we are in a game we have to validate the input word*/
    case 5:{
      //distinguish between game and settings
      if(Object.hasOwn(data,'answer')){
        //we are in a game
        return data
      } else {
        return setMessage(data,'Game has not started yet!\nEnter a number to start a game.')
      }
    }
    case 4:{
      //it's a command
      if(Object.hasOwn(data,'answer')){
        //we are in a game
        //quit the game and reopen the main menu
        return data
      } else {
        return processCommand(word,data)
      }
    }
    case 1:{
      //it's a number
       if(Object.hasOwn(data,'answer')){
        //we are in a game
        //quit the game and reopen main menu
        return data
      } else {
        return processNumber(word,data)
      }
    }
    default:{
      return setMessage(data, 'Invalid input, please try again!')
    }
  }
}

/*process any given word in instructions,
provided that it is valid. Otherwise returns
an invalid input message*/
function processCommand(input: string, settings: object, game : object|undefined): object{
  console.clear()
  switch(input){
      case "QUIT":{
        console.clear()
        return playMore(settings,false)
      }
        //both cases either switch the mode or do nothing
      case "EASY": {
        if(settings.hardMode){
          settings = setMessage(settings,'Hard mode disabled!')
          return setMode(settings, false)
        } else {
          return setMessage(settings,'Hard mode is already disabled!')
        }
      }
      case "HARD": {
        if(!settings.hardMode){
          settings = setMessage(settings,'Hard mode enabled.')
          return setMode(settings,true)
        } else {
          return setMessage(settings,'Hard mode is already enabled!')
        }
      }
        //prints the command list
      case "HELP": {
        return setMessage(settings,'The available commands are:\nHELP       shows this list\nEASY/HARD  switches between easy and hard mode\nSTAT       prints the statistics\nQUIT       exits the game')
      }
      case "STAT": {
        return setMessage(settings, `Current statistics:\n\n${settings.wins}  games won\n${settings.losses}  games lost`)
      }
    default:{
          return setMessage(settings, 'Invalid command, please try again!')
      }  
    }
}

/*process any single character word,
provided that it is a number, 
if so starts a new game. Otherwise returns
an invalid input message*/
function processNumber(word: string,settings: object):object{
  let i: number = parseInt(word)
  if(isNaN(i)){
    return setMessage(settings,'Invalid input, please try again!')
  } else {
    let game: object|undefined = {...gameTemplate}
    game = setAnswer(game, answers[i])
    return newGame(settings,game)
  }
}

function setAnswer(game: object, answer: string): object{
  let tmp = {...game}
  tmp.answer = answer
  return Object.freeze(tmp)
}

function setWin(settings: object): object{
  let tmp = {...settings}
  tmp.wins++
  return Object.freeze(tmp)
}

function setLoss(settings: object): object{
  let tmp = {...settings}
  tmp.losses++
  return Object.freeze(tmp)
}

function newGame(settings: object, game: object|undefined): object {
  const outcome: boolean|undefined = playGame(game)
  if(typeof outcome !== 'undefined'){
    if(outcome){
    settings = setMessage(settings, 'You Won!')
    settings = setWin(settings)
    } else {
      settings = setMessage(settings, `You Lost! The answer was ${game.answer}`)
      settings = setLoss(settings)
    }
  }
  
  game = undefined
  return settings
}

function nextRound(game: object):object{
  let tmp = {...game}
  tmp.round++
  return Object.freeze(tmp)
}

function updateGrid(game: object, grid: string[][]):object{
  let tmp = {...game}
  tmp.grid = grid
  return Object.freeze(tmp)
}

function updateKeyboard(game: object, keyboard: string[][]):object{
  let tmp = {...game}
  tmp.keyboard = keyboard
  return Object.freeze(tmp)
}

function playGame(game : object): boolean|undefined{
  while(game.round<6){
    showMessage(game.msg)
    printGrid(game.grid)
    game = printKeyboard(game)
    input()
    //validate the word
    game = nextRound(game)
    if(game.win){
      return true
    } else {
      return false
    }
  }
  return undefined
}

/*inserts the word in the game-grid if the
game has started and it is valid, otherwise sends a warning.*/
function processWord(input: string, game: object) {
  if(words.includes(input)){
      //fillGrid(input)
    } else {
      return setMessage(game,'Word does not figure among those valid!')
    }
}

function fillGrid(word: string) {
  const wordArray: string[] = Array.from(word)
  game[round-1]= wordArray
  printGrid()
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

function printGrid(grid: string[][]) {
  let view: string = rowSeparator+'\n'
  for (let index = 0; index < 6; index++) {
    view = view + convertRow(grid[index])
  }
  console.log(view)
}



function printKeyboard(game: object, keyboard: string[][]):object{
  let uK: string [][] = new Array(3)
  if(typeof keyboard !== 'object'){
    let tmp = keys.split('P')
    tmp[0]+='P'
    tmp = tmp.concat(tmp[1].split('L'))
    tmp.splice(1,1)
    tmp[1]+='L'
    uK = tmp.map(row => row.split(''))
  } else {
    uK = {...keyboard}
  }
  printGrid(uK)
  return updateKeyboard(game, uK)
}
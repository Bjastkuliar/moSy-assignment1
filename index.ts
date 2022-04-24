// these are the two libraries we need
import prompt from 'prompt-sync'
import {readFileSync} from 'fs'

// these are some codes to get the console to print in colors
// see examples below
const reset = "\x1b[0m"
const red = "\x1b[41m"
const green = "\x1b[42m"
const yellow = "\x1b[43m"

const input = prompt();

// this is how to read data from the files
const answers:string[] = readFileSync('answers.txt', 'utf-8').split("\n")
const words: string[] = readFileSync('allwords.txt', 'utf-8').split("\n")

const rowSeparator: string = '|---|---|---|---|---|'
const keySeparator: string = '|---|---|---|---|---|---|---|---|---|---|'
const rowEmpty: string = '|   |   |   |   |   |'

const keys: string = 'QWERTYUIOPASDFGHJKLZXCVBNM'

interface Settings{
  msg: string,
  keepPlaying?: boolean,
  wins?: number,
  losses?: number,
  hardMode?: boolean
  }

interface Game{
  msg?: string,
  grid?: string[][],
  keyboard?: string[][],
  answer: string,
  round: number,
  win?: boolean,
  inGame: boolean
  checked?: string[],
  partialAnswer?: string[]
  }

interface scoredChar{
    char: string,
    score: number,
    repeated?: boolean
}

mainMenu()

function setMessage (settings: Settings, message: string): Settings{
  let tmp = {...settings}
  tmp.msg = message
  return Object.freeze(tmp)
}

  function setGameMessage (settings: Game, message: string): Game{
  let tmp = {...settings}
  tmp.msg = message
  return Object.freeze(tmp) 
}

function setMode(settings: Settings, mode: boolean): Settings{
  let tmp = {...settings}
  tmp.hardMode = mode
  return Object.freeze(tmp)
}

function playMore (settings: Settings, answer: boolean): Settings{
  let tmp = {...settings}
  tmp.keepPlaying = answer
  return Object.freeze(tmp)
}

/*starts the game by reading input and filtering 
if there are commands. Needed in order to handle 
each possible case of the input function*/
function mainMenu (settings : Settings = {
  msg : 'Welcome', 
  keepPlaying : true,
  wins: 0,
  losses: 0
} ){
  while(settings.keepPlaying){
    showMessage(settings.msg)
    const i = input(`enter a number between 0 and ${answers.length}: `)
    settings = processString(i, settings) as Settings
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
function processString(word: string, data: Settings|Game):Settings|Game{
  switch(word.length){
       /*this case can be accessed in 2 contexts, if we are in the main menu we need to signal an error, if we are in a game we have to validate the input word*/
    case 5:{
      word = word.toLowerCase()
      //distinguish between game and settings
      if(data.hasOwnProperty('answer')){
        return validateWord(word, data as Game)
      } else {
        return setMessage(data as Settings,'Game has not started yet!\nEnter a number to start a game.')
      }
    }
    case 4:{
      //it's a command
      word = word.toUpperCase()
      if(data.hasOwnProperty('answer')){
        //we are in a game
        //quit the game and reopen the main menu
        if((data as Game).inGame){
           return exitGame(data as Game) as Game
         }
      } else {
        return processCommand(word,data as Settings)
      }
    }
    case 1:{
      //it's a number
       if(data.hasOwnProperty('answer')){
         if((data as Game).inGame ){
           return exitGame(data as Game)
         }
        //we are in a game
        //quit the game and reopen main menu
      } else {
        return processNumber(word,data as Settings)
      }
    }
    default:{
      return setMessage(data as Settings, 'Invalid input, please try again!')
    }
  }
}


/*process any given word in instructions,
provided that it is valid. Otherwise returns
an invalid input message*/
function processCommand(input: string, settings: Settings): Settings{
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
function processNumber(word: string,settings: Settings):Settings{
  let i: number = parseInt(word)
  if(isNaN(i)){
    return setMessage(settings,'Invalid input, please try again!')
  } else {
    let game: Game = {
      answer : answers[i],
      inGame: true,
      round: 0
    }
    return newGame(settings,game)
  }
}

function setWin(settings: Settings): Settings{
  let tmp = {...settings}
  if(typeof tmp.wins === 'undefined'){
    tmp.wins = 1
  } else {
    tmp.wins++
  }
  return Object.freeze(tmp)
}

function setLoss(settings: Settings): Settings{
  let tmp = {...settings}
  if(typeof tmp.losses === 'undefined'){
    tmp.losses = 1
  } else {
    tmp.losses++
  }
  return Object.freeze(tmp)
}

function exitGame(game: Game):Game {
  let tmp: Game = {...game}
  tmp.inGame = false
  return Object.freeze(tmp)
}

function correctChars(game:Game, guess: string): Game{
  let tmp = {...game}
  if(typeof tmp.partialAnswer === 'undefined'){
    tmp.partialAnswer = new Array()
  }
  for(let i = 0; i<guess.length; i++){
    if(game.answer.includes(guess.charAt(i))){
      if(tmp.partialAnswer.contains(guess.charAt(i))){
        tmp.partialAnswer.push(guess.charAt(i))
      }
    }
  }
  return Object.freeze(tmp)
}

function newGame(settings: Settings, game: Game): Settings {
  
  game = fillGrid(game)
  game = playGame(game)
  if(typeof game.win !== 'undefined'){
    if(game.win){
      game = setGameMessage(game, 'You Won!')
      settings = setMessage(settings, 'You Won!')
      settings = setWin(settings)
    } else {
      settings = setMessage(settings, `You Lost! The answer was ${game.answer}`)
      settings = setLoss(settings)
      game = setGameMessage(game,`You Lost! The answer was ${game.answer}`)
    }
  } else {
    game = setGameMessage(game,'Game exited!')
    settings = setMessage(settings, `Game exited!`)
  }
  showMessage(game.msg as string)
  printGrid(game.grid as string[][])
  input('Press enter to get back to main menu')
  return settings
}

function nextRound(game: Game):Game{
  let tmp = {...game}
  tmp.round++
  return Object.freeze(tmp)
}

function updateKeyboard(game: Game, keyboard: string[][]):Game{
  let tmp = {...game}
  tmp.keyboard = keyboard
  return Object.freeze(tmp)
}

function playGame(game : Game): Game{
  showMessage(game.msg as string)
  printGrid(game.grid as string[][])
  game = printKeyboard(game)
  console.log(`Round number: ${game.round}`)
  let word = input('Enter your guess: ')
  game = (processString(word, game)) as Game
  if(word === game.answer){ //game is won
    return win(game)
  } else { //game is still not beaten
    if(game.round<6){ //we still have rounds left
      if(game.inGame){ //we are still playing
        return playGame(game) //proceed with the next round
      } else { //we are no longer playing
        return game //user has inputted a number/command, exit the game
      }
    } else { //there are no rounds left
      return lost(game) //game is lost
    }
  }
}

function lost(game: Game): Game{
  let tmp = {...game}
  tmp.win = false
  return Object.freeze(tmp)
}

/*inserts the word in the game-grid if the
game has started and it is valid, otherwise sends a warning.*/
function validateWord(word: string, game: Game): Game{
  if(words.includes(word)){
    game = nextRound(game)
    game = fillGrid(game, word)
    return paintWord(word, game)
  } else {
    return setGameMessage(game,`${word} does not figure among valid words!`)
  }
}

function fillGrid(game: Game, word: string|undefined = undefined): Game{
  let tmp = {...game}
  if(typeof tmp.grid === 'undefined'){
    tmp.grid = new Array(6).fill(undefined)
  } else {
    if(typeof word!== 'undefined'){
      tmp.grid[tmp.round-1] = Array.from(word)
    }
  }
  return Object.freeze(tmp)
}

/*converts any provided array of strings into the
printable table format*/
function convertRow(gameRow : string[], separator: string): string {
  if(typeof gameRow !== 'undefined'){
    let gridRow: string = "| "
    gameRow.map(element=> gridRow+=element+ " | ")
    return gridRow + '\n' + separator + '\n'
  } else {
    return rowEmpty + '\n' + separator + '\n'
  }
}

function printGrid(grid: string[][]) {
  let view: string = ''
  if(grid.length === 3){ //is the keyboard
    view+=keySeparator+'\n'
    grid.map(row=> view+=convertRow(row, keySeparator))
  } else { //is the grid
    view+=rowSeparator+'\n'
    grid.map(row=> view+=convertRow(row, rowSeparator))
  }
  console.log(view)
}

function printKeyboard(game: Game):Game{
  let uK: string [][]
  if(typeof game.keyboard === 'undefined'){
    let tmp = keys.split('P')
    tmp[0]+='P'
    tmp = tmp.concat(tmp[1].split('L'))
    tmp.splice(1,1)
    tmp[1]+='L '
    tmp[2]=' '+tmp[2]+'  '
    uK = tmp.map(row => row.split(''))
  } else {
    uK = [...game.keyboard]
  }
  printGrid(uK)
  return updateKeyboard(game, uK)
}

function paintWord(word: string, game: Game): Game{
  if(word !== game.answer){
    /*We need to handle cases in which either the answer or the word have duplicate characters. There are four possible cases, either the answer has/hasn't duplicates and/or the word has/hasn't duplicates. We need only to handle the case in which the answer has no duplicate while the word has some, because the other cases are automatically handled by the default case*/
    for(let idx = 0; idx<word.length; idx++){
      let char = word.charAt(idx)
      if(char===game.answer.charAt(idx)){ //key is in correct place
        game = paintKeyboard(char,green,game)
        game = paintGrid(char, green, game)
        //paint the key in the gamegrid/keyboard green
      } else {        
        if(game.answer.includes(word.charAt(idx))){ //key is misplaced
          if(count(word, char)>1){
            let scoredWord: scoredChar[] = scoreWord(word, game)
            if(idx !== maxScorePos(char, scoredWord)-1){
              game = paintKeyboard(char,green,game)
              game = paintGrid(char,reset,game)
            } 
          } else {
            game = paintKeyboard(char,green,game)
            game = paintGrid(char,yellow,game)
            //paint the key in the gamegrid/keyboard yellow
          }
        } else { //key is not included
          //paint the remaining keys red on the keyboard
          game = paintKeyboard(char,red,game)
          }
        }      
      }
    
  } else {
    for(let idx = 0; idx<word.length; idx++){
      let char = word.charAt(idx)
      game = paintKeyboard(char,green,game)
      game = paintGrid(char, green, game)
    }
  }
  return game
}

function scoreWord(word: string, game: Game): scoredChar[]{
    let arr : scoredChar[] = new Array(word.length).fill(undefined)

    for(let idx = 0; idx<word.length; idx++){
        let char : scoredChar = {
            char: word.charAt(idx),
            score:0
        }
        char.repeated = count(word,char.char)>1
    
        if(game.answer.charAt(idx) === word.charAt(idx)){
            char.score = 2
        } else {
            if(game.answer.includes(char.char)){
            char.score = 1
            }
        }
        arr.splice(idx,1,char)
    }
    return arr
}

function hasDoubles(word: string): boolean{
  let lowercase: string = word.toLocaleLowerCase()
  let set : Set<string> = new Set(lowercase)
  if(lowercase.length === set.size){
    return false
  } else {
    return true
  }
}

function win(game: Game): Game{
  let tmp: Game = {...game}
  tmp.win = true
  return Object.freeze(tmp)
}

function paintKeyboard(char: string, colour: string, game: Game): Game{
  let tmp = {...game}
  tmp.keyboard = paintK(char,tmp.keyboard as string[][],colour)
  return Object.freeze(tmp)
}

function paintGrid(char: string, colour: string, game: Game): Game{
  let tmp = {...game}
  tmp.grid = paintG(char,tmp.grid as string [][],colour)
  return Object.freeze(tmp)
}

function paintK(char: string, data: string[][], colour: string): string[][]{
  let letter: string = char.toUpperCase()
  let tmp : string[][] = [...data]
  for(let idx = 0; idx<tmp.length;idx++){
    let row = tmp[idx]
    if(row.includes(letter)){
      row[row.indexOf(letter)]= colour+letter+reset
    }
  }
  return tmp
}

function paintG(char: string, data: string[][], colour: string): string[][]{
  let tmp : string[][] = [...data]
  for(let idx = 0; idx<tmp.length;idx++){
    let row = tmp[idx]
    if(typeof row !== 'undefined' && row.includes(char)){
      row[row.indexOf(char)]= colour+char+reset
    }
  }
  return tmp
}

function count(word: string, c: string): number { 
  var result = 0, i = 0;
  for(i;i<word.length;i++)if(word[i]==c)result++;
  return result;
};

function maxScorePos(char: string, scoredWord: scoredChar[]):number{
    let maxScorePos = 0
    for(let idx = 0; idx<scoredWord.length;idx++){
        if(scoredWord[idx].char === char){
            maxScorePos = idx
        }
    }
    return maxScorePos+1
}
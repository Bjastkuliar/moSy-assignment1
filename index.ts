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

/*
// this is how we get data from the user
const yesOrNo = input('Want to see some colors (yes or no)?')

if(yesOrNo === "yes") {
  // this is how you could print in colors
  console.log('|---|---|---|---|---|---|')
  console.log(`|${BgYellow} W ${Reset}| O |${BgGreen} R ${Reset}| D |${BgYellow} L ${Reset}| E |`)
  console.log('|---|---|---|---|---|---|')
} else {
  console.log("not a problem")
}*/

// this is how to read data from the files
const answers:string[] = readFileSync('answers.txt', 'utf-8').split("\n")
const words: string[] = readFileSync('allwords.txt', 'utf-8').split("\n")

let hardMode: boolean = false
let message : string

//Step 1: User chooses answer (not known) --> random?
//Step 2: Setup game
//Step 3: Play
//Step 4: Win/Loss, add to stats


// this is how to read an integer, if needed
// but be careful about incorrect inputs 

readInput()

//reads input and filters if there 
function readInput (){
  console.clear()
  if(typeof message !== "undefined"){
    console.log(message+'\n')
  }
  console.log('Welcome! To choose an answer ')
  console.log('or type QUIT to quit.')
  const i = input(`enter a number between 0 and ${answers.length} : `)
  if(isNaN(i)){
    switch(i){
        case "QUIT":{
          console.clear()
          break
        }
      case "EASY": {
        if(hardMode){
          message = 'Hard mode disabled.'
          hardMode = false
        } else {
          message = 'Hard mode is already disabled!'
        }
        readInput()
        break
      }
      case "HARD": {
        if(!hardMode){
          message = 'Hard mode enabled.'
          hardMode = true
        } else {
          message = 'Hard mode is already enabled!'
        }
        readInput()
        break
      }
      case "HELP": {
        break
      }
      case "STAT": {
        break
      }
        default:{
          message = 'What you entered is not a number!\nPlease try again!'
          readInput()
          break
        }  
    }
  } else {
    const n = parseInt(i)
    if(i<0 || i> answers.length){
      console.clear()
      console.log('The number is out of the valid range!')
      console.log('Please try again!\n')
      readInput()
    } else {
      console.log(`The word at index ${n} is ${words[n]}`)
      console.log(`The answer word at index ${n} is ${answers[n]}`)
      input("\npress enter to restart")
      readInput()
    }  
  }
}

// feel free to delete all the starter you don't need after you understand how to use it.  
// after this the program quits
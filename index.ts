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

//Step 1: User chooses answer (not known) --> random?
//Step 2: Setup game
//Step 3: Play
//Step 4: Win/Loss, add to stats


// this is how to read an integer, if needed
// but be careful about incorrect inputs 
console.log('Welcome! To choose an answer ')
const i = input(`enter a number between 0 and ${answers.length} :  `)
if(isNaN(i)){
  console.log('What you entered is not a number!')
} else {
  const n = parseInt(i)
  if(i<0 || i> answers.length){
    console.log('The number is out of the valid range!')
  } else {
    console.log(`The word at index ${n} is ${words[n]}`)
    console.log(`The answer word at index ${n} is ${answers[n]}`)
  }  
}


// this is how to clear the console
input("press enter to clear the console")
console.clear()

// feel free to delete all the starter you don't need after you understand how to use it.  
// after this the program quits
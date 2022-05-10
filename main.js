//Task 1: Create global variables and import prompt and clear input from package
const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const row = 10;
const col = 10;

/*Task 2: Create Field Class with constructor for the game
-> Build the whole field out (10 row x 10 col), create 2D Array, contract the layout of the field using empty array
*/

//Create Field Class with constructor for the game, Classes are template for object and Javascript calls a constructor method when we create a new instance of the class, 'this' refers to an instance of the class, use 'this' to set the value of the Field instance's properties and methods (generate field, run game, print, ask question)
class Field {
    //the field/plot/space/empty area will help to construct the layout of the field using empty aarray
    field = [];

    constructor() {
        
        this.locationX = 0;
        this.locationY = 0;
        
        /*Create a 1-dimensional array first to hold the game field
        -> 1st dimension will just encapsulate everything (plot), we need to create individual empty arrays (2D) later in generateField Method when putting in the patches of grass in the plot
        -> loop ten times, everytime, I will create one more array for each row
        arr[a] = [], e.g. arr[0] is the first row , and for arr[0] first row, I create an empty array list in the first row,
        arr[1], empty array in second row
        arr[2], empty array in third row
        ...
        arr[9], empty array in tenth row
        Ouput:
        [
        [],
        [],
        [],
        ...
        [] array created in the 10th row, 9th index
        ]
        */

        for (let a = 0; a < row; a++) {
            this.field[a] = [];
        }

        /*generateField method i.e. similar to generating the patches of grass in the plot 
        -> set the probability of holes to 0.2 which is 20% and pass in as the argument to the generateField method
        -> If random number > 0.2, I will generate a field character, If random number < 0.2, I will generate a hole
        */
        this.generateField(row, col, 0.2);  
    } //End of Constructor 

    //Task 3: Create generateField Method in the Field Class. 3a - generate the rows and columns with field characters and holes, 3b - set the hat at random position and not at home position 3c - set the home position of the path character

    // If someone is calling the generateField method with only height and width arguments with no probablity specified, the default value of percentage is 0.1
    generateField(height, width, percentage = 0.1) {
        //3a - Use nested for loop to create a 2D array with the random generation of field characters and holes
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                //Generate random holes 
                const prob = Math.random();
                //Ternary Operator - similar to 'if-else'
                //condition: prob of holes generation > percentage you set above? If condition executes to true, generate field character. If false, generate hole. 
                this.field[y][x] = prob > percentage ? fieldCharacter : hole
            }
        }//End of nested for loop to generate fieldCharacter and hole

        //3b - Set the hat '^' location randomly & ensure that it is not at starting location
        let hatX = Math.floor(Math.random() * width); // 0 to 9, Math.random gives a number btw 0 and 1, and Math.floor rounds down to the nearest no. i.e. 0.99*10 rounded down to max 9.
        let hatY = Math.floor(Math.random() * height); 

        //Ensure hat is not at home/starting location
        //Use a while loop to check condition, everytime hatX === 0 and hatY === 0, hatX and hatY will be regenerated, giving a new hat position
        while (hatX === 0 && hatY === 0) {
            hatX = Math.floor(Math.random() * width);
            hatY = Math.floor(Math.random() * height);
          }
        
        //Set position of hat
        this.field[hatY][hatX] = hat; 

        // 3c - Set the "home" position as [0][0] before the game starts
        this.field[0][0] = pathCharacter;
    }//End of generate field method

    //Task 4: 4a - Create runGame, 4b - print, 4c - askQuestion, 4d - isInBound Methods for the game
    //4a - Create runGame
    runGame() {
        let playing = true; //Set boolean
        while(playing) {
            this.print(); //As long as playing is true, run/call both methods print and askQuestion, Playing false, stop game.
            this.askQuestion();

            //Use else if statements to control state of the game
            if (!this.isInBounds()) {
                //out of boundaries, return false to stop the game
                console.log('Out of bounds - Game End! Stay in zone next time!');
                playing = false;
                break;
              } else if (this.field[this.locationY][this.locationX] === hole) {
                //hole, return false to stop the game
                console.log('Sorry, you fell down a hole! - Game End!');
                playing = false;
                break;
              } else if (this.field[this.locationY][this.locationX] === hat) {
                //won, return false to stop the game
                console.log('Congrats, you found your hat!');
                playing = false;
                break;
              } else {
                //Update the current position of pathCharacter on game screen 
                this.field[this.locationY][this.locationX] = pathCharacter; 
              }
        }
    }

    //4b Print Field - Convert each row in array into a string and add line breaks for each row
    print() {
        //Clear console
        clear();
        const displayString = this.field.map(row => {
            //.join('') remove the commas and join the characters without spacing & .join('\n') will return a new line with every row
            return row.join('');
          }).join('\n');
        console.log(displayString);
    }

    //4c - askQuestion
    askQuestion() {
        const answer = prompt("Which way? Enter U:up, D:down, L:left, R:Right").toUpperCase();
        /*Use switch keyword to vary the position of pathCharacter based on user input, case keyword checks if the expression matches the specified value that comes after it, break keyword tells the computer to exit the block and not execute anymore code checks. At the end of the switch statement, there is a default statement which will run if none of the cases are true. Make use of mathematical assignment operators += -= *= /=*/
        switch(answer) {
            case "U": 
                this.locationY -= 1; //Move up one row, locationY = locationY -1 
                break;
            case "D": 
                this.locationY += 1; //Move down one row
                break;
            case "L":
                this.locationX -= 1; //Move left one index
                break;
            case "R":
                this.locationX += 1; //Move right one index
                break; 
            default:
                console.log("Enter U:up, D:down, L:left, R:Right");
                this.askQuestion();
                break; 
        }
    }

    //4d - Set boundaries for the field/plot (isInBound)
    isInBounds() {
        //use if conditional to return true/false
        if (
          this.locationY >= 0 &&
          this.locationY < col &&
          this.locationX >=0 &&
          this.locationX < row 
        ) {
            return true;
        }
        return false;
    }
    
 
}//End of Class

//Task 5: Instantiate (generate new instance of) Field Class to initialise constructor and generate rows and columns from the generateField Method. Call runGame Method to run the game
const myField = new Field();
myField.runGame();






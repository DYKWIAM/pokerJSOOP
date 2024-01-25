const prompt = require('prompt-sync')();
const fs = require('fs');

let COLORS = {
  BOLD: "\u001b[1m",
  RED: "\u001b[31m",
  GREEN: "\u001b[32m",
  BLUE: "\u001b[34m",
  CYAN: "\u001b[36m",
  RESET: "\x1b[0m"
};

class Player {
  constructor(name, money) {
    this.name = name;
    this.money = money;
  }
}

let filePath = 'saveFile.txt';
let player1 = new Player();
let player2 = new Player('Dealer',1000000,);
let table =[];//is an array of objects of suits and ranks of our poker cards.

function checkFileExistsIfNotCreateOn() {
  if (fs.existsSync(filePath)) {
    console.log('File exists');
  } else {
    console.log('File does not exist. Creating...');
    fs.writeFileSync(filePath, 'test text to save');
    console.log('File created successfully');
  }
}

function writeObjectToFile(filePath, dataObject) {
  let jsonString = JSON.stringify(dataObject, null, 2);
  fs.writeFileSync(filePath, jsonString);
}

function startNewGame() {
  let typeName = prompt(COLORS.BOLD + COLORS.CYAN + 'Type in Player name: ');
  player1.name = typeName;
  player1.money = 10000;
  writeObjectToFile(filePath, player1);
  console.log(`${player1.name} was created with ${player1.money}$`);
}

function loadPlayer() {
  //first read the file
  let fileContent = fs.readFileSync(filePath, 'utf8');
  //search for money in everyline
  let moneyLine = fileContent.match(/"money": (\d+)/);
  //change from string to number
  let amountOfMoney = moneyLine ? parseInt(moneyLine[1]) : null;

  //move the content of the txt file to array split by \n 
  let arr = fileContent.split('\n');
  let count = 1;
  let runWhileLoop = 0;

  //runt a while loop and match the user input with the array above see if name is found.
  //then set the class player. name and money from the file.
  while(runWhileLoop==0){
    let searchTerm = prompt('Type in Player name to Load: ');
    let regex = new RegExp(`\\b${searchTerm}\\b`);
    for (let lines of arr) {
        if (regex.test(lines)) {
          player1.name = searchTerm;
          player1.money = amountOfMoney;
          console.log(`The Line in File ${COLORS.GREEN}does${COLORS.RESET} contain the word "${searchTerm}" and players have ${amountOfMoney}$`);
          runWhileLoop = 1;
        } else {
          count++;
          console.log(`The Line in File ${COLORS.RED}does Not${COLORS.RESET} contain the word "${searchTerm}". Trying line ${count}`);
        }
      }
      count = 1;
      console.log("Try Again.");
    
  }
  
}



//now lets make the poker set.
let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {//Creates a Deck
    let deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  
function shuffleDeck(deck) {// Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  
function dealCards(deck, players, cardsPerPlayer) {// Deal cards to players and on the table(but keep the table hidden to start with)
    let hands = {};
    for (let player of players) {
      hands[player] = [];
      for (let i = 0; i < cardsPerPlayer; i++) {
        hands[player].push(deck.pop());
      }
    }
    table.push(deck.pop());// the first 
    table.push(deck.pop());// the      second
    table.push(deck.pop());// the             third cards that are shown in first round of poker
    table.push(deck.pop());// the 4th card    single card shown in second round
    table.push(deck.pop());// the 5th card    single card shown in third round
    return hands;
  }


//poker logic for every set and which hand wins.
  const HAND_CARD_RANK = [
    'High Card',
    'One Pair',
    'Two Pair',
    'Three of a Kind',
    'Straight',
    'Flush',
    'Full House',
    'Four of a Kind',
    'Straight Flush',
    'Royal Flush'
  ];

  //----------this below is our data we use to determind the strategy or function to show who or what hand wins.
  //hand of 'Player 1': [ { suit: 'Spades', rank: 'Q' }, { suit: 'Spades', rank: '3' } ],        
  //hand of 'Player 2': [ { suit: 'Clubs', rank: '7' }, { suit: 'Clubs', rank: '10' } ]

  //the SUITS ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  //the RANKS ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  /*[------------------------these are cards on the table---------that
    { suit: 'Diamonds', rank: '9' },
    { suit: 'Spades', rank: 'A' },
    { suit: 'Clubs', rank: 'A' },
    { suit: 'Hearts', rank: '2' },
    { suit: 'Diamonds', rank: '2' }
  ]*/
  /*Poker logic hand evaluate






  */



//we show the player the cards he/she has and let them bet
//the house will bet the same and total bet is shown with the hands.
function whoWins(hands){
    console.log(COLORS.CYAN + COLORS.BOLD +`${player1.name}\'s hand: ${hands["Player 1"][0].rank} of ${hands["Player 1"][0].suit}, ${hands["Player 1"][1].rank} of ${hands["Player 1"][1].suit}${COLORS.RESET}`)
    console.log("Player 2\'s hand is hidden.\n");
    
    let totalBet = 0;
    while(true)
    {    
        let yourBet = prompt("Place your Bet: ");
        if(yourBet<player1.money)
        {       
            player1.money = player1.money-yourBet;
            player2.money = player2.money-yourBet;
            totalBet += (yourBet*2);
            
            console.log(`###### ${COLORS.CYAN+COLORS.BOLD}Total Bet: ${totalBet}$ ${COLORS.RESET}$ 
            \n###### ${player1.name} has ${player1.money}$ left
            \n###### Dealer has ${player2.money}$ left`)
            break;
        }else console.log(`Sry Not Enough Credit. Amout left: ${player1.money}`)   
    }

    writeObjectToFile(filePath, player1);
}

  // sets the game up
function playPoker() {
    let deck = createDeck();
    shuffleDeck(deck);

    let players = ['Player 1', 'Player 2'];
    let cardsPerPlayer = 2;

    let hands = dealCards(deck, players, cardsPerPlayer);
    whoWins(hands, players);
    
  }
 //read the file to array for later checking against name/money


 //simple menu with 2 options  first: start register new game or 2 Load game from file.
function menu() {
    let logo =`  
    ____       _             
   |  _ \\ ___ | | _____ _ __ 
   | |_) / _ \\| |/ / _ \\ '__|
   |  __/ (_) |   <  __/ |   
   |_|   \\___/|_|\\_\\___|_|      
                             `;
  console.log(COLORS.GREEN + COLORS.BOLD + logo);
  console.log(COLORS.RED + COLORS.BOLD + '#'.repeat(30) + COLORS.RESET);
  console.log(COLORS.BLUE + COLORS.BOLD + 'Press 1 Start New Game' + COLORS.RESET);
  console.log(COLORS.BLUE + COLORS.BOLD + 'Press 2 Load Player' + COLORS.RESET);
  console.log(COLORS.RED + COLORS.BOLD + '#'.repeat(30) + COLORS.RESET);

  let choice = prompt(COLORS.BLUE + COLORS.BOLD + 'Choice:' + COLORS.RESET);

  if (choice == 1) {
    startNewGame();
  } else if (choice == 2) {
    
    loadPlayer();
  }
}


checkFileExistsIfNotCreateOn();
menu();
console.log('#'.repeat(40));
playPoker();
console.log(table)
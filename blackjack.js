let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true;

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();

    document.getElementById("restart").addEventListener("click", restartGame);
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum = getValue(hidden);
    dealerAceCount = checkAce(hidden);

    let hiddenImg = document.createElement("img");
    hiddenImg.src = "./cards/BACK.png";
    hiddenImg.id = "hidden";
    document.getElementById("dealer-cards").append(hiddenImg);

    let card = deck.pop();
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    updateSums();

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    if (!canHit) return;

    let card = deck.pop();
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    updateSums();

    if (yourSum > 21) {
        canHit = false;
        stay();
    }
}

function stay() {
    canHit = false;

    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    while (dealerSum < 17) {
        let card = deck.pop();
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        updateSums(true);
    }

    updateSums(true);

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21) {
        message = "You Win!";
    } else if (yourSum === dealerSum) {
        message = "It's a Tie!";
    } else if (yourSum > dealerSum) {
        message = "You Win!";
    } else {
        message = "You Lose!";
    }

    document.getElementById("results").innerText = message;
}

function restartGame() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("results").innerText = "";
    document.getElementById("dealer-sum").innerText = 0;
    document.getElementById("your-sum").innerText = 0;

    buildDeck();
    shuffleDeck();
    startGame();
}

function getValue(card) {
    let value = card.split("-")[0];
    if (value === "A") return 11;
    if (["K", "Q", "J"].includes(value)) return 10;
    return parseInt(value);
}

function checkAce(card) {
    return card.split("-")[0] === "A" ? 1 : 0;
}

function updateSums(showDealer = false) {
    document.getElementById("your-sum").innerText = yourSum;
    if (showDealer) {
        document.getElementById("dealer-sum").innerText = dealerSum;
    } else {
        const visibleValue = dealerSum - getValue(hidden);
        document.getElementById("dealer-sum").innerText = visibleValue;
    }
}

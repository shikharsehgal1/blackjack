const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let chips = 0;
let currentBet = 0;

// Initialize the deck
function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank, value: getCardValue(rank) });
    }
  }
  shuffle(deck);
}

// Shuffle the deck
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Get card value
function getCardValue(rank) {
  if (rank === "A") return 11;
  if (["J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank);
}

// Deal a card
function dealCard(hand) {
  const card = deck.pop();
  hand.push(card);
  return card;
}

// Calculate hand score
function calculateScore(hand) {
  let score = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter(card => card.rank === "A").length;

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

// Display the cards
function displayCards(hand, elementId) {
  const area = document.getElementById(elementId);
  area.innerHTML = hand.map(card => `<span>${card.rank}${card.suit}</span>`).join(" ");
}

// Update scores
function updateScores() {
  playerScore = calculateScore(playerHand);
  dealerScore = calculateScore(dealerHand);
  document.getElementById("player-score").textContent = `Score: ${playerScore}`;
  document.getElementById("dealer-score").textContent = `Score: ${dealerScore}`;
}

// Update chips display
function updateChips() {
  document.getElementById("chips").textContent = chips;
}

// Check game result
function checkResult() {
  const result = document.getElementById("result");
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;

  if (playerScore > 21) {
    result.textContent = "You busted! Dealer wins.";
    chips -= currentBet;
  } else if (dealerScore > 21) {
    result.textContent = "Dealer busted! You win.";
    chips += currentBet;
  } else if (dealerScore >= 17) {
    if (playerScore > dealerScore) {
      result.textContent = "You win!";
      chips += currentBet;
    } else if (playerScore < dealerScore) {
      result.textContent = "Dealer wins.";
      chips -= currentBet;
    } else {
      result.textContent = "It's a tie!";
    }
  }

  updateChips();
  checkChips();
  setTimeout(() => {
    resetForNextRound();
  }, 2000); // Delay to allow the user to see the result
}

// Check if player is out of chips
function checkChips() {
  if (chips <= 0) {
    document.getElementById("betting-section").style.display = "none";
    document.getElementById("rebuy-section").style.display = "block";
  }
}

// Dealer plays
function dealerTurn() {
  while (dealerScore < 17) {
    dealCard(dealerHand);
    displayCards(dealerHand, "dealer-cards");
    updateScores();
  }
  checkResult();
}

// Start a new round
function startRound() {
  playerHand = [];
  dealerHand = [];
  playerScore = 0;
  dealerScore = 0;

  dealCard(playerHand);
  dealCard(playerHand);
  dealCard(dealerHand);

  displayCards(playerHand, "player-cards");
  displayCards(dealerHand, "dealer-cards");
  updateScores();

  document.getElementById("result").textContent = "";
  document.getElementById("game-area").style.display = "block";
  document.getElementById("betting-section").style.display = "none";
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
}

// Reset UI for next round
function resetForNextRound() {
  document.getElementById("game-area").style.display = "none";
  document.getElementById("betting-section").style.display = "block";
}

// Event listeners
document.getElementById("hit-btn").addEventListener("click", () => {
  dealCard(playerHand);
  displayCards(playerHand, "player-cards");
  updateScores();
  if (playerScore > 21) checkResult();
});

document.getElementById("stand-btn").addEventListener("click", () => {
  dealerTurn();
});

document.getElementById("place-bet").addEventListener("click", () => {
  const betInput = parseInt(document.getElementById("bet").value);
  if (betInput > 0 && betInput <= chips) {
    currentBet = betInput;
    startRound();
  } else {
    alert("Invalid bet amount.");
  }
});

document.getElementById("start-game").addEventListener("click", () => {
  const buyinInput = parseInt(document.getElementById("buyin").value);
  if (buyinInput >= 10) {
    chips = buyinInput;
    updateChips();
    document.getElementById("buyin-section").style.display = "none";
    document.getElementById("game-section").style.display = "block";
  } else {
    alert("Buy-in must be at least 10 chips.");
  }
});

document.getElementById("rebuy-game").addEventListener("click", () => {
  const rebuyInput = parseInt(document.getElementById("rebuy").value);
  if (rebuyInput >= 10) {
    chips = rebuyInput;
    updateChips();
    document.getElementById("rebuy-section").style.display = "none";
    document.getElementById("betting-section").style.display = "block";
  } else {
    alert("Buy-in must be at least 10 chips.");
  }
});

// Start the game hidden
createDeck();

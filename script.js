const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let chips = 0;

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

// Check game result
function checkResult() {
  const result = document.getElementById("result");

  if (playerScore > 21) {
    result.textContent = "You busted! Dealer wins.";
    chips -= 10;
    updateChips();
    endGame();
  } else if (dealerScore > 21) {
    result.textContent = "Dealer busted! You win.";
    chips += 10;
    updateChips();
    endGame();
  } else if (dealerScore >= 17) {
    if (playerScore > dealerScore) {
      result.textContent = "You win!";
      chips += 10;
    } else if (playerScore < dealerScore) {
      result.textContent = "Dealer wins.";
      chips -= 10;
    } else {
      result.textContent = "It's a tie!";
    }
    updateChips();
    endGame();
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

// End game
function endGame() {
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
}

// Restart game
function restartGame() {
  createDeck();
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
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
}

// Update chips display
function updateChips() {
  document.getElementById("chips").textContent = chips;
}

// Event listeners
document.getElementById("hit-btn").addEventListener("click", () => {
  dealCard(playerHand);
  displayCards(playerHand, "player-cards");
  updateScores();
  checkResult();
});

document.getElementById("stand-btn").addEventListener("click", () => {
  dealerTurn();
});

document.getElementById("restart-btn").addEventListener("click", restartGame);

document.getElementById("start-game").addEventListener("click", () => {
  const buyinInput = document.getElementById("buyin").value;
  chips = parseInt(buyinInput);
  if (chips >= 10) {
    document.getElementById("buyin-section").style.display = "none";
    document.getElementById("game-section").style.display = "block";
    restartGame();
    updateChips();
  } else {
    alert("Buy-in must be at least 10 chips.");
  }
});

// Start the game hidden
createDeck();

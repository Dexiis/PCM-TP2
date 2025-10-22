// Blackjack OOP
let game = null; // Stores the current instance of the game

const CARD_DRAW_DELAY = 250;

$(document).ready(function () {
  $("#hit").click(playerNewCard);
  $("#stand").click(dealerFinish);
  $("#new_game").click(newGame);
});

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
  document.getElementById("debug").innerHTML = JSON.stringify(obj); // Displays the state of the object as JSON
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
  document.getElementById("hit").disabled = false; // Enables the button to draw a card
  document.getElementById("stand").disabled = false; // Enables the button to stand
  document.getElementById("new_game").disabled = true; // Disables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
  document.getElementById("hit").disabled = true; // Disables the button to draw a card
  document.getElementById("stand").disabled = true; // Disables the button to stand
  document.getElementById("new_game").disabled = false; // Enables the button for a new game
}

/**
 * Clears the page to start a new game.
 */
function clearPage() {
  clearElement("player");
  clearElement("dealer");
  updateScore(0, 0);
}

/**
 * Starts a new game of Blackjack.
 */
function newGame() {
  buttonsInitialization();
  clearPage();
  game = new Blackjack(); // Creates a new instance of the Blackjack game
  //debug(game); // Displays the current state of the game for debugging

  initGame();
}

function initGame() {
  dealerNewCard();

  setTimeout(() => {
    playerNewCard();

    setTimeout(() => {
      dealerNewCard();

      setTimeout(() => {
        playerNewCard();

        game.getDealerCards()[1].setUpsideDown(true);
        updateDealer(game.getGameState());
      }, CARD_DRAW_DELAY); // Delay before player's second card
    }, CARD_DRAW_DELAY); // Delay before dealer's second card
  }, CARD_DRAW_DELAY); // Delay before player's first card
}

/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function finalScore(state) {
  const modal = new bootstrap.Modal($("#gameResultModal"));
  let result = "";

  if (state.playerWon) result = "PLAYER WINS";
  else if (state.dealerWon) result = "DEALER WINS";
  else if (state.playerBusted) result = "PLAYER BUST";
  else if (state.dealerBusted) result = "DEALER BUST";
  else result = "PUSH";

  $("#end-message").text(result);

  finalizeButtons();
  modal.show();
}

/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
  const dealerElement = document.getElementById("dealer");

  clearElement("dealer");
  for (let dealerCard of game.getDealerCards()) {
    printCard(dealerElement, dealerCard, false);
  }

  updateScore(game.getPlayerPoints(), game.getDealerPoints());

  if (state.gameEnded) finalScore(game.getGameState());
}

/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
  const playerElement = document.getElementById("player");

  clearElement("player");
  for (let playerCard of game.getPlayerCards()) {
    printCard(playerElement, playerCard, false);
  }

  if (
    game.getPlayerPoints() === Blackjack.MAX_POINTS ||
    game.state.playerBusted
  ) {
    game.setDealerTurn(true);
    dealerFinish();
  }
  updateScore(game.getPlayerPoints(), game.getDealerPoints());

  //debug(game);

  return state;
}

/**
 * Causes the dealer to draw a new card.
 * @returns {Object} - The game state after the dealer's move.
 */
function dealerNewCard() {
  game.dealerMove();
  updateDealer(game.getGameState());

  const $newCard = $("#dealer img:last-child");

  $newCard.css("left", "300px");
  $newCard.css("bottom", "800px");

  $newCard.animate(
    {
      left: "0px",
      bottom: "0px",
    },
    300
  );

  return game.getGameState();
}

/**
 * Causes the player to draw a new card.
 * @returns {Object} - The game state after the player's move.
 */
function playerNewCard() {
  game.playerMove();
  updatePlayer(game.getGameState());

  const $newCard = $("#player img:last-child");

  $newCard.css("left", "300px");
  $newCard.css("bottom", "800px");

  $newCard.animate(
    {
      left: "0px",
      bottom: "0px",
    },
    350
  );

  return game.getGameState();
}

/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
  game.getDealerCards()[1].setUpsideDown(false);

  dealerDrawSequence();
}

function dealerDrawSequence() {
  if (
    game.getCardsValue(game.getDealerCards()) < Blackjack.DEALER_MAX_TURN_POINTS
  ) {
    setTimeout(() => {
      dealerNewCard();

      dealerDrawSequence();
    }, CARD_DRAW_DELAY);
  }
}

/**
 * Prints the card in the graphical interface.
 * @param {HTMLElement} element - The element where the card will be displayed.
 * @param {Card} card - The card to be displayed.
 * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
 */
function printCard(element, card, replace = false) {
  const cardImage = document.createElement("img");
  cardImage.src = card.getImagePath();
  cardImage.alt = `${card.getRank()} of ${card.getSuit()}`;
  cardImage.style.width = "150px";
  cardImage.style.marginRight = "-100px";
  cardImage.style.position = "relative";

  element.appendChild(cardImage);
}

function clearElement(elementId) {
  const parentElement = document.getElementById(elementId);

  if (parentElement) {
    parentElement.innerHTML = "";
  }
}

function updateScore(playerPoints, dealerPoints) {
  document.getElementById("player-points").innerHTML = String(playerPoints);
  document.getElementById("dealer-points").innerHTML = String(dealerPoints);
}

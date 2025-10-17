// Card class
class Card {
  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
    this.upsideDown = false;
  }

  getRank() {
    const rank = this.number;

    if (rank === 1) return "Ace";
    else if (rank === 11) return "Jack";
    else if (rank === 12) return "Queen";
    else if (rank === 13) return "King";
    else return String(rank);
  }

  getSuit() {
    switch (this.suit) {
      case 0:
        return "Hearts";
      case 1:
        return "Diamonds";
      case 2:
        return "Spades";
      case 3:
        return "Clubs";
    }
  }
}

// Blackjack object
/**
 * Class that represents the Blackjack game.
 */
class Blackjack {
  // Constant that defines the maximum points to avoid busting in Blackjack
  static MAX_POINTS = 25;
  // Constant that defines the point threshold at which the dealer must stand
  static DEALER_MAX_TURN_POINTS = 21;

  static DECK_SIZE = 52;
  static SUIT_NUMBER = 4;
  static CARD_NUMBER = 13;

  /**
   * Creates an instance of Blackjack and initializes the deck.
   */
  constructor() {
    this.dealerCards = []; // Array to hold the dealer's cards
    this.playerCards = []; // Array to hold the player's cards
    this.dealerTurn = false; // Flag to indicate if it's the dealer's turn to play

    // State of the game with information about the outcome
    this.state = {
      gameEnded: false, // Indicates whether the game has ended
      playerWon: false, // Indicates if the player has won
      dealerWon: false, // Indicates if the dealer has won
      playerBusted: false, // Indicates if the player has exceeded MAX_POINTS
      dealerBusted: false, // Indicates if the dealer has exceeded MAX_POINTS
    };

    // Initialize the deck of cards
    this.deck = this.shuffle(this.newDeck()); // Create and shuffle a new deck
    //console.log(this.deck);
  }

  /**
   * Creates a new deck of cards.
   * @returns {Card[]} - An array of cards.
   */
  newDeck() {
    let newDeck = [];
    for (let suit = 0; suit < Blackjack.SUIT_NUMBER; suit++) {
      for (let number = 0; number < Blackjack.CARD_NUMBER; number++) {
        newDeck.push(new Card(number + 1, suit)); // Append the card to the deck
      }
    }
    return newDeck;
  }

  /**
   * Shuffles the deck of cards.
   * @param {Card[]} deck - The deck of cards to be shuffled.
   * @returns {Card[]} - The shuffled deck.
   */
  shuffle(deck) {
    for (let i = Blackjack.DECK_SIZE - 1; i >= 0; i--) {
      const number = Math.floor(Math.random() * (i + 1)); // Number from 0 to i
      [deck[i], deck[number]] = [deck[number], deck[i]]; // Swap deck[i] for deck[number] and vice versa
    }
    return deck;
  }

  /**
   * Returns the dealer's cards.
   * @returns {Card[]} - An array containing the dealer's cards.
   */
  getDealerCards() {
    return this.dealerCards.slice(); // Return a copy of the dealer's cards
  }

  /**
   * Returns the player's cards.
   * @returns {Card[]} - An array containing the player's cards.
   */
  getPlayerCards() {
    return this.playerCards.slice(); // Return a copy of the player's cards
  }

  /**
   * Sets whether it is the dealer's turn to play.
   * @param {boolean} val - Value indicating if it's the dealer's turn.
   */
  setDealerTurn(val) {
    this.dealerTurn = val; // Update the dealer's turn status
  }

  /**
   * Calculates the total value of the provided cards.
   * @param {Card[]} cards - Array of cards to be evaluated.
   * @returns {number} - The total value of the cards.
   */
  getCardsValue(cards) {
    let value = 0;
    let acesNumber = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].number > 1 && cards[i].number < 11) {
        // 2-10
        value += cards[i].number;
      } else if (cards[i].number > 10) {
        // Jack, Queen and King
        value += 10;
      } else if (cards[i].number === 1) {
        // Aces
        acesNumber++;
      }
    }

    value += acesNumber * 11; // Apply aces as 11 points intially

    while (acesNumber > 0 && value > Blackjack.MAX_POINTS) {
      // Best use of the aces - Prevents busting
      value -= 10;
      acesNumber--;
    }

    return value;
  }

  /**
   * Executes the dealer's move by adding a card to the dealer's array.
   * @returns {Object} - The game state after the dealer's move.
   */
  dealerMove() {
    const newCard = this.deck.pop();
    this.dealerCards.push(newCard);

    return this.getGameState();
  }

  /**
   * Executes the player's move by adding a card to the player's array.
   * @returns {Object} - The game state after the player's move.
   */
  playerMove() {
    const newCard = this.deck.pop();
    this.playerCards.push(newCard);

    return this.getGameState();
  }

  //TODO: Implement this method
  /**
   * Checks the game state based on the dealer's and player's cards.
   * @returns {Object} - The updated game state.
   */
  getGameState() {

    this.state.playerBusted =
      this.getCardsValue(this.getPlayerCards()) > Blackjack.MAX_POINTS;

    this.state.dealerBusted =
      this.getCardsValue(this.getDealerCards()) > Blackjack.MAX_POINTS;

    return this.state;
  }
}

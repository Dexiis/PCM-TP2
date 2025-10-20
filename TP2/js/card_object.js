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

  getImagePath() {
    const rank = this.getRank().toLowerCase();
    const suit = this.getSuit().toLowerCase();
    let imagePath;
    if (this.upsideDown) {
      imagePath = "img/svg/card_back.svg";
    } else {
      if (this.number > 10) {
        imagePath = `img/svg/${rank}_of_${suit}2.svg`;
      } else {
        imagePath = `img/svg/${rank}_of_${suit}.svg`;
      }
    }
    return imagePath;
  }
}

$(document).ready(function(){

	////////////////////////////////
	//////////MAIN VARIABLES////////
	///////////////////////////////
	// A fresh, perfect ordered deck of cards
	const freshDeck = createDeck();
	// We will keep all player/dealer cards in this array
	var playersHand = [];
	var dealersHand = [];
	var theDeck = freshDeck.slice();     //Slice will grab each element and put in the new array so that freshDeck is not mutated

	////////////////////////////////
	//////////EVENT HANDLERS////////
	///////////////////////////////

	$('.deal-button').click(function(){
		// The deal stuff happens here...
		// Here. theDeck is still a copy of the freshDeck
		// shuffleDeck();
		// Here, theDeck is shuffled, no longer in order of freshDeck
		// console.log(theDeck);
		// console.log(freshDeck);
		reset();

		// We have a shuffled deck, ad the 1 and 3 card to the playersHand and the DOM
		playersHand.push(theDeck.shift());  // Remove top card and give to player
		dealersHand.push(theDeck.shift()); // Remove (next) top card and give to dealer
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());

		// Change the DOM to add images
		// placeCard(DoM name of who, card-X for slot, card value to send)
		placeCard('player', 1, playersHand[0]);
		placeCard('player', 2, playersHand[1]);

		placeCard('dealer', 1, dealersHand[0]);
		placeCard('dealer', 2, dealersHand[1]);

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');
	});

	$('.hit-button').click(function(){
		// Hit functionality
		// Player wants a new card. This means:
		// 1. shift OFF theDeck
		// 2. push on the playersHand
		// 3. Run placeCard to put the new card (image) in the DoM
		// 4. Run calculateTotal to find out the new hand total

		if(calculateTotal(playersHand, 'player') < 21){
			playersHand.push(theDeck.shift()); // This covers 1. and 2.
			var lastCardIndex = playersHand.length - 1;
			var slotForNewCard = playersHand.length;
			placeCard('player',slotForNewCard,playersHand[lastCardIndex]);
			calculateTotal(playersHand, 'player'); // 4.
		}
	});

	$('.stand-button').click(function(){
		// On click stands...
		// Player has given control over to the dealer
		// Dealer MUST hit until dealer has 17 or more
		var dealerTotal = calculateTotal(dealersHand,'dealer');
		while(dealerTotal < 17){
			// Hit works the same...
			// 1. Push card from top of deck onto dealers hand
			// 2. update DoM
			// 3. Update dealerTotal
			dealersHand.push(theDeck.shift());
			var lastCardIndex = dealersHand.length - 1;
			var slotForNewCard = dealersHand.length;
			placeCard('dealer',slotForNewCard,dealersHand[lastCardIndex]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		checkWin();
	});

	///////////////////////////////////////////////
	////////////////UTLITITY FUNCTIONS//////////////
	//////////////////////////////////////////////

	function reset(){
		// In order to reset the game:
		//1. Reset the deck
		theDeck = freshDeck.slice();
		shuffleDeck();
		//2. Reset the player hands
		playersHand = [];
		dealersHand = [];

		//3. Reset the cards in the DOM
		$('.card').html('');
		// 4. Reset the totals
		$('.dealer-total-number').html('0');
		$('.player-total-number').html('0');
		$('.message').text('');

	}


	function checkWin(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		var winner = "";
		if(playerTotal > 21){
			winner = "You busted. Dealer wins";
		}else if(dealerTotal > 21){
			winner = "Dealer has busted. You win"
		}else{
			if(playerTotal > dealerTotal){
				winner = "You beat the dealer";
			}else if(playerTotal < dealerTotal){
				winner = "The dealer has bested you. The House always wins!";
			}else{
				winner = "PUSH!"
			}
		}
		$('.message').text(winner);
	}


	function calculateTotal(hand,who){
		// console.log(hand);
		// hand will be an array (either playersHand or dealersHand)
		// who will be what the DOM knows the player as (dealer or player)
		var totalHandValue = 0;
		var thisCardValue = 0;
		var hasAce = false;
		var totalAces = 0;
		for(let i = 0; i < hand.length; i++){
			thisCardValue = Number(hand[i].slice(0,-1));

			if(thisCardValue > 10){
				thisCardValue = 10;
			}else if(thisCardValue == 1){
				// this is Ace!
				hasAce= true;
				totalAces++;
				thisCardValue = 11;

			}

			totalHandValue += thisCardValue;
		}
		for(let i = 0; i < totalAces; i++){
			if(totalHandValue > 21){
				totalHandValue -= 10
			}
		}
		
		// We have the total now update the DOM
		var totalToUpdate = '.' + who + '-total-number';
		$(totalToUpdate).html(totalHandValue);
		return totalHandValue;
	}


	function placeCard(who,where,what){
		// Find the DOM elements based on the arg that we want to Change
		// i.e, find the element tat we want to put the image in
		var slotForCard = '.' + who + '-cards .card-' + where;
		// console.log(slotForCard)
		imageTag = '<img src="cards/' + what + '.png">';
		$(slotForCard).html(imageTag);
		// $(slotForCard).addClass('dealt'). ///////ANIMATION
	}


	function createDeck(){
		var newDeck = [];
		// Two loops, one for suit, one for card value
		var suits = ['h','s','d','c'];
		// Outter loop which itereates the suit/letter
		for(let s = 0; s < suits.length; s++){
			// Inner loop which iterates the values/number
			for(let c = 1; c <= 13; c++){
				// Push onto newDeck array, the value[c] + suit[s]
				newDeck.push(c + suits[s]);
			}
		}
		return newDeck;
	}

	function shuffleDeck(){
		for(let i = 0; i < 14000; i++){
			var random1 = Math.floor(Math.random() * 52);
			var random2 = Math.floor(Math.random() * 52);
			// Store in temp, the value at index random1, in array theDeck
			var temp = theDeck[random1];
			// Overwrite 
			theDeck[random1] = theDeck[random2];
			// Overwrite
			theDeck[random2] = temp;
		}
	}
});

















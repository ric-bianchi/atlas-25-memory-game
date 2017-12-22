// ATLAS 25 Memory Game
// (C) 2017 Riccardo Maria Bianchi
// License -- MIT
// Forked from: Nate Wiley @ Codepen
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function(){

	$.getJSON("http://www.riccardomariabianchi.com/atlas-25-memory-game/cards.json", function(json) {

		
	//console.log(json); // this will show the info it in firebug console, for DEBUG

	var cards = json['cards'];
		
	var Memory = {

		init: function(cards){
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			this.cardsArray = $.merge(cards, cards);
			this.shuffleCards(this.cardsArray);
			this.setup();
			this.binding();
		},

		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		setup: function(){
			this.html = this.buildHTML();
			this.$game.html(this.html);
			this.$memoryCards = $(".card");
			this.paused = false;
     		this.guess = null;
     		
     		// hide content that should be showed later
			this.$infoButtons = this.$game.find(".cardinfobutton");
			this.$infoButtons.hide();
			this.$game.find(".watermark").hide();
			this.$game.find(".hidden-id").hide();
			this.$game.find(".infolinkwrap").unwrap();
			
			
			// Switch ON debug modes
			//Memory.showModal(); // show modal "The End" popup on start screen, for DEBUG
			//Memory.debugModeFlipAll(); // show cards' back-side on start screen, for DEBUG
			//Memory.debugModeShowId(); // show id on the back of the cards, for DEBUG
			
			
		},

		binding: function(){
			this.$memoryCards.on("click", this.cardClicked);
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},
		// kinda messy but hey
		cardClicked: function(){
			var _ = Memory;
			var $card = $(this);
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				
				// set the card as 'picked' and show the 'front' side (the image)
				$card.find(".inside").addClass("picked"); 
				
				// if 'guess' is not set, this is the first card; so, set 'guess' as to the 'id' of the card
				// and add 'guess' to the card
				if(!_.guess){
					_.guess = $(this).attr("data-id"); 
					$card.find(".inside").addClass("guess"); 
				} 
				// this is the second card. If here, that means we found the matching pair
				else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){

					// add 'guess' to the matching card
					$card.find(".inside").addClass("guess"); 

					// add 'matched' to all cards with class 'picked'
					$(".picked").addClass("matched"); 

					// show the info buttons on matched cards
					//$(".picked").find(".cardinfobutton").show(); // not needed anymore, but we use the URL link still...
					$(".picked").find(".watermark").show();
					
					// get the link to the popup from the matching card
					var linkUrl = $card.find(".infolink").attr("href");
					
					// wrap both the two matching cards in a anchor link to the right popup
					$(".guess").wrap( '<a href="' + linkUrl + '"></a>');
					

					// reset the 'guess'
					_.guess = null;
					$(".guess").removeClass("guess");
				}
				// no matching pair, we reset the cards
				else { 
					_.guess = null;
					_.paused = true;
					setTimeout(function(){
						$(".picked").removeClass("picked");
						$(".guess").removeClass("guess");
						Memory.paused = false;
					}, 600);
				}
				
				// if # matched equal to # cards, we won!
				if($(".matched").length == $(".card").length){
					_.win();
				}
			}
		},

		win: function(){
			this.paused = true;
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		showModal: function(){
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		reset: function(){
			this.hideModal();
			this.shuffleCards(this.cardsArray);
			this.setup();
			this.$game.show("slow");
		},

		// Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
	   		// While there are elements in the array
	   		while (counter > 0) {
        			// Pick a random index
        			index = Math.floor(Math.random() * counter);
        			// Decrease counter by 1
        			counter--;
        			// And swap the last element with it
        			temp = array[counter];
        			array[counter] = array[index];
        			array[index] = temp;
	    		}
	    		return array;
		},

		buildHTML: function(){
			var frag = '';
			
			var classFormat = "horizontal";
			
			this.$cards.each(function(k, v){

				var picFormat = v.format;
				if (picFormat == "h") classFormat = "horizontal";
				else if (picFormat == "v") classFormat = "vertical";

				// create a single card
				frag += ''
                  + '<div class="card" data-id="'+ v.id +'">'
				  + '<div class="inside">'
				    + '<div class="front">'
				        + '<img src="'+ v.img +'"alt="'+ v.name +'" />'
				        + '<div class="watermark centered">'
				          // TODO: you should adjust the size of the icon depending on the screen size: for mobile, 4x is too large...
				      	  + '<i class="fa fa-info-circle fa-4x" aria-hidden="true"></i>'
				        + '</div>'
				        + '<div class="cardinfobutton"><a class="infolink" href="#popup' + v.id + '"></a></div>' // dummy anchor to store the link to the popup
				    + '</div>'
				    + '<div class="back"><img src="assets/cards/logo/ATLAS25_noBkg_small.png" alt="The ATLAS Experiment logo" />'
				      + '<div class="hidden-id">'+v.id+'</div>'
				    + '</div>'
				  + '</div>'
				  + '</div>';
				  
				 // append to the body an info box for the card
				 var infoDiv = $(''
			            + '<div id="popup' + v.id + '" class="infooverlay">'
			              // target anchor to close the popup when clicking outside of it
			              + '<a class="cancel" href="#"></a>'
				          + '<div class="infopopup">'
					        + '<div class=infotop>'
						      + '<div class="infoclose-wrapper"><a class="infoclose" href="#">&times;</a></div>'
					          + '<div class="infonumber"><h1>Card n. ' + v.id + '</h1></div>'
					          + '<div class="infotitle"><h1>' + v.year + ' - ' + v.title + '</h1></div>'
					        + '</div>' // infotop
					        +'<div class="info-copyright"><p>Text: &copy; 2017 <a href="http://www.riccardomariabianchi.com">Riccardo Maria Bianchi</a></p></div>'
					        + '<div class="info-source"><p>Image: ATLAS Experiment &copy; CERN, source: <a href="' + v.link + '">CERN CDS</a></p></div>'
					        + '<div class="allnotespicture"><a href="'+ v.link +'"><img class="popup-picture lazy ' + classFormat + '" data-src="' + v.img + '" alt="' + v.title + '"></a></div>'
					        + '<div class="infocontentwrapper'+v.id+' infocontentwrapper"></div>'
				          + '</div>' // infopopup
				        +'</div>' // infooverlay
				).attr('id', 'popup'+v.id);
				infoDiv.appendTo('body');
				
				// Set the content for the info box, taking HTML from an external file
				$('div.infocontentwrapper'+v.id).load('assets/cards_info/card_'+v.id+'_info.html');
				
			});
			return frag;
		},
	
		debugModeFlipAll: function() {
			// set the card as 'picked' and show the 'inside' (the image)
			$(".card").find(".inside").addClass("picked"); 
			// show the info buttons on all 'picked' cards
			$(".picked").find(".cardinfobutton").show();
		},
		
		debugModeShowId: function() {
			// show the 'id' on the back of the cards (where the logo is)
			$(".card").find(".hidden-id").show();
		}

	};

	Memory.init(cards); // necessary, to actually load the cards
				
	// Load all the lazy content
	$(function() {
        $('.lazy').Lazy();
    });
	
	
	}); // end of getJSON()

})(); // end of the outer function

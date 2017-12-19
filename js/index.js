// ATLAS 25 Memory Game
// (C) 2017 Riccardo Maria Bianchi
// License -- MIT
// Forked from: Nate Wiley @ Codepen
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function(){

	$.getJSON("http://www.riccardomariabianchi.com/atlas-25-memory-game/cards.json", function(json) {

		
	console.log(json); // this will show the info it in firebug console

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
			
			
			//Memory.showModal(); // show modal "The End" popup on start screen, for DEBUG
			//Memory.debugMode(); // show cards' back-side on start screen, for DEBUG
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
				if(!_.guess){
					_.guess = $(this).attr("data-id"); 
				} 
				// this is the second card. If here, that means we found the matching pair
				else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){

					// add 'matched' to all cards with class 'picked'
					$(".picked").addClass("matched"); 

					// show the info buttons on matched cards
					//$(".picked").find(".cardinfobutton").show(); // not needed anymore, but we use the URL link still...
					$(".picked").find(".watermark").show();
					
					//console.log($(".picked").find(".infolink").attr("href"));
					var linkUrl = $(".picked").find(".infolink").attr("href");
					$(".picked").wrap('<a href="' + linkUrl + '"></a>');
					

					// reset the 'guess'
					_.guess = null; 
				}
				// no matching pair, we reset the cards
				else { 
					_.guess = null;
					_.paused = true;
					setTimeout(function(){
						$(".picked").removeClass("picked");
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
			
			var infoImg = "assets/cards/Info-Button-300px.png"
			
			this.$cards.each(function(k, v){

				var picFormat = v.format;
				if (picFormat == "h") classFormat = "horizontal";
				else if (picFormat == "v") classFormat = "vertical";

				// create a single card
				frag += '<div class="card" data-id="'+ v.id +'">'
				  + '<div class="inside">'
				    + '<div class="front">'
				      + '<img src="'+ v.img +'"alt="'+ v.name +'" />'
				      + '<div class="watermark">'
				      	+ '<img src="' + infoImg + '">'
			              //+ '<p><a href="#popup1">info</a></p>'
				      + '</div>'
				      + '<div class="cardinfobutton"><a class="infolink" href="#popup' + v.id + '"><i class="fa fa-info-circle" aria-hidden="true"></i></a></div>'
				    + '</div>'
				    + '<div class="back"><img src="assets/cards/logo/ATLAS25_noBkg_small.png" alt="The ATLAS Experiment logo" />'
				    + '</div>'
				  + '</div>'
				  + '</div>';
				  
				 // append to the body an info box for the card
				 var infoDiv = $(''
			            + '<div id="popup' + v.id + '" class="infooverlay">'
				      + '<div class="infopopup">'
					  + '<div class=infotop>'
						  + '<div class="infoclose-wrapper"><a class="infoclose" href="#">&times;</a></div>'
					      + '<div class="infonumber"><h1>Card n. ' + v.id + '</h1></div>'
					      + '<div class="infotitle"><h1>' + v.year + ' - ' + v.title + '</h1></div>'
					  + '</div>'
					  + '<div class="allnotespicture"><a href="'+ v.link +'"><img class="lazy ' + classFormat + '" data-src="' + v.img + '" alt="' + v.title + '"></a></div>'
					  +'<div class="info-copyright"><p>Text: &copy; 2017 <a href="http://www.riccardomariabianchi.com">Riccardo Maria Bianchi</a></p></div>'
					  + '<div class="info-source"><p>Image: ATLAS Experiment &copy; CERN, source: <a href="' + v.link + '">CERN CDS</a></p></div>'
					  + '<div class="infocontentwrapper'+v.id+' infocontentwrapper"></div>'
				      + '</div>'
				    +'</div>'
				).attr('id', 'popup'+v.id);
				infoDiv.appendTo('body');
				
				// Set the content for the info box, taking HTML from an external file
				$('div.infocontentwrapper'+v.id).load('assets/cards_info/card_'+v.id+'_info.html');
				
			});
			return frag;
		},
	
		/*
		hideInfoButtons: function() {
			$(".cardinfobutton").hide();

		}
		*/
		
		debugMode: function() {
			// set the card as 'picked' and show the 'inside' (the image)
			$(".card").find(".inside").addClass("picked"); 
			// show the info buttons on all 'picked' cards
			$(".picked").find(".cardinfobutton").show();
		}

	};

	Memory.init(cards); // necessary, to actually load the cards
				
	// Load all the lazy content
	$(function() {
        $('.lazy').Lazy();
    });
	
	
	}); // end of getJSON()

})(); // end of the outer function

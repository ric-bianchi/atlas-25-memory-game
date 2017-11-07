// ATLAS 25 Memory Game
// (C) 2017 Riccardo Maria Bianchi
// License -- MIT
// Forked from: Nate Wiley @ Codepen
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function(){

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
			this.$infoButtons = this.$game.find(".cardinfobutton");
			this.$infoButtons.hide();
			//Memory.showModal(); // show on start screen, for DEBUG
			Memory.debugMode(); // show on start screen, for DEBUG
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
					$(".picked").find(".cardinfobutton").show();

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
			this.$cards.each(function(k, v){

				// create a single card
				frag += '<div class="card" data-id="'+ v.id +'">'
				  + '<div class="inside">'
				    + '<div class="front">'
				      + '<img src="'+ v.img +'"alt="'+ v.name +'" />'
			              //+ '<p><a href="#popup1">info</a></p>'
				      + '<div class="cardinfobutton"><a href="#popup' + v.id + '"><i class="fa fa-info-circle" aria-hidden="true"></i></a></div>'
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
					  +'<div class="info-copyright"><p>&copy; 2017 Riccardo Maria Bianchi</p></div>'
					  + '<div class="info-source"><p>Image source: <a href="' + v.link + '">CERN CDS</a>, ATLAS Experiment © 2017 CERN</p></div>'
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



	var cards = [
		{
			name: "LOI",
			img: "assets/cards/timeline/1_1992_ATLAS_LOI.jpg",
			id: 1,
			year: "1992",
			title: "The birth of the ATLAS Experiment",
			link: "https://cdsweb.cern.ch/record/291061/",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "cavern",
			img: "assets/cards/timeline/2_2003_cavern.jpg",
			id: 2,
			year: "2003",
			title: "The den of the giant is ready!",
			link: "http://cds.cern.ch/record/620604",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "firstmagnet",
			img: "assets/cards/timeline/3_2004_building_toroid.jpg",
			id: 3,
			year: "2004",
			title: "Lowering the first magnet",
			link: "https://cds.cern.ch/record/802466",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "toroid",
			img: "assets/cards/timeline/4_2005_toroid.jpg",
			id: 4,
			year: "2005",
			title: "A huge detector!",
			link: "https://cds.cern.ch/record/910381",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "physicists",
			img: "assets/cards/timeline/5_2008_ATLAS_physicists.jpg",
			id: 5,
			year: "2008",
			title: "From all over the world to work together towards a common goal",
			link: "http://cds.cern.ch/record/1110951",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "muonsmallwheels",
			img: "assets/cards/timeline/6_2008_MuonSmallWheels.jpg",
			id: 6,
			year: "2008",
			title: "The last pieces",
			link: "https://cds.cern.ch/record/1082464",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "h4mu",
			img: "assets/cards/timeline/7_2011_event_display_4muons.jpg",
			id: 7,
			year: "2011",
			title: "4 muons for a Higgs boson",
			link: "https://cds.cern.ch/record/1406057",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "higgsseminar",
			img: "assets/cards/timeline/8_2012_HiggsEnglert.jpg",
			id: 8,
			year: "2012",
			title: "The BIG announcement!",
			link: "https://cds.cern.ch/record/1459503",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "celebration",
			img: "assets/cards/timeline/9_2012_higgs_celebration.jpg",
			id: 9,
			year: "2012",
			title: "A toast for the Higgs boson!",
			link: "https://cds.cern.ch/record/1475204",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "h2e2mu",
			img: "assets/cards/timeline/10_2014_event_display_H2e2mu.png",
			id: 10,
			year: "2014",
			title: "Selecting, cross-checking, and verifying",
			link: "http://cds.cern.ch/record/1756226",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "heavyions",
			img:"assets/cards/timeline/11_2015_event_display_HI.png",
			id: 11,
			year: "2015",
			title: "A pinch of lead ions, for the primordial taste!",
			link: "https://cds.cern.ch/record/2115422/",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
		{
			name: "ibl",
			img:"assets/cards/timeline/12_2017_upgrade.jpg",
			id: 12,
			year: "2017",
			title: "Upgrading the experiment, towards new challenges",
			link: "https://cds.cern.ch/record/1702006",
			info: "<p>Some text...</p><plus a <a>http://atlas.cern</a></p>"
		},
	];

	Memory.init(cards);
				

})();

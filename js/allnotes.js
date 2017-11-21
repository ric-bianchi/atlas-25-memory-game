




(function(){


	$.getJSON("http://www.riccardomariabianchi.com/atlas-25-memory-game/cards.json", function(json) {
		
		console.log(json); // this will show the info it in firebug console

		var cards = json['cards'];

		var AllNotes = {

				init: function(cards){
					this.$content = $(".content");
//					this.cardsArray = $.merge(cards, cards);
//					this.$cards = $(this.cardsArray);
					this.setup();
				},

				// setup: this function calls all 
				// the other functions needed to setup the page
				setup: function(){
					this.html = this.buildHTML();
					this.$content.html(this.html);
					this.$memoryCards = $(".card");
					this.loadHTML();
				},
				
				
				buildHTML: function(){
					var frag = '';
					
					$.each(cards, function(k, v){
						
						// create a single card section
						frag += ''
//							+ '<div id="popup' + v.id + '" class="infooverlay whitebkg">'
							+ '<div class="infopopup">'
							+ '<div class=infotop>'
//							+ '<div class="infoclose-wrapper"><a class="infoclose" href="#">&times;</a></div>'
							+ '<div class="infonumber"><h1>Card n. ' + v.id + '</h1></div>'
							+ '<div class="infotitle"><h1>' + v.year + ' - ' + v.title + '</h1></div>'
							+ '</div>'
//							+ '<div class="allnotespicture"><a href="'+ v.link +'"><img src="' + v.img + '" alt="' + v.title + '"></a></div>'
							+ '<div class="allnotespicture"><a href="'+ v.link +'"><img class="lazy" data-src="' + v.img + '" alt="' + v.title + '"></a></div>'
							+ '<div class="info-source"><p>Image: ATLAS Experiment &copy; 2017 CERN, source: <a href="' + v.link + '">CERN CDS</a></p></div>'
							+ '<div class="infocontentwrapper'+v.id+' infocontentwrapper"></div>'
							+ '</div>'
//							+'</div>'
							;
					});
					return frag;
				}, // end of 'buildHTML' function

				loadHTML: function(){
					var frag = '';
					$.each(cards, function(k, v){
						// Set the content for the info box, taking HTML from an external file
						$('div.infocontentwrapper'+v.id).load('assets/cards_info/card_'+v.id+'_info.html');
					});
				}

		}; // end of 'AllNotes'

		AllNotes.init(cards);
		
		// Load all the lazy content
		$(function() {
	        $('.lazy').Lazy();
	    });

	}); // end of getJSON()


})(); // end of the outer function

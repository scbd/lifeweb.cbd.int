angular.module('app').controller('LifeWebNavController', function($scope) {
	
	$scope.menu = [
      {"title": "About us", 
          "links": [{
              "name": "home", "url": "/lifeweb/new/"}, {
              "name": "strategy", "url": "/lifeweb/new/strategy"},{
                  "name": "background", "url": "/lifeweb/new/background"}, {
                      "name": "news and events", "url": "/lifeweb/new/news"}]
	 }, 
	  {"title": "Explore",
       "links": [{ 
		 "name": "projects", "url": "/lifeweb/new/search"},{
		 "name": "countries", "url": "/lifeweb/new/countries"},{
	     "name": "donors", "url": "/lifeweb/new/donors"}]
		
	 },
	 {"title": "Support",
       "links": [{ 
           "name": "why donate?", "url": "/lifeweb/new/donate/"
       }, {
		 "name": "benefits", "url": "/lifeweb/new/benefits"},{
		     "name": "area-based targets", "url": "/lifeweb/new/targets/"
		 }, {
		         "name": "roundtables", "url": "#"
		     }]
	 },
	 {"title": "Profile",
       "links": [{ 
		 "name": "submit", "url": "#"},{
		 "name": "elgibility criteria", "url": "#"},{
		     "name": "FAQs", "url": "/lifeweb/new/faqs/"
		 }]
	 },
	 {"title": "Connect",
       "links": [{ 
           "name": "sign in", "url": "/user/signin.aspx?returnurl=%2flifeweb%2f" }, {
		     "name": "facebook", "url": "http://www.facebook.com/pages/CBD-LifeWeb/149494725067720"}, {
		     "name": "twitter", "url": "http://twitter.com/CBDLifeWeb" }, { 
		         "name": "subscribe", "url": "#"
		     }, {
		         "name": "contact us", "url": "/lifeweb/new/contact"
		     }]
	 }
  ];

});

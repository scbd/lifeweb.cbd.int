define(['app', 'angular-form-controls', 'editFormUtility', '/app/js/directives/workflow-std-buttons.html.js',], function(app) {
  app.controller('EditCtrl', function($scope, $rootScope, $routeParams, $http, $upload, $q, $route, breadcrumbs, IStorage, guid, editFormUtility) {

    $scope.tab = 'edit';

    var keySchemaMap = {
      'project': 'lwProject',
      'event': 'lwEvent',
      //'organization': 'lwOrganization', //TODO: it apaprently already exists?
    };
    $scope.breadcrumbs = breadcrumbs;
    var collectionKey = $route.current.collectionKey;
    //unpluralize the collection name for the object name
    //TODO: make the url work by name, rather than id... for now it's infeasible because I can't get seem to set the title in the mass query.
    var singularKey = collectionKey.substr(0,collectionKey.length-1)
    var schemaName = keySchemaMap[singularKey]; //TODO: still needed?
    $scope.document = {};
    if($routeParams.title) {
      //$http.get('http://localhost:1818/api/'+schemaName, {name: $routeParams.name})
      $scope.documentPromise = editFormUtility.load($routeParams.title);
      editFormUtility.documentExists($routeParams.title).then(function(exists) {
        if(exists)
            $scope.published_id = $routeParams.title;
      });
    }
    else
/*
      $scope.documentPromise = {
        header: {
          identifier: guid(), 
          languages: ['en'],
          schema: schemaName,
        },
      };
*/
    $scope.documentPromise = {
	"header": {
		"identifier": "09EB4988-A4DC-1609-AD27-BD65B2413497",
		"languages": [
			"en"
		],
		"schema": "lwProject"
	},
	"institutionalContext": [
		{
			"partner": "Lcda. Marcela Torres",
			"info": "[Powpa Focal Point]",
			"role": {
				"identifier": "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED"
			}
		},
		{
			"partner": "Dr. Wilson Rojas",
			"info": "[National Focal Point]",
			"role": {
				"identifier": "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED"
			}
		},
		{
			"partner": "Dr. Walter Schuldt",
			"info": "[National Focal Point]",
			"role": {
				"identifier": "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED"
			}
		},
		{
			"partner": "Sra. Pamela Rocha",
			"info": "[National Focal Point]",
			"role": {
				"identifier": "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED"
			}
		}
	],
	"donors": [
		{
			"name": "Island Conservation",
			"description": "",
			"funding": 600000,
			"dateTime": "1414800000000",
			"lifeweb_facilitated": true
		},
		{
			"name": "Galapagos Invasive Alien Species Fund",
			"description": "",
			"funding": 80000,
			"dateTime": "1414800000000",
			"lifeweb_facilitated": true
		},
		{
			"name": "Floreana Parish Council",
			"description": "",
			"funding": 80000,
			"dateTime": "1414800000000",
			"lifeweb_facilitated": true
		},
		{
			"name": "Dirección del Parque Nacional Galápagos",
			"description": "",
			"funding": 7709326,
			"dateTime": "1414800000000",
			"lifeweb_facilitated": true
		},
		{
			"name": "Galapagos Biosecurity Agency ",
			"description": "",
			"funding": 1500000,
			"dateTime": "1414800000000",
			"lifeweb_facilitated": true
		}
	],
	"leadContact": "Lcda. Marcela Torres",
	"countries": [
		{
			"identifier": "ec"
		}
	],
	"title": "Improving Ecuador islands’ resilience to climate change through ecosystem restoration by eradicating invasive alien species, repatriating endemic species, and strengthening biosecurity",
	"projectAbstract": "The Ministry of Environment, represented by the Galapagos National Park Directorate and Galapagos Biosecurity Agency, will work with the Floreana Parish Council, Island Conservation, and other partners to build Floreana Island’s resilience to climate change through ecosystem restoration and long-term protection. In particular, we will: a) eradicate invasive alien species (cats, rats, mice), b) re-establish viable populations of the IUCN Critically Endangered Floreana mockingbird (Mimus trifasciatus) and the recently rediscovered Floreana giant tortoise (Chelonoidis elephantopus), and c) implement a series of community-based activities (e.g., pride campaign, biosecurity programme, training in conflict transformation) to help ensure the sustainability of Floreana Island’s biodiversity and the 140 people whose livelihoods directly depend on it. The project advances Aichi Biodiversity Targets 5 (habitats conserved), 9 (invasive alien species managed), and 12 (extinction prevented) and will provide a model for similar work on other inhabited islands in Ecuador (e.g., Isla de la Plata) and beyond.",
	"description": "This project seeks to restore island ecosystems and secure human livelihoods by eradicating invasive alien species and re-establishing locally extinct species. Project success will facilitate climate change resilience on human-inhabited islands in Ecuador and beyond.<br/><br/>Ecuador is one of the 17 megadiverse countries in the world. Main threats to the country’s biodiversity include deforestation, invasive alien species, natural resource extraction, and climate change. Ecuador recently submitted its 5th National Report to the CBD, describing the country’s current and future progress towards achieving the Aichi Biodiversity Targets in conjunction the Strategic Plan for Biodiversity 2011-2020 (5th National Report: https://www.cbd.int/reports/nr5/). Strategic and timely actions to mitigate the adverse impacts of climate change and invasive alien species are conservation imperatives.<br/><br/>The Galapagos Islands are among the ‘jewels’ of Ecuador and a top conservation priority; their rich, endemic biodiversity (>95% of species extant) draws substantial nature-based tourist income (@US$1 billion/year). In order to facilitate protection of its unique biodiversity, Ecuador created the Galapagos National Park in 1959 and designated the Galapagos Marine Reserve in 1996. In acknowledgment of their global conservation value, the Galapagos Islands became the first World Heritage Site in 1978 and were designated as a UNESCO-Man and Biosphere Reserve in 1984. However, largely due to threats posed by invasive alien species, UNESCO listed the Galapagos Islands as a World Heritage Site in Danger in 2007. Because they are inhabited by endemic species that persist on a single island complex, Floreana Island and two of its satellite islands have recently been identified as an Alliance for Zero Extinction site (http://www.zeroextinction.org/).<br/><br/>This proposed project focuses on the ecological restoration and long-term protection of Floreana Island, a 173 km2 human-inhabited island in the Galapagos Archipelago, which hosts 54 IUCN Red Listed species (10 Critically Endangered, 18 Endangered, and 26 Vulnerable species), the world’s largest Galapagos petrel (Pterodroma phaeopygia) breeding colony, and 11 nesting seabird species. <br/><br/>Whalers began visiting Floreana Island regularly in the late 1700s. Floreana Island was the first Galapagos island to be settled (1832), and is now home to 140 people who rely on nature-based tourism, farming, and fisheries for their livelihood. Due to the long history of human activity, Floreana Island has experienced the most significant habitat degradation and highest level of species loss of any island in the Galapagos. Over the past 300 years at least 12 native species have been extirpated from the island, largely due to the adverse impacts of invasive alien species [the exceptions being the Floreana giant tortoise (Chelonoidis elephantopus and Galapagos hawk (Buteo galapagoensis) which were also overharvested]. Four native species have become locally extinct in just the last 30 years. <br/><br/>Ecuadorian conservation agencies and non-governmental organizations, as well as the people of Floreana Island, currently share a strong interest in the repatriation of two of Floreana Island’s endemic species: the Floreana mockingbird (Mimus trifasciatus) and Floreana giant tortoise (Chelonoidis elephantopus).<br/><br/>The Floreana mockingbird is included on the IUCN Red List as a Critically Endangered species due to the small size of the remaining population (85-231 individuals) and tendency of the population size to fluctuate with extreme weather events. In 2007, a particularly dry year on Floreana Island, the total global population of Floreana mockingbirds declined to 46 adults. The species became extinct on Floreana Island between 1868 and 1880, and can now only be found on two rodent- and cat-free satellite islets off Floreana Island’s coast, Champion (0.1 km2) and Gardner-by-Floreana (0.8 km2). The status of the Floreana mockingbird is monitored on an annual basis.<br/><br/>For approximately 150 years, the Floreana giant tortoise was thought to have been driven to extinction by human harvesting and invasive alien species (e.g., rats and cats that prey on hatchling tortoises). However, genetic studies recently revealed that the Floreana giant tortoise still persists in the wild on the northern end of the island of Isabela, a few hundred kilometers from its place of origin on Floreana Island.  The tortoises were likely released on Isabela Island by seafarers who had collected them on Floreana Island for food. These findings provide great hope for recovery of this species, as well as the other native species that depended on its services as a herbivore and seed disperser. A few individuals of the species now constitute the nucleus of a small captive breeding population being led by the Galapagos National Park Directorate on Santa Cruz Island. <br/><br/>Feral goats (Capra hircus) were successfully removed from Floreana Island in 2007 by the Galapagos National Park Directorate in collaboration with the Floreana Parish Council. However, feral cats (Felis catus)  and invasive alien rats (Rattus rattus) and mice (Mus musculus) remain a threat to biodiversity and people. The eradication of invasive alien species from Floreana Island will not only enable the recovery of individual species, it will facilitate ecosystem recovery and resilience to environmental change. Ecuador’s National Climate Change Plan (2013) promotes ecosystem-based approaches (e.g., invasive alien species eradication) to climate mitigation. <br/><br/>Eradicating invasive alien species to build resilience to climate change is as much a socio-cultural issue as it is an ecological issue. The residents of Floreana Island recognize that they are being negatively impacted by invasive alien species (e.g., through crop losses, disease risk transmission) and that they are highly vulnerable to the adverse impacts of climate change (e.g., extreme weather events). The Floreana Parish Council has requested support from the Government of Ecuador and its partners to help safeguard their future. This project will help meet their needs by increasing food and income security (especially from tourism), eliminating disease risks, and fostering community cohesion and empowerment through training in conflict transformation and implementation of a campaign intended to build pride in the island’s endemic species (hereafter ‘pride campaign’).<br/><br/>Recognizing the value to biodiversity conservation and human livelihoods, invasive alien vertebrate eradications have already been successfully completed on 1,100 islands worldwide, the vast majority of which are uninhabited (http://diise.islandconservation.org/). Approximately 50% of IUCN Critically Endangered and Endangered island-based mammals, reptiles, and amphibians exist on islands that also have human populations greater than 10,000 people (http://tib.islandconservation.org/). There is a clear and immediate need to advance innovative approaches and tools to eradicate invasive alien vertebrates on human-inhabited islands. Success of the Floreana Island project proposed herein will set a global precedent, enabling new climate change mitigation and biodiversity conservation projects on hundreds of human-inhabited islands in Ecuador, and across the world. <br/><br/>Summary of Threats and Opportunities<br/><ul><br/><li>Invasive alien species (eradicate invasive alien rodents and feral cats; strengthen biosecurity program)</li><br/><li>Climate change (restore and protect island ecosystems; build social resilience through training in conflict transformation and a community-empowering pride campaign)</li><br/><li>Extirpation of endemic species (reintroduce Floreana mockingbird and Floreana giant tortoise post-rodent and feral cat eradication)</li><br/></ul>",
	"additionalInformation": "\n[participation]\nThis project is a direct response to the needs identified by the inhabitants of Floreana Island. The work will proceed in its entirety through an open, transparent, and participatory approach. At the request of Floreana Parish Council and other stakeholders, Island Conservation supported the Galapagos National Park in hosting a 5-day workshop in early 2014 for Floreana Island residents and institutional leaders to develop a holistic vision for Floreana Island and to explore needs and opportunities for conflict transformation in the context of environmental change. By request, Floreana Island residents will receive additional training in conflict transformation, as well as support for developing sustainable agriculture and ecotourism.<br/>Stakeholder consultations will be held in order to determine the most appropriate methodologies for invasive alien mammal eradication on Floreana, develop a pride campaign focused on island endemics, and identify needs and opportunities for strengthening the islands biosecurity programme. Floreana residents and island visitors will be empowered to take on leadership roles through this project.  For example, some island residents have already been trained in biological survey and data collection methodologies and are thus contributing vital information to project design. The pride campaign is an inherently community-based activity that will largely be envisioned and implemented by the people of Floreana Island.\n[governance]\nThis project will build the capacity of governing bodies at local (e.g., Floreana Parish Council), subnational (e.g., Galapagos National Park directorate, Galapagos Biosecurity Agency), and national (e.g., Ministry of Environment) levels. It will also provide an opportunity for the Government of Ecuador to be seen as a world leader in the application of ‘best practices’ for protected areas management that serve conservation goals while meeting the needs of local people in the challenging context of global change.",
	"thumbnail": null,
	"nationalAlignment": [
		{
			"type": {
				"identifier": "NBSAP"
			},
			"comment": "Climate Change Mitigation<br/>   <ul><li>National Climate Change Plan (2013), which places a strong emphasis on ecosystem-based approaches to climate mitigation</li><br/>   <li>Galapagos Islands Climate Change Vulnerability Assessment recommendations (2011)</li><br/>   <li>Zero Fossil Fuels on the Galapagos Islands initiative (2007)</li><ul>"
		},
		{
			"type": {
				"identifier": "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED"
			},
			"comment": "The project explicitly advances the following national- and sectorial-level plans and strategies:<br/><br/>Biodiversity Conservation<br/>   <ul><li>5th National Report to the CBD (2014) </li><br/>   <li>Invasive Species Action Plan (2013)</li><br/>   <li>Management Plan for the Protected Areas on Galapagos for a Good Standard of Living (2013)</li><br/>   <li>Galapagos National Park’s ‘Reducing vulnerability of endemic species by eradicating priority invasive species’ project, approved by National Planning Authority (2012)</li><br/>   <li>Action Plan for the Implementation of the Protected Areas Programme of Work of the Convention on Biological Diversity (2012)</li><br/>   <li>Plan for Total Control of Introduced Species (2007)</li></ul><br/><br/>Livelihood Security<br/>   <ul><li>National Plan for Good Standard of Living 2013-17 (2013)</li><br/>   <li>Ecuador’s 2020 Strategic Plan for Sustainable Tourism Development (2012)</li><br/>   <li>Floreana Parish Council’s Strategic Plan (2011)</li><br/>   <li>Ministry of Agriculture’s bio-agriculture plan for Galapagos (2014) </li><br/>   <li>Millennium Development Goals, 7. Ensure environmental sustainability(2013)</li></ul>"
		},
		{
			"type": {
				"identifier": "CC"
			},
			"comment": "Ecuador’s first NBSAP (‘Política y Estrategia Nacional de Biodiversidad del Ecuador;’ http://www.cbd.int/doc/world/ec/ec-nr-05-es.pdf) focused on the time period 2001-2010. It proposed four main conservation measures: (1) consolidate and strengthen the sustainability of production activities based on native biodiversity; (2) ensure the existence, integrity and functionality of all biodiversity components (ecosystems, species, genes); (3) balance pressures from conservation and sustainable use on biodiversity; and (4) guarantee the respect and exercise of individual and collective rights to participate in decisions related to access and control of resources, and ensure that the benefits derived from the conservation and sustainable use of biodiversity, as well as from the use of knowledge, innovations and practices of the indigenous communities and local populations, are justly and equitably distributed. <br/><br/>Due to the late timing of the approval (2007), as well as limits in legislation, institutional capacity, and funding, the Government of Ecuador has faced challenges in enacting the vision and activities set out in the NBSAP. As a result, the country’s initiatives have been strategically opportunistic, followed a ‘common sense’ approach, and engaged the direction and capacities of various private, public, and international organizations. Although not explicitly consistent with program of work set out in the NBSAP, numerous achievements in biodiversity conservation have been made, particularly in the Galapagos Archipelago.<br/><br/>The project proposed herein advances the four main conservation measures set out in the NBSAP by: a) protecting and restoring native ecosystems and b) securing the livelihoods of the people who depend on them. While the initial target location for the project is a single island (Floreana) in the Galapagos, we intend to transfer ‘best practices’ to other human-inhabited islands in Ecuador (e.g., Santa Cruz, San Cristobal, Isabela, Santay Islands) and beyond. Not only will this serve to support the objectives of Ecuador’s first NBSAP, it will enable other governments to advance NBSAP objectives as well.<br/><br/>Ecuador recently submitted its 5th National Report to the CBD (http://www.cbd.int/doc/world/ec/ec-nr-05-es.pdf), describing the country’s current and future progress towards achieving the Aichi Biodiversity Targets in conjunction with the Strategic Plan for Biodiversity 2011-2020. We consider strategic and timely actions to mitigate the adverse impacts of climate change and invasive alien species to be urgent conservation needs. This project’s specific contributions toward achieving the Aichi Biodiversity Target are described later in this proposal.<br/><br/>The Government of Ecuador released a report on its activities to implement the CBD Programme of Work on Protected Areas in 2012 (‘Plan de Acción para la Implementación del Programa de Trabajo sobre Áreas Protegidas de la Convención sobre la Diversidad Biológica; https://www.cbd.int/doc/world/ec/ec-nbsap-powpa-es.pdf ). Ecuador has a strong commitment to not only establishing protected areas, but ensuring that they do, in fact, convey long-term protection to biodiversity and the people who rely on natural resources for their livelihoods and well-being.  Approximately 1/3 (32%) of Ecuador’s terrestrial and marine environments have been afforded legal protection status; 47 of these are described in the report to the CBD, including the Galapagos Islands. This project will support implementation of Ecuador’s protected areas plan by: a) helping to ensure that the biodiversity of Floreana Island is protected in accordance with the multiple protected area designations held by the Galapagos Islands, b) integrating local peoples into protected area planning and implementation, and c) building the capacity of protected area managers and local people on other Ecuadorian islands (e.g., Isla de la Plata) to achieve conservation through the removal of invasive alien species and recovery of endemic species."
		}
	],
	"ecologicalContribution": "Ecuador is one of the 17 megadiverse countries in the world, and also one of the most ecologically vulnerable to environmental change. The World Wildlife Fund includes the Galapagos Archipelago among the ‘Global 200 Ecoregions,’ indicating that it should be considered a priority for protection. The Government of Ecuador has currently secured five different protected area designations for the Galapagos Islands as a whole: World Heritage Site, UNESCO-Man and Biosphere Reserve, National Park, Marine Reserve, and Whale Sanctuary. Within the Galapagos Islands, specific sites have additional protected area status. For example, Humedales del Sur de Isabela is a wetland of major importance recognized by the Ramsar Convention and Floreana Island (as well as two satellite islets) are Alliance for Zero Extinction sites. <br/><br/>The Galapagos Islands are home to numerous endemic species which are considered global conservation priorities. Floreana Island alone hosts 54 IUCN Red Listed species (10 Critically Endangered, 18 Endangered and 26 Vulnerable species), and the world’s largest Galapagos petrel (Pterodroma phaeopygia) breeding colony. <br/><br/>We intend to actively transfer the ‘best practices’ employed on Floreana Island to other human inhabited islands in Ecuador (e.g., Santa Cruz, San Cristobal, Isabela, Santay Islands) and beyond. This will enable both island nations (especially Small Island Developing States) and nations with islands to improve their national protected area systems by ensure that protection is achieved in practice as well as intent.<br/><br/>54 IUCN RED LISTED SPECIES IN THE GALAPAGOS<br/>Type\t    CR\tEN   VU\t<br/>Vertebrate  2\t4     2\t<br/>Plant\t    5\t8    19\t<br/>Invert\t    3\t6     5\t<br/>\t\t\t\t<br/>Total\t   10  18    26\t 54",
	"budget": [
		{
			"activity": "1. Eradicate invasive alien species:\n  <ul><li>Undertake feasibility study</li>\n  <li>Conduct community consultations (ongoing)</li>\n  <li>Test methodology</li>\n  <li>Develop/execute eradication plan and mitigate negative impacts to non-target species populations</li>\n  <li>Measure/monitor impact</li>\n</ul>\n\n(Note: In full agreement with farmers, livestock may be completely removed from Floreana Island to reduce poisoning risk and replaced with higher production breeds as an opportunistic benefit of the project)",
			"result": "All feral cats and invasive alien rodents permanently removed from Floreana Island",
			"cost": 16276187
		},
		{
			"activity": "2. Repatriate Endemic Species:\n   <ul><li>Undertake feasibility study (including population viability analysis)</li>\n   <li>Consult/engage community (ongoing)</li>\n   <li>Develop/implement pride campaign</li>\n   <li>Develop/implement reintroduction plan</li>\n   <li>Monitor</li>\n   <li>Adaptively manage, as appropriate</li>\n</ul>",
			"result": "Viable populations of the Critically Endangered Floreana mockingbird (Mimus trifasciatus) and Floreana giant tortoise (Chelonoidis elephantopus), resulting in IUCN Red List down listing of the mockingbird and a secure population of the tortoise (not currently IUCN listed because it was believed to be extinct)\n\nFloreana Island residents taking pride in and proactively protecting island biodiversity, with particular attention to the endemic fauna",
			"cost": 960000
		},
		{
			"activity": "3. Improve biosecurity programme:\n   <ul><li>Conduct broad stakeholder consultation/engagement (ongoing; including local community, tourist industry, government agencies and partners, etc.)</li>\n   <li>Generate recommendations</li>\n   <li>Implement Floreana Biosecurity Plan (Note: to include spay/neuter programme for pet cats)</li>\n</ul>",
			"result": "Biosecurity Agency and programs strengthened, with support by the local people and tourist industry\n\nMinimize introduction risks of foreign fauna and flora\n\nRe-introduction of invasive rodents prevented indefinitely\n\nAll remaining cats sterilized and under responsible pet ownership",
			"cost": 2000000
		},
		{
			"activity": "4. Train Floreana Island residents:\n   <ul><li>Strategically assess needs for training in conflict transformation in the context of environmental change (as a response to a request to Island Conservation from the community)</li>\n   <li>Develop and implement training courses</li>\n   <li>Measure/monitor training impact</li>\n   <li>Offer additional training as needed</li></ul>",
			"result": "Floreana residents report greater capacity to engage in conflict transformation \n\nFuture conflicts within the community or between the community and other parties are resolved in a timely and constructive manner",
			"cost": 465000
		},
		{
			"activity": "5. Transfer model:\n   <ul><li>Document project activities</li>\n   <li>Identify target audiences for lessons learned</li>\n   <li>Package and transfer ‘best practices’ through media most appropriate for each target audience</li></ul>",
			"result": "Invasive alien vertebrate eradication projects successfully implemented on other human-inhabited and uninhabited islands of Ecuador (e.g.,  Santa Cruz, Isla Santay, Isla de la Plata) and lessons learned transferred worldwide",
			"cost": 300000
		}
	],
	"financialStability": "Galapagos National Park Directorate (DPNG): DPNG have a national government-approved 5 year US$16,700,000 investment project for invasive alien species, of which US$6,709,326 is allocated to this project. In addition, an estimated US$1,000,000 will be provided in-kind from annual operating expenditure and salaries for this project.<br/><ul><br/>  <li>FEIG (Galapagos Invasive Species Fund)/DPNG: A US$80,000 grant to DPNG to initiate planning and preparatory work on Floreana Island has been awarded for 2014-2015. Additional FEIG grants will be applied for, and it is conservatively estimated that a further US$300,000 will be awarded.</li><br/>  <li>Galapagos Biosecurity Agency (GBA): It is conservatively estimated that US$300,000/year US$1,500,000 total) will be invested by the GBA in developing and maintaining a state-of-the-art biosecurity program. Part of this investment is contemplated within their 2014-2017 national government approved US$10,400,000 million investment project</li><br/>  <li>Island Conservation (IC) has secured  US$600,000 and propose to secure from private philanthropic sources project support totaling US$3,200,000</li><br/>  <li>Island Conservation has applied to the German International Climate Initiative (IKI) for US$6,671,861 to fund aspects of the project that will be challenging for Ecuadorian government institutions to implement and to act as counterpart funding</li><br/></ul>",
	"climateContribution": [
		{
			"type": {
				"identifier": "ecoservices2"
			},
			"comment": "Biodiversity conservation increases ecosystem resilience. The eradication of invasive alien species from Floreana Island will promote recovery of native vegetation (see above), which, in turn, will help maintain and re-establish the native fauna and secure the livelihoods of local peoples dependent on these habitats and their services. Restoration will create the conditions necessary for the reintroduction of endemic species extirpated from the island. The more intact the Floreana Island ecosystem, the greater its capacity to adapt to an environmental disturbance."
		},
		{
			"type": {
				"identifier": "ecoservices1"
			},
			"comment": "An analysis of more than 400 published scientific studies indicates that the long-term stability of forest carbon stocks depends on ecosystem resilience, which is linked to biodiversity at multiple scales. The eradication of invasive alien species (feral cats, invasive rats and mice) from Floreana Island will secure carbon stocks by: a) preventing forest degradation, b) protecting the seed bank , c) re-establishing seed dispersers (Floreana mocking bird and Floreana giant tortoise), d) recovering nutrient-producing seabird colonies (which promote forest health), and  e) facilitating the regrowth of native plants. <br/><br/>In 2007, the Galapagos National Park Directorate, in coordination with the Floreana Parish Council, eradicated feral goats from Floreana Island.  Significant vegetation recovery followed goat removal, particularly the regeneration and maturation of woody plant species which have significant carbon sequestration properties. Ecosystem recovery is still in progress. The eradication of invasive alien rodents will further enhance the capacity for the native vegetation to recover, and for carbon storage benefits to accrue over time.<br/>"
		},
		{
			"type": {
				"identifier": "ecoservices6"
			},
			"comment": "Although the Galapagos Archipelago hosts just one thousandth of the inhabitants of Ecuador, their importance in absolute terms is vastly larger; the Galapagos Islands serve as a symbol of the Ecuadorian nation. Conservation of the Galapagos Islands thus has a strong cultural component for Ecuador:  (a) the Archipelago symbolizes the country’s international image at the tourist level, (b) the islands are part of the natural heritage of protected areas, belonging to all Ecuadorians; (c) the proper management and conservation of the Archipelago empowers Ecuador's international image as a country responsible for the management and use of natural ecosystems as a source of environmental services, determining the welfare of its population and (d) the Galapagos Islands are one of the best symbols of Ecuadorian nationality and sovereignty.<br/>Floreana Island’s cultural history is the best known and, arguably, the most compelling in the Galapagos.  Because Floreana Island offered one of the only reliable year-round freshwater springs in the Galapagos Islands and a diversity of plant and animal species, it was a destination for pirates and other seafarers to stop and replenish their water and meat supplies (targeting giant tortoises). In order to create shelter, these Floreana Island visitors carved holes in the soft stone of the island highlands. These structures, sometimes referred to as ‘The Stonehenge of The Galapagos,’ are now a tourist curiosity. <br/>Whalers began visiting Floreana Island regularly in the late 1700s. They established a ‘post office’ in a barrel; whalers would leave letters and pick up letters to deliver en route to other destinations. The ‘post office’ is still intact and used by the island’s tourists. The Galapagos National Park and Floreana Island’s community tourism project is in the process of reopening the historic trail between the highlands and Post-office Bay which was used for taking agricultural products from the highlands to visiting boats to trade for other commodities. <br/>The Wittmer family settled on Floreana Island in 1832. Several books have been written about the mysterious disappearances and deaths that occurred thereafter. The stories remain a fascination and draw for tourists. In 1835, Charles Darwin visited Floreana Island where he collected specimens that would later inspire the publication (‘On the Origin of Species’) in which he established the theory of evolution. <br/>Floreana Islanders revere the spectacle of Galapagos petrels searching for and entering their nesting burrows at Cerro Pajas – a vegetated volcanic cone in the highlands.  The site is naturally constructed like a massive amphitheater, creating an echo chamber for the voices of hundreds of petrels calling simultaneously. This spectacle is considered one of natural wonders that make Floreana Island unique. Galapagos petrels are part of the identity of Floreana Islands, as are the extirpated Floreana mockingbird and Floreana giant tortoise. These species constitute a critically endangered aspect of the human heritage of the island and its people, a heritage which is currently threatened by invasive alien species.<br/>"
		},
		{
			"type": {
				"identifier": "ecoservices4"
			},
			"comment": "The invasive alien rodents on Floreana Island deplete food supplies through the destruction of in-field crops, depredation of stored food and seed, and fecal contamination. The rodent impact is so substantial that entire fields of maize and cassava can be devastated while rodent control measures are being applied.  The eradication of invasive rats and mice will completely eliminate these crop losses.<br/><br/>Invasive alien rodents also have a negative impact on fisheries through the consumption of inter-tidal species such as chiton and the endemic shellfish locally called ‘churo.’ The residents of Floreana Island are directly dependent of these marine resources. "
		},
		{
			"type": {
				"identifier": "ecoservices3"
			},
			"comment": "Freshwater is a limiting resource on Floreana Island, and the Galapagos Islands in general. The 140 residents, livestock, and wildlife are largely dependent on the health of just two freshwater springs. This project will help protect those springs by increasing vegetation cover across the island. This will convert eroded soils back into a “sponge,” causing the groundwater layers to rise rather than fall. Capture of sea-fog (locally known as ‘garua’) will be enhanced, resulting in more substantial precipitation. Additionally, increasing vegetation cover will reduce the temperature of the air column above the island, causing water vapour to condense, and thereby increasing rainfall. The net effect will be a positive increase in freshwater availability."
		},
		{
			"type": {
				"identifier": "ecoservices5"
			},
			"comment": "Removal of feral cats and invasive rodents will eliminate primary vectors of diseases on Floreana Island, helping to safeguard the health of the Floreana Island resident and tourist visitors.<br/><br/>Invasive alien rodents are often attracted to human-built infrastructure. They feed, chew holes, urinate, defecate and nest in areas occupied by people. The presence of rodents in commensal areas can lead to an increased risk of disease, including toxoplasmosis, lymphocytic clorio-meningitis, plague, leptospirosis, hantavirus, and salmonellosis. Once rodents are removed from commensal areas, the hygiene of a building and its contents can be better managed and human health secured.<br/><br/>Feral cats also serve as reservoirs and critical hosts of parasites and disease, and often live in the vicinity of human dwellings in order to take advantage of rodent populations and shelter. Cats carry several diseases in the Galapagos which can infect both humans and wildlife. For example, cats are the critical host for Toxoplasma gondii, which causes the disease toxoplasmosis. Most warm blooded animals are susceptible to toxoplasmosis infection. Toxoplasmosis is a threat to the endemic Galapagos fur seals (Arctocephalus galapagoensis) and the Galapagos sea lions (Zalophus wollebaeki) found on Floreana Island, as well as the island’s human residents and visitors. Symptoms of toxoplasmosis in native fauna include poor coordination, blindness, lethargy, respiratory and enteric distress, and sudden death. In infected people, similar symptoms are exhibited. However, toxoplasmosis is best known as being a cause of spontaneous abortion in pregnant women.<br/>"
		},
		{
			"type": {
				"identifier": "ecoservices7"
			},
			"comment": "The recovery of Floreana Island ecosystems has the potential to increase tourist income to the benefit of the Floreana Island residents and other Ecuadorians. The ecological restoration of New Zealands’s Tiritiri Matangi Island provides an inspirational model.<br/><br/>In 1984, the small island of Tiritiri Matangi was a pastoral farm with sheep and cattle, and a small patch of remnant forest. Over the following  three decades, the community worked with the New Zealand Department of Conservation to replant native species and eradicate invasive alien rats and rabbits. These activities enabled native vegetation recovery and the reintroduction of a suite of endangered New Zealand wildlife. Free of the adverse impacts of invasive alien mammals, rare New Zealand birds and reptiles (species found few other places) began to thrive. Tiritiri Matangi Island is now one of the premier visitor sites in Auckland harbour. Although visitation is limited to 35,000 tourists a year, tourism activities on this island alone generated US$ 115,000,000 in 2013.   <br/><br/>The recently launched Floreana Island  community tourism initiative aims to equitably distribute the benefits of the tourism to the Floreana Island community. In order to minimize environmental impacts while facilitating economic opportunity, the total number of tourists will be reduced and the average time each visitor spends on the island (a shift from day-trips to overnight stays) increased, allowing for greater total income generation.  The project we propose herein supports these overarching goals. Like Tiritiri Matangi Island, Floreana Island will rely on its restored natural capital to attract national and international visitors who will pay premium prices for opportunities to see unique (and previously threatened) wildlife, generating significant income for Ecuador. <br/>"
		}
	],
	"aichiTargets": [
		{
			"type": {
				"identifier": "AICHI-TARGET-10"
			},
			"comment": "Island ecosystems and the people dependent upon them are particularly vulnerable to climate change. These low-lying, often remote, coastal nations typically have small human populations, limited natural resources, and a history of environmental degradation which will make them particularly susceptible to the increased frequency of natural disasters associated with climate change.<br/><br/>This project will help build both biotic and social resilience to climate change on Floreana Island through: a) restoration and protection of natural ecosystems, and b) community development through engagement in a pride campaign and training in conflict transformation, with an explicit focus on preparing the Floreana Island residents to constructively resolve human conflicts in the context of rapid environmental change. Parallel projects will focus on complementary aspects of sustainable agriculture and ecotourism.<br/><br/>We intend to actively transfer ‘best practices’ to other human inhabited islands in Ecuador and worldwide. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement of Aichi Target 10, with a particular emphasis on the combined goals of ecological and social resilience to climate change and other anthropogenic stresses.<br/>"
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-11"
			},
			"comment": "The Galapagos Islands are among the ‘jewels’ of Ecuador and a top priority for biodiversity conservation on national, regional, and global scales. In order to facilitate protection of its unique biodiversity, Ecuador created the Galapagos National Park in 1959 and designated the Galapagos Marine Reserve in 1996. In acknowledgment of their global conservation value, the Galapagos Islands became the first World Heritage Site in 1978 and were designated as a UNESCO-Man and Biosphere Reserve in 1984. Floreana Island is geographically included in these protected area designations, with over 98% of the land surface area being National Park and its surrounding waters covered by the Marine Reserve. Floreana Island (along with two of its satellite islets) was also recently been named an Alliance for Zero Extinction site.<br/><br/>Unfortunately, invasive alien species do not respect jurisdictional boundaries and undermine the conservation opportunities in parks and other protected areas worldwide. Largely due to threats posed by invasive alien species, UNESCO listed the Galapagos Islands as a World Heritage Site in Danger in 2007. <br/><br/>The eradication of invasive alien species and repatriation of endemic species will help ensure that Floreana Island’s biodiversity and ecosystem services are protected in practice as well as intent. Our work will proceed through a participatory approach that proactively engages and responds to the needs of Floreana Island residents and other stakeholders (e.g., ecotourists).<br/><br/>We intend to actively transfer ‘best practices’ to other human inhabited islands in the Galapagos Archipelago, in Ecuador, and beyond. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement of Aichi Target 11 in some of the most urgent and challenging conservation contexts.<br/>"
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-12"
			},
			"comment": "Ecuador is one of the 17 megadiverse countries in the world. Due to their rich, yet highly vulnerable, endemic biodiversity, the Galapagos Islands are one of the country’s top conservation priorities. This proposed project focuses on the ecological restoration and long-term protection of Floreana Island, a 173 km2 human-inhabited island in the Galapagos Archipelago which hosts 54 IUCN Red Listed species (10 Critically Endangered, 18 Endangered and 26 Vulnerable species), the world’s largest Galapagos petrel (Pterodroma phaeopygia) breeding colony, and 11 nesting seabird species. <br/><br/>The eradication of invasive alien rodents and feral cats from Floreana Island is anticipated to benefit all 54 IUCN Red Listed species, resulting in down listing as their populations grow and stabilize. Two Critically Endangered endemic species, the Floreana mockingbird and Floreana giant tortoise, will be repatriated to their island of origin and viable populations established.<br/><br/>Through strengthening of Floreana Island’s biosecurity program and the engagement of Floreana residents in a campaign that builds pride in Floreana Islands endemic species, we will help ensure the conservation of these currently IUCN Red Listed species over the long-term.<br/><br/>We intend to actively transfer ‘best practices’ to other human inhabited islands in Ecuador (notably Isla de la Plata) and worldwide. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement of Aichi Target 12 in other locations where invasive alien vertebrates drive species loss and impede species recovery.<br/>"
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-13"
			},
			"comment": "Floreana Islanders revere the spectacle of Galapagos petrels searching for and entering their nesting burrows at Cerro Pajas – a vegetated volcanic cone in the highlands.  The site is naturally constructed like a massive amphitheater, creating an echo chamber for the voices of hundreds of petrels calling simultaneously. This spectacle is considered one of natural wonders that make Floreana Island unique, and inspired the local school to adopt the petrel as its symbol. Galapagos petrels are part of the identity of Floreana Islands, as are the extirpated Floreana mockingbird and Floreana giant tortoise. These species constitute a critically endangered aspect of the human heritage of the island and its people, a heritage which is currently threated by invasive alien species."
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-14"
			},
			"comment": "This project is a direct response to the needs for assistance expressed by the residents of Floreana Island. It will explicitly proceed through a particular approach, engaging these and other relevant stakeholders who are adversely impacted by the degradation of Floreana Island’s ecosystems.<br/><br/>The ecological integrity of Floreana Island will be restored through: a) the eradication of highly damaging mammals (invasive rodents and feral cats) and b) repatriation of the endemic Floreana mockingbird and Floreana giant tortoise. These island ecosystems will be further safeguarded through: a) strengthening of an island-wide biosecurity programme, b) development and implementation of a pride campaign, and c) adoption of sustainable farming and ecotourism practices by the local people and other stakeholders operating on Floreana Island.<br/><br/>Local peoples and tourists will also benefit from: a) substantial reductions in disease risk; b) protection and likely enhancement of the two freshwater springs on the island; c) increases in agricultural yields due to reduced crop loss (in-field and storage); d) community empowerment through engagement in consultations and increased leadership opportunities, conflict transformation training, and a pride campaign; and e) greater protection from extreme weather events as a result of improved biotic and social resilience.<br/><br/>We intend to actively transfer ‘best practices’ to other human inhabited islands in the Galapagos Archipelago, in Ecuador, and beyond. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement of Aichi Target 14 in a comprehensive manner, where engaging local people and securing their livelihoods is considered an aspect of whole-ecosystem restoration.<br/>"
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-15"
			},
			"comment": "An analysis of more than 400 published scientific studies indicates that the long-term stability of forest carbon stocks depends on ecosystem resilience, which is linked to biodiversity at multiple scales. The eradication of invasive alien species from Floreana Island will secure carbon stocks by: a) preventing forest degradation, b) protecting the seed bank , c) re-establishing seed dispersers (Floreana mocking bird and giant tortoise), d) recovering nutrient-producing seabird colonies (which promote forest health), and  e) facilitating the regrowth of native plants.<br/><br/>We intend to actively transfer ‘best processes’ to other human inhabited islands in Ecuador and worldwide. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement of Aichi Target 15 through the eradication of invasive alien vertebrates and re-establishment of native species which have vital roles to play in securing carbon stocks in health forest ecosystems.<br/>"
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-05"
			},
			"comment": "The species targeted for eradication on Floreana Island include invasive black rats (Rattus rattus) and house mice (Mus musculus), as well as a feral population of cats (Felis catus).  These species are currently having direct and indirect adverse impacts on Floreana Island habitats. Permanent removal of these species will enable the recovery of habitat structure and function. <br/><br/>Direct impacts<br/>Rodents are opportunistic omnivores. Their adverse impacts on island habitats through plant and seed depredation have been well documented worldwide. A comparison of rat-infested and rat-free islands, as well as pre- and post-rat eradication experiments, clearly demonstrates that rats can depress the population size and recruitment of various native plants, altering forest structure, composition, and function. <br/><br/>Indirect impacts <br/>The impacts from invasive alien vertebrates, especially predatory mammals, are one of the leading causes of species extinction on islands. Rats and cats will predate a wide range of vertebrate and invertebrate taxa. Invasive rodents will also feed on bird and reptile eggs. Population declines and/or the loss of native species can have cascading effects throughout the ecosystem, ultimately resulting in the loss of natural habitats. These indirect impacts are particularly dramatic when endemic vertebrates that play important roles in pollination, seed survival and dispersal, grazing, soil disturbance, and nutrient distribution are driven to extinction or near extinction.  Three examples of possible habitat-level impacts of invasive alien rodents and feral cats on Floreana Island habitats include:<br/><br/>   <ul><li>Predation on the IUCN Critically Endangered medium-tree finch (Camarhynchus pauper), a Floreana Island endemic,  could hinder seed dispersal across the Floreana Island landscape</li><br/>   <li>Because seabirds deliver large amounts of nutrients to terrestrial island systems through guano and food waste, predation on seabirds can reduce nutrient availability and thus depress primary production in insular plant communities and coastal marine productivity<li><br/>   <li>The inability to re-establish viable populations of the Floreana giant tortoise due to the predation of invasive mammals on tortoise eggs and hatchlings would prevent the recovery of habitats that evolved with the grazing pressure, seed scarification, and seed dispersal services that the tortoise once provided</li></ul><br/><br/>We intend to actively transfer ‘best practices’ to other human inhabited islands in Ecuador (e.g., Isla de la Plata) and islands worldwide. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement Aichi Target 5.<br/>"
		},
		{
			"type": {
				"identifier": "AICHI-TARGET-09"
			},
			"comment": "We will work with our partners to eradicate three species of invasive alien mammals from Floreana Island, namely black rats (Rattus rattus), house mice (Mus musculus), and a feral population of domestic cats (Felis catus).  The impacts of these invasive alien species on Floreana Island’s endemic species and fragile ecosystems are discussed elsewhere in this proposal, as well as in documents attached.<br/><br/>Strategic and tactical actions to prevent future introductions of invasive alien species are also a key aspect of this project, and will help ensure that the benefits of the proposed work conveyed to Floreana Island biodiversity and human residents are sustained over the long-term.  Using a participatory approach that engages Floreana Island residents, the tourist industry, and other stakeholders, we will identify opportunities to strengthen the already existing biosecurity system on Floreana Island and implement these measures in perpetuity. It is anticipated that improvements will include stronger inspection, detection, and response programmes; an ethic of responsibility for protecting their island and aspects of self-regulation inspired within the community (as part of a pride campaign); and a spay/neuter initiative for the remaining pet cats on the island.<br/><br/>Project success will establish Floreana Island as the first large inhabited island to be free of invasive alien mammals. We intend to actively transfer ‘best practices’ to other human inhabited islands elsewhere in Ecuador and worldwide. This will enable both island nations (especially Small Island Developing States) and nations with islands to contribute to the achievement of Aichi Target 9.<br/>"
		}
	],
	"images": [
		{
			"title": "The community of Floreana",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/Floreanacommunity.JPG"
		},
		{
			"title": "the highlands of Floreana",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/floreanahighlands.jpg"
		},
		{
			"title": "Mockingbird tortoise",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/mockingbird_tortoise.jpg"
		},
		{
			"title": "Floreana Mockingbird distribution map",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/mockingbirdmap.jpg"
		},
		{
			"title": "Habitation map Floreana",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/habitationmap.jpg"
		}
	],
	"maps": [],
	"coordinates": {
		"lng": -90.431373,
		"lat": -1.308331,
		"zoom": 7
	},
	"attachments": [
		{
			"title": "Climate Change Vulnerability Assessment of the Galapagos Islands",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/ClimateChangeReport.pdf"
		},
		{
			"title": "Floreana Island Ecological Restoration: Rodent and Cat Eradication Feasibility Analysis",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/FeasibilityAnalysis.pdf"
		},
		{
			"title": "Floreana fact sheet from Island Conservation",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/FloreanaFactSheet.pdf"
		},
		{
			"title": "Galapagos brochure from Island Conservation",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/GalapagosBrochure.pdf"
		},
		{
			"title": "PLAN DE MANEJO DE LAS ÁREAS PROTEGIIDAS DE GALÁPAGOS PARA EL BUEN VIIVIIR (Management Plan)",
			"keywords": [],
			"url": "http://www.cbd.int/doc/lifeweb/Ecuador/images/ManagementPlan.pdf"
		}
	]
};

    $scope.documentPromise = $q.when($scope.documentPromise).then(function(document) {
        //TODO: move or something. This is for elink.js...
        console.log('doc: ', document);
        $rootScope.documentIdentifier = document.header.identifier;
        $scope.document = document;
        return document;
    });
    //console.log('document: ', $scope.document);

    //authentication.js and services (guid is in services)

  //HERE, the form hasn't been introduced to the scope yet. I need to wait till that happens (Link function? Cotnroller definition obejct?), then I need to watch budget and update the validity when it changes.
    //$scope.editProjectForm.addActivity.$setValidity("size", $scope.budget.length >= 1);

    //TODO: is this used anywhere anymore?
    $scope.file_server = 'http://localhost:2020';
    $scope.$on("documentInvalid", function(){
      $scope.tab = "review";
    });

    $scope.$watch("tab", function(tab) {
      if(tab == "review")
        validate();
    });

    $scope.countriesAC = function() {
      return $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
      console.log('countries data format: ', data);
        var countries = data.data;
        for(var i = 0; i != countries.length; ++i)
          countries[i].__value = countries[i].name;

        return countries;
      });
    };

    $scope.identifierMapping = function(item) {
        return {identifier: item.identifier};
    };

    function validate() {

      $scope.validationReport = null;

      var oDocument = $scope.reviewDocument = $scope.document; //getCleanDocument()

      return IStorage.documents.validate(oDocument).then(function(success) {

        $scope.validationReport = success.data;
        return !!(success.data && success.data.errors && success.data.errors.length);

      }).catch(function(error) {

        $scope.onError(error.data);
        return true;

      });
    }

    $scope.save = function(localSchemaName) {
      //authentication.js and services (guid is in services)
      //schema and realm
      //$http.post('http://localhost:1818/api/'+schemaName, $scope[singularKey])
      editFormUtility.saveDraft($scope.document).then(function(result) {;
        editFormUtility.load(id, localSchemaName).then(function(response) {
            console.log('Response: ', response);
        });
      });
        /*
        .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
        });
        */
    };
  });

  app.factory('guid', function() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return function() {
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
    }
  });
});

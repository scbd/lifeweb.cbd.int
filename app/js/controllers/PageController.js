require(['app', 'authentication', 'URI',], function(app) {
    app.controller('PageController', function($scope, $browser, authHttp, authentication) {

        //==============================
        //
        //==============================
        function signIn() // Set the signin Url with good returnurl
        {
            var oCurrentUrl = URI();
            var oSignInConfig = {
                hostname : oCurrentUrl.host(),
                path     : "/member/signin",
            };

            if (!oCurrentUrl.host().match(/.*\.local$/)) //Force HTTPS on non .local domains
                oSignInConfig.protocol = "https";

            oSignInConfig.query = oCurrentUrl.path() != oSignInConfig.path // Set returnUrl
                  ? URI.buildQuery({ returnurl: (oCurrentUrl.path() + oCurrentUrl.search()) })
                  : oCurrentUrl.query();

            document.location = URI.build(oSignInConfig); //Set new signinUrl
        }

        //==============================
        //
        //==============================
        function signOut($scope) {// Set the signin Url with good returnurl
            authentication.signOut().then(function() {
                $scope.session = angular.extend({
                    "isAdministrator": false,
                    "isEditor":        false
                }, authentication.user());
            });
        }

        //==============================
        //
        //==============================
        function toSectionMenuItems(menuItems) // Set the signin Url with good returnurl
        {
            menuItems = angular.fromJson(angular.toJson(menuItems));

            for (var i = menuItems.length - 1; i >= 0; --i) {
        
                if (menuItems[i].isSection)
                    continue;

                menuItems[i].isSection = true;

                if (menuItems[i].menuItems) {
                    var oSubItems = menuItems[i].menuItems;

                    menuItems[i].menuItems = null;

                    for (var j = oSubItems.length-1; j>=0; j--)
                        menuItems.splice(i + 1, 0, oSubItems[j]);
                }
            }

            return menuItems;
        }

        // Init scope

        /* TODO: figure out where to get $$cms
        $scope.menuItems           = toSectionMenuItems($$cms.navigation.menuItems);
        $scope.breadcrumbs         = $$cms.navigation.breadcrumbs;
        $scope.IsHeroVisible       = $$cms.document.documentId == 16110;
        $scope.session             = $$cms.session;
        */
        $scope.signIn              = function() { signIn ($scope); };
        $scope.signOut             = function() { signOut($scope); };

        /*
        if (!authentication.user())
            authentication.user({
                userID          : $$cms.session.userID,
                name            : $$cms.session.name,
                email           : $$cms.session.email,
                government      : $$cms.session.government,
                roles           : $$cms.session.roles,
                isAuthenticated : $$cms.session.isAuthenticated
            });
            */
    });
});
		

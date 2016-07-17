var app = angular.module('CCApp', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl : './views/home.html',
        controller : 'HomeCtrl'
    })
    .when('/countries', {
        templateUrl : './views/countries.html',
        controller : 'SearchCtrl'
    })
    .when('/countries/:country', {
        templateUrl : './views/countryDetail.html',
        controller : 'DeetsCtrl'
    })
    .when('/error', {
        templateUrl : './views/error.html'
    })
    .otherwise('/error', {
        templateUrl : './views/error.html'
    });
}]);

app.run(['$rootScope', '$timeout', '$location', function($rootScope, $timeout, $location){
    $rootScope.$on('$routeChangeError', function(){
        $location.path('/error');
    });
    $rootScope.$on('$routeChangeStart', function(){
        if($location.path() === '/'){
            $rootScope.isLoading = false;
        }
        else {
            $rootScope.isLoading = true;
        }
    });
    $rootScope.$on('$routeChangeSuccess', function(){
        if($location.path() != '/'){
            $timeout(function(){
                $rootScope.isLoading = false;
            }, 2000);
        }
    });
}]);

app.factory('allCountryFacts', ['$location', '$http', function($location, $http){
    var reqURL = 'http://api.geonames.org/countryInfoJSON?username=dcaponi';
    var countries = [];
    var country = {};
    $http.get(reqURL, {cache:true})
    .then(function(result){
        for (var i=0; i<result.data.geonames.length; i++){
            countries[i] = result.data.geonames[i];
        }
        return countries;
    },
    function(status){
        console.error('Sorry bro, Error:' + status);
    });
    
    function getCountries(){
        return countries;
    }
    
    function singleCountry(nameProvided){
        for(var i=0; i<countries.length; i++){
            if(countries[i].countryName == nameProvided){
                country = countries[i];
            }
        }
        return country;
    }
    
    return { 
        getCountries : getCountries,
        getOneCountry: singleCountry
    };
}]);

app.factory('capitalFacts', ['$location', '$http', function($location, $http){
    var getCapital = function(singleCountry, callback){
        var params = {
            q: singleCountry.capital,
            country: singleCountry.countryCode,
            fcode: 'pplc',
            username: 'dcaponi'
        }
        return $http({
            method: 'GET',
            url: 'http://api.geonames.org/searchJSON?username=dcaponi',
            cache: true,
            params: params
        })
        .success(function(result){
            var capitalInfo = result.geonames[0];
            callback(capitalInfo);
        })
        .error(function(result){
            console.error('Sorry bro, Error:' + status);
        });
    }
    
    return {
        getCapital: getCapital,
    }
}]);

app.factory('neighborsService', ['$location', '$http', function($location, $http){
    var getNeighbors = function(singleCountry, callback){
        var reqURL = "http://api.geonames.org/neighboursJSON?geonameId="+singleCountry.geonameId+"&username=dcaponi";
        return $http.get(reqURL, {cache:true})
        .then(function(result){
            var neighbors = result.data.geonames;
            console.log(neighbors);
            callback(neighbors);
        },
        function(status){
            console.error('Sorry bro, Error:' + status);
        });
    }
    
    return {
        getNeighbors: getNeighbors
    }
    
}]);

app.controller('HomeCtrl', ['$scope', '$rootScope', '$location', '$timeout', function($scope, $rootScope, $location, $timeout){
    console.log("HOME");
}]);

app.controller('SearchCtrl', ['allCountryFacts', '$scope', '$rootScope', '$location', '$timeout', function(allCountryFacts, $scope, $rootScope, $location, $timeout){
    $scope.countries = allCountryFacts.getCountries();
    $scope.toDetails = function(countryName){
        $location.path('countries/' + countryName);
    }
}]);

app.controller('DeetsCtrl', ['allCountryFacts', 'capitalFacts', 'neighborsService', '$scope', '$rootScope', '$location', '$timeout', '$routeParams', function(allCountryFacts, capitalFacts, neighborsService, $scope, $rootScope, $location, $timeout, $routeParams){
    $scope.singleCountry = allCountryFacts.getOneCountry($routeParams.country);
    var capitalFacts = capitalFacts.getCapital($scope.singleCountry, function(data){
        $scope.capitalFacts = data;
        $scope.capitalFacts.flag = "http://www.geonames.org/flags/x/"+$scope.capitalFacts.countryCode.toLowerCase()+".gif";
        $scope.capitalFacts.map = "http://www.geonames.org/img/country/250/"+$scope.capitalFacts.countryCode+".png";
        return $scope.capitalFacts;
    });
    var neighbors = neighborsService.getNeighbors($scope.singleCountry, function(data){
       $scope.neighbors = data;
    });
    $scope.toDetails = function(countryName){
        $location.path('countries/' + countryName);
    }

}]);


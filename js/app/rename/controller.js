"use strict"
angular.module("uploader-app")
	.controller("rename-controller", ["$scope", "$dialogue", "currentName",  function($scope, $dialogue, currentName){
		let scope = $scope

		scope.fileName = currentName

		scope.validPaturn = /^[a-zA-Z0-9\-\_\(\)\ \+\.]{1,60}$/

		scope.rename = function(){
			$dialogue.accept(scope.fileName)
		}

	}])

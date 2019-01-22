"use strict"
angular.module("uploader-app")
	.controller("app-controller", ["$scope", "api", "dialogue", "$timeout", function($scope, api, dialogue, $timeout){
		let scope = $scope

		scope.pathParts = []

		scope.filesList = []

		scope.listFiles = function(){
			let pathUrl = scope.pathParts.reduce(function(totalUrl, currentPart){
				return totalUrl + `${currentPart}/`
			}, "/")

			api.list(pathUrl).then(function(result){
				scope.filesList = result.data
			})
		}

		scope.listFiles()

		scope.createFolder = function(){
			dialogue({
				template: "<div>placeholder</div>",
				controller: function($scope, $dialogue){
					console.log("controller instantiated", arguments)
					$scope.foo = "bar"

					$timeout(function(){
						$dialogue.accept("foo")
					}, 5000)
				}
			})
		}

	}])

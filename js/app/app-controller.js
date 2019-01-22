"use strict"
angular.module("uploader-app")
	.controller("app-controller", ["$scope", "api", "dialogue", function($scope, api, dialogue){
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

				}
			})
		}

	}])

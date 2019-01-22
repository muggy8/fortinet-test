"use strict"
angular.module("uploader-app")
	.controller("app-controller", ["$scope", "api", function($scope, api){
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

	}])

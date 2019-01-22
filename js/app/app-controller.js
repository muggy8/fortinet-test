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

			return api.list(pathUrl).then(function(result){
				scope.filesList = result.data
				return result
			})
		}

		scope.listFiles()

		scope.createFolder = function(){
			dialogue({
				templateUrl: "js/app/create-folder/template.html",
				controller: "create-folder-controller",
				resolve: {
					currentContents: scope.listFiles
				}
			})
		}

	}])

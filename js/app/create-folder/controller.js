"use strict"
angular.module("uploader-app")
	.controller("create-folder-controller", ["$scope", "$dialogue", "dialogue", "currentContents", function($scope, $dialogue, dialogue, currentContents){
		let scope = $scope
		currentContents = currentContents || []

		scope.validPaturn = /^[a-zA-Z0-9\-\_\(\)\ \+\.]{1,60}$/

		scope.fileNameInputted = function(){
			let isNew = currentContents.reduce(function(assumption, currentContent){
				return assumption && currentContent.name !== scope.fileName
			}, true)

			if (!isNew){
				dialogue({
					template: "This name is already in use."
				})
			}
			else{
				$dialogue.accept(scope.fileName)
			}
		}
	}])

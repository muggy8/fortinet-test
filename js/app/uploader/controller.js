"use strict"
angular.module("uploader-app")
	.controller("uploader-controller", ["$scope", "$timeout", "$dialogue", "api", function($scope, $timeout, $dialogue, api){
		let scope = $scope

		$timeout(function(){
			// do this on the next tick once the view has been appended
			document.getElementById("file-select").scope = scope
		})

		scope.files = []

		function addFiles(files){
			Array.prototype.forEach.call(files, function(file){
				scope.files.push({
					progres: 0,
					file: file,
					name: file.name
				})
			})
		}

		scope.externals = {
			fileDrop: function(event){
				event.preventDefault()
				event.stopPropagation()

				let files = event.dataTransfer.files

				addFiles(files)

				scope.$apply()
			},
			selectChange: function(event, self){
				event.preventDefault()
				event.stopPropagation()

				let files = self.files

				addFiles(files)

				scope.$apply()
			}
		}

	}])

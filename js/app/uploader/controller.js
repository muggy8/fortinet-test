"use strict"
angular.module("uploader-app")
	.controller("uploader-controller", ["$scope", "$timeout", "$dialogue", "api", "folder", function($scope, $timeout, $dialogue, api, folder){
		let scope = $scope

		$timeout(function(){
			// do this on the next tick once the view has been appended
			document.getElementById("file-select").scope = scope
		})

		scope.files = []

		function addFiles(files){
			Array.prototype.forEach.call(files, function(file){
				let fileModel = {
					progress: 0,
					file: file,
					name: file.name,
					uploadEventHandlers: {
						progress: function(event){
							fileModel.progress = Math.floor((event.loaded / event.total) * 100)

							console.log(event, fileModel.progress)
						}
					}
				}
				scope.files.push(fileModel)
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

		let uploading = false
		scope.canShowUploadButton = function(){
			if (!scope.files.length){
				return false
			}

			if (uploading){
				return false
			}

			let allUploaded = scope.files.reduce(function(assumption, currentFile){
				return assumption && currentFile.progress === 100
			}, true)

			if (allUploaded){
				return false
			}

			return true
		}

		scope.upload = function(){
			uploading = true
			api.upload(folder, scope.files).then(function(){
				uploading = false
			})
		}

		scope.close = function(){
			$dialogue.accept()
		}

	}])

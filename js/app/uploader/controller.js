"use strict"
angular.module("uploader-app")
	.controller("uploader-controller", ["$scope", "$timeout", "$dialogue", "api", "folder", "dialogue", "files", function($scope, $timeout, $dialogue, api, folder, dialogue, files){
		let scope = $scope

		$timeout(function(){
			// do this on the next tick once the view has been appended
			document.getElementById("file-select").scope = scope
		})

		scope.files = []

		function addFiles(files){
			let rejected = []
			Array.prototype.forEach.call(files, function(file){
				if (!/(\.js|\.php|\.css|\.html)$/.test(file.name)){
					rejected.push(file)
					return
				}

				let fileModel = {
					progress: 0,
					file: file,
					name: file.name,
					uploadEventHandlers: {
						progress: function(event){
							fileModel.progress = Math.floor((event.loaded / event.total) * 100)
						}
					}
				}
				scope.files.push(fileModel)
			})

			if (rejected.length){
				dialogue({
					template: rejected.reduce(function(message, file){
						return `${message}<br>${file.name}`
					}, "<strong>The following files can not be uploaded:</strong>")
				}).catch(function(closed){
					// ok
				})
			}
		}

		if (files){
			addFiles(files)
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
			return api.upload(folder, scope.files).then(function(){
				scope.close()
			}, function(errors){
				// something happened with the results and we now have a some errors.
				errors.forEach(function(result){
					if (result.error){
						result.source.progress = 0
						result.source.error = result.data
					}
				})
			}).then(function(){
				// get rid of uploaded files
				scope.files = scope.files.filter(function(file){
					return file.progress === 0
				})

				uploading = false
			})
		}

		scope.close = function(){
			$dialogue.accept()
		}

	}])

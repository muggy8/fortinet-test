"use strict"
angular.module("uploader-app")
	.controller("app-controller", ["$scope", "$timeout", "api", "dialogue", function($scope, $timeout, api, dialogue){
		let scope = $scope

		scope.pathParts = []

		scope.filesList = []

		$timeout(function(){
			// do this on the next tick once the view has been appended
			document.querySelector("[ng-controller='app-controller']").scope = scope


			function defaultPreventer(ev){
				ev.preventDefault()
			}

			let dropReciever = document.getElementById("drop-receiver")

			dropReciever.scope = scope

			// allow dropping to happen here
			dropReciever.addEventListener("dragenter", defaultPreventer)

			dropReciever.addEventListener("dragover", defaultPreventer)
		})

		scope.externals = {
			draggingFiles: false,
			dropFiles: function(event){
				event.preventDefault()
				event.stopPropagation()

				let files = event.dataTransfer.files

				scope.externals.draggingFiles = false
				scope.$apply()
				
				scope.openUploader(files)

			},
			filesEnterMain(event){
				console.log("Enter", event.target)

				event.preventDefault()
				event.stopPropagation()
				scope.externals.draggingFiles = true
				scope.$apply()
			},
			filesLeaveZone(event){
				event.preventDefault()
				event.stopPropagation()

				console.log("Leave", event.target)
				scope.externals.draggingFiles = false
				scope.$apply()
			}
		}

		let getPathUrl = scope.getPathUrl = function(){
			return scope.pathParts.reduce(function(totalUrl, currentPart){
				return totalUrl + `${currentPart}/`
			}, "/")
		}

		scope.listFiles = function(){
			let pathUrl = getPathUrl()
			scope.filesList = []
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
			}).then(function(fileName){
				return api.createFolder(getPathUrl(), fileName)
			}, function(err){
				// this is to catch the dialogue rejections
				console.warn(err)
			}).then(function(){
				return scope.listFiles()
			}, function(err){
				// this is to catch the http errors
				return dialogue({
					template: err.data.message
				})
			}).catch(function(err){
				// this is to catch the dialogue closed
			})
		}

		scope.open = function(dirOrFile){
			if (dirOrFile.type === "dir"){
				scope.pathParts.push(dirOrFile.name)
				scope.listFiles()
			}
		}

		scope.delete = function(dirOrFile){
			dialogue({
				template: `
					<div>
						<div>Are You sure you want to delete ${dirOrFile.name}
						</div>
						<div class="flex margin-top">
							<button class="grow" ng-click="accept()">Delete</button>
							<div class="padding-left"></div>
							<button class="grow" ng-click="reject('cancel')">Cancle</button>
						</div>
					</div>
				`
			}).then(function(){
				// users says they're sure about the deletion sooo...

				return api.delete(getPathUrl(), dirOrFile.name)
			}, function(cancled){
				// good call not deleteing things
			}).then(function(){
				return scope.listFiles()
			}, function(err){
				return dialogue({
					template: err.data.message
				})
			}).catch(function(cancled){
				// ok
			})
		}

		scope.rename = function(dirOrFile){
			dialogue({
				templateUrl: "js/app/rename/template.html",
				controller: "rename-controller",
				resolve: {
					currentName: function(){
						return dirOrFile.name
					}
				}
			}).then(function(newFileName){
				return api.rename(getPathUrl(), dirOrFile.name, newFileName)
			}, function(closed){
				// ok
			}).then(function(){
				return scope.listFiles()
			}, function(err){
				return dialogue({
					template: err.data.message
				})
			}).catch(function(closed){
				// ok
			})
		}

		scope.backOne = function(){
			scope.pathParts.splice(scope.pathParts.length - 1, 1)
			scope.listFiles()
		}

		scope.openUploader = function(files){
			dialogue({
				templateUrl: "js/app/uploader/template.html",
				controller: "uploader-controller",
				autoClose: false,
				resolve: {
					folder: getPathUrl,
					files: function(){
						return files
					}
				}
			}).then(function(yay){
				scope.listFiles()
			}, function(err){
				// user cancel the upload
				console.warn(err)
			})
		}

	}])

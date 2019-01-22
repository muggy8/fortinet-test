"use strict"
angular.module("uploader-app")
	.controller("app-controller", ["$scope", "api", "dialogue", function($scope, api, dialogue){
		let scope = $scope

		scope.pathParts = []

		scope.filesList = []

		function getPathUrl(){
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
			}).catch(function(err){
				// this is to catch the http errors
				return dialogue({
					template: err.data.message
				})
			}).catch(function(err){
				// this is to catch the dialogue rejections
				console.warn(err)
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

				return api.delete(getPathUrl() + dirOrFile.name)
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

		scope.backOne = function(){
			scope.pathParts.splice(scope.pathParts.length - 1, 1)
			scope.listFiles()
		}

		scope.openUploader = function(){
			dialogue({
				templateUrl: "js/app/uploader/template.html",
				controller: "uploader-controller",
				autoClose: false,
				resolve: {
					folder: getPathUrl
				}
			}).then(function(yay){
				scope.listFiles()
			}, function(err){
				// user cancel the upload
				console.warn(err)
			})
		}

	}])

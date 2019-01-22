"use strict"
angular.module("uploader-app")
	.factory("api", ["$http", "$q", "api-url", function($http, $q, apiUrl){
		let api = {}

		api.list = function(path){
			return $http({
				method: "GET",
				url: `${apiUrl}/list.php?path=${path}`
			})
		}

		api.createFolder = function(path, name){
			return $http({
				method: "POST",
				url: `${apiUrl}/create-folder.php`,
				data: {
					path: `${path}/${name}`.replace(/(\/\/)/g, "/")
				}
			})
		}

		api.upload = function(files){
			return $q.all(files.map(function(file){
				return $http({
					method: "POST",
					url: `${apiUrl}/upload.php`,
					data: file
				})
			}))
		}
		api.uploadParallel = api.upload

		api.uploadSequence = function(files){
			return files.reduce(function(currentResolvingPromise, file){
				return currentResolvingPromise.then(function(arrayOfResults){
					return $http({
						method: "POST",
						url: `${apiUrl}/upload.php`,
						data: file
					}).then(function(result){
						arrayOfResults.push(result)
						return arrayOfResults
					})
				})
			}, $q.resolve([]))
		}

		api.download = function(fileName){

		}

		api.rename = function(oldName, newName){
			return $http({
				method: "POST",
				url: `${apiUrl}/rename.php`,
				data: {
					oldName: oldName,
					newName: newName
				}
			})
		}

		api.delete = function(fileName){
			return $http({
				method: "DELETE",
				url: `${apiUrl}/delete.php?file=${fileName}`,
			})
		}

		return api
	}])

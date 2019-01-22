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

		api.upload = function(folder, files){
			return $q.all(files.map(function(file){

				let formData = new FormData()
				formData.append("file", file.file)
				formData.append("name", file.name)
				formData.append("folder", folder)

				return $http({
					headers: {
						"Content-Type": undefined
					},
					method: "POST",
					url: `${apiUrl}/upload.php`,
					data: formData,
					uploadEventHandlers: file.uploadEventHandlers
				})
			}))
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

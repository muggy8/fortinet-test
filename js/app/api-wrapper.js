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
			let hasError = false
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
				}).catch(function(error){
					// this will allow the errors to pass through and not trigger the promise.all till the end
					hasError = true
					error.error = true
					error.source = file
					return error
				})
			})).then(function(results){
				if (hasError){
					return $q.reject(results)
				}
				else{
					return $q.resolve(results)
				}
			})
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

		api.delete = function(filePath, fileName){
			return $http({
				method: "DELETE",
				url: `${apiUrl}/delete.php?path=${filePath}&file=${fileName}`,
			})
		}

		return api
	}])

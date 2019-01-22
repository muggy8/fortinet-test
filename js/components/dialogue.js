angular.module("components")
	.factory("dialogue", ["$http", "$q", "$compile", "$controller", "$rootScope", function($http, $q, $compile, $controller, $rootScope){
		return function({template, controller, templateUrl, resolve}){
			let toResolve = $q.resolve()

			// fetch the template URL if defined
			if (!template && templateUrl){
				$http.get(templateUrl, {cache: true}).then(function(result){
					template = result.data
				})
			}

			// resolve all items that needs to be resolved asynchronously
			if (resolve){
				toResolve = Object.getOwnPropertyNames(resolve)
					.reduce(function(lastPromise, resolveKey){
						return lastPromise.then(function(){
							return resolve[resolveKey]
						}).then(function(result){
							if (result.data){
								resolve[resolveKey] = result.data
							}
							else{
								resolve[resolveKey] = result
							}
						})
					}, toResolve)
			}
			else{
				resolve = {}
			}

			// everything should be resolved now
			return toResolve.then(function(){
				return $q(function(accept, reject){
					resolve.$scope = Object.create($rootScope)

					resolve.$dialogue = {
						accept: function(result){
							element.remove()
							accept(result)
						},
						reject: function(reason){
							element.remove()
							reject(reason)
						}
					}

					let controllerInstance = $controller(controller || function(){}, resolve)

					let linkFn = $compile(template)

					let element = linkFn(resolve.$scope)

					console.log(resolve.$scope, element)

		 			angular.element(document.body).append(element)
				})
			})
		}
	}])

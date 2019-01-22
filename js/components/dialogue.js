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

			// everything should be resolved now
			return toResolve.then(function(){
				return $q(function(accept, reject){
					resolve.scope = Object.create($rootScope)
					resolve.$dialogue = {
						accept: function(result){
							document.body.removeChild(element)
							accept(result)
						},
						reject: function(reason){
							document.body.removeChild(element)
							reject(reason)
						}
					}

					let scope = $controller(controller, resolve)

					let linkFn = $compile(template)

					let element = linkFn(scope)

					document.body.appendChild(element)
				})
			})
		}
	}])

"use strict"
angular.module("components")
	.factory("dialogue", ["$http", "$q", "$compile", "$controller", "$rootScope", function($http, $q, $compile, $controller, $rootScope){
		return function({template, controller, templateUrl, resolve, autoClose}){
			let toResolve = $q.resolve()

			// fetch the template URL if defined
			if (!template && templateUrl){
				toResolve = $http.get(templateUrl, {cache: true}).then(function(result){
					template = result.data
				})
			}

			// resolve all items that needs to be resolved asynchronously
			if (resolve){
				toResolve = Object.getOwnPropertyNames(resolve)
					.reduce(function(lastPromise, resolveKey){
						return lastPromise.then(function(){
							return resolve[resolveKey]()
						}).then(function(result){
							if (Object.prototype.hasOwnProperty.call(result, "data")){
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

					resolve.$dialogue = $rootScope.$new()

					resolve.$dialogue.accept = function(result){
						element.remove()
						accept(result)
					}

					resolve.$dialogue.reject = function(reason){
						element.remove()
						reject(reason)
					}

					resolve.$dialogue.$autoClose = typeof autoClose !== "boolean" || autoClose

					resolve.$scope = resolve.$dialogue.$new()

					let controllerInstance = $controller(controller || function(){}, resolve)

					let linkFn = $compile(`
						<div class="dialogue-backdrop flex vhcenter" ng-click="$autoClose && reject('closed')">
							<div class="dialogue-body padding" ng-click="$event.stopImmediatePropagation()">
								${template}
							</div>
						</div>
					`)

					let element = linkFn(resolve.$scope)

		 			angular.element(document.body).append(element)
				})
			})
		}
	}])

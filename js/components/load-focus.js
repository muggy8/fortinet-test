"use strict"
angular.module("components")
	.directive("loadFocus", ["$timeout", function($timeout){
		return {
			link: function(scope, $ele, attr){
				$timeout(function(){
					$ele[0].focus()
				})
			}
		}
	}])

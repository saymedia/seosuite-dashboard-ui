'use strict';

angular.module('reclusedashApp')
    .filter('replace', function() {
        return function(input, from, to) {
            return input.replace(from, to);
        };
    });
'use strict';

angular.module('reclusedashApp')
    .factory('CrawlLink', function($http, $resource, Config) {
        var baseUrl = Config.apiBaseUrl + '/link';
        var CrawlLink = $resource(baseUrl);

        return CrawlLink;
    });
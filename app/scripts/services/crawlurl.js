'use strict';

angular.module('reclusedashApp')
    .factory('CrawlUrl', function($http, $resource, Config) {
        var baseUrl = Config.apiBaseUrl + '/url';
        var CrawlUrl = $resource(baseUrl);

        CrawlUrl.job = function (jobId, external, page, filters) {
            external = typeof external === 'undefined' || external === null ? 1 : external;
            page = page || 1;
            var params = {
                /*jshint camelcase: false */
                order_by: 'timestamp',
                run_id: jobId,
                external: external,
                page: page,
                offset: (page - 1) * 20
                /*jshint camelcase: true */
            };

            angular.forEach(filters, function (f) {
                params[f[0]] = f[1];
            });

            return $http.get(baseUrl, {
                params: params
            });
        };

        CrawlUrl.jobs = function (jobId) {
            var params = jobId ? {'job': jobId} : {};
            params.limit = 2;
            return $http.get(baseUrl + '/jobs', { params: params });
        };


        CrawlUrl.crawl = function (url, follow) {
            return $http.get(baseUrl + '/crawl', { params: {
                url: url,
                follow: follow
            }});
        };

        return CrawlUrl;
    });
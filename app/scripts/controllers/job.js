'use strict';

angular.module('reclusedashApp')
    .controller('JobCtrl', function($scope, $routeParams, CrawlUrl, CrawlLink) {

        $scope.totalUrlCount = 0;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;
        $scope.filters = [];

        CrawlUrl.jobs($routeParams.jobId)
        .success(function (data) {
            $scope.overview = data.objects[0] || [];
        })
        .error(function (error) {
            console.error(error);
        });

        function updateUrls() {
            CrawlUrl.job($routeParams.jobId, 0, $scope.currentPage, $scope.filters)
            .success(function (data) {
                /*jshint camelcase: false */
                $scope.urls = data.objects || [];
                $scope.totalUrlCount = data.meta.total_count;
                console.log(data);
                /*jshint camelcase: true */
            })
            .error(function (error) {
                console.error(error);
            });
        }

        $scope.$watch('currentPage', function (page) {
            console.log(page);
            if (page) {
                updateUrls();
            }
        });
        $scope.$watch('filters', updateUrls);

        function _filterIndex(filter, value) {
            var res = -1;
            angular.forEach($scope.filters, function (f, i) {
                if (f[0] === filter && f[1] === value) {
                    res = i;
                }
            });
            return res;
        }

        $scope.addFilter = function (filter, value) {
            console.log('adding', filter, value, _filterIndex(filter, value));
            if (_filterIndex(filter, value) === -1) {
                $scope.filters.push([filter, value]);
                updateUrls();
            }
        };

        $scope.removeFilter = function (filter, value) {
            var i = _filterIndex(filter, value);
            if (i !== -1) {
                $scope.filters.splice(i, 1);
                updateUrls();
            }
        };

        $scope.getLintLevel = function (code) {
            var char = code.toUpperCase().substring(0,1);
            if (char === 'E') {
                return 'danger';
            }
            else if (char === 'W') {
                return 'warning';
            }
            else if (char === 'I') {
                return 'info';
            }
            else if (char === 'C') {
                return 'active';
            }
            else {
                return '';
            }
        };


        $scope.lintCodes = {
            C22: 'No <head> section defined on the page',
            E02: 'The page\'s <title> is missing',
            E05: 'The page\'s meta description is missing',
            E08: 'The page\'s canonical url is missing',
            E09: 'No <h1> tags found on the page',
            E12: 'Fewer than 1 word matches between the page\'s <title> and the first <h1> on the page',
            E13: 'Fewer than 1 word matches between the page\'s <title> and the page\'s meta description',
            E17: 'More than 1000 links were found on the page',
            W03: 'The page\'s <title> was less than 58 characters',
            W06: 'The page\'s meta description was less than 150 characters',
            W14: 'The page\'s <title> matches fewer than 3 words with the first <h1>',
            W15: 'The page\'s <title> matches fewer than 3 words with the page\'s meta description',
            W16: 'More than 300 links were found on page',
            W18: 'The size of the page\'s markup is greater 200K',
            W19: 'Some of the <img> tags on the page were missing alt text',
            W23: 'More than one <h1> tag was found on the page',
            I10: 'No rel=prev links were found on the page',
            I11: 'No rel=next links were found on the page',
            I20: 'One or more links on the page has robots = nofollow',
            I21: 'One or more links on the page has robots = noindex',
        };

        // CrawlUrl.job($routeParams.jobId, 0, 1)
        // .success(function (data) {
        //     /*jshint camelcase: false */
        //     $scope.urls = data.objects || [];
        //     $scope.totalUrlCount = data.meta.total_count;
        //     console.log(data);
        //     /*jshint camelcase: true */
        // })
        // .error(function (error) {
        //     console.error(error);
        // });

        $scope.activeUrl = false;
        $scope.select = function (url) {
            if (url === $scope.activeUrl) {
                $scope.activeUrl = false;
            }
            else {
                $scope.activeUrl = url;
                // Load the inbound and outbound links on the page
                CrawlLink.get({to_url: url.id}, function (res) {
                    url.toLinks = res.objects;
                });
            }
        };

        $scope.isActive = function(url) {
            return url === $scope.activeUrl;
        };

    });
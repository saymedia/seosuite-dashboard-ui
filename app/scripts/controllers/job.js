'use strict';

angular.module('reclusedashApp')
    .controller('JobCtrl', function($scope, $routeParams, CrawlUrl) {

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
            E02: 'has title',
            W03: 'title < 58 chars',
            E05: 'has meta description',
            W06: 'meta description < 150 chars',
            E08: 'has canonical',
            E09: 'has h1',
            I10: 'missing rel=prev',
            I11: 'missing rel=next',
            E12: 'title matches <1 h1 word',
            E13: 'title matches <1 meta description word',
            W14: 'title matches <3 h1 words',
            W15: 'title matches <3 meta description word',
            W16: '<300 outlinks on page',
            E17: '<1000 outlinks on page',
            W18: 'size < 200K',
            W19: 'all img tags have alt attribute',
            I20: 'has robots=nofollow',
            I21: 'has robots=noindex',
            C22: 'has head',
            W23: 'h1 count > 1',
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
            }
        };

        $scope.isActive = function(url) {
            return url === $scope.activeUrl;
        };

    });
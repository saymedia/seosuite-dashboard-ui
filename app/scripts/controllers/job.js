'use strict';

angular.module('reclusedashApp')
    .controller('JobCtrl', function($scope, $routeParams, CrawlUrl, CrawlLink) {

        $scope.totalUrlCount = 0;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 15;
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
                console.log(data.meta.total_count);
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

        $scope.httpCodes = {
            100: '100: Continue',
            101: '101: Switching Protocols',
            102: '102: Processing',
            200: '200: OK',
            201: '201: Created',
            202: '202: Accepted',
            203: '203: Non-Authoritative Information',
            204: '204: No Content',
            205: '205: Reset Content',
            206: '206: Partial Content',
            207: '207: Multi-Status',
            208: '208: Already Reported',
            226: '226: IM Used',
            300: '300: Multiple Choices',
            301: '301: Moved Permanently',
            302: '302: Found',
            303: '303: See Other',
            304: '304: Not Modified',
            305: '305: Use Proxy',
            306: '306: (Unused)',
            307: '307: Temporary Redirect',
            308: '308: Permanent Redirect',
            400: '400: Bad Request',
            401: '401: Unauthorized',
            402: '402: Payment Required',
            403: '403: Forbidden',
            404: '404: Not Found',
            405: '405: Method Not Allowed',
            406: '406: Not Acceptable',
            407: '407: Proxy Authentication Required',
            408: '408: Request Timeout',
            409: '409: Conflict',
            410: '410: Gone',
            411: '411: Length Required',
            412: '412: Precondition Failed',
            413: '413: Payload Too Large',
            414: '414: URI Too Long',
            415: '415: Unsupported Media Type',
            416: '416: Requested Range Not Satisfiable',
            417: '417: Expectation Failed',
            422: '422: Unprocessable Entity',
            423: '423: Locked',
            424: '424: Failed Dependency',
            425: '425: Unassigned',
            426: '426: Upgrade Required',
            427: '427: Unassigned',
            428: '428: Precondition Required',
            429: '429: Too Many Requests',
            430: '430: Unassigned',
            431: '431: Request Header Fields Too Large',
            500: '500: Internal Server Error',
            501: '501: Not Implemented',
            502: '502: Bad Gateway',
            503: '503: Service Unavailable',
            504: '504: Gateway Timeout',
            505: '505: HTTP Version Not Supported',
            506: '506: Variant Also Negotiates (Experimental)',
            507: '507: Insufficient Storage',
            508: '508: Loop Detected',
            509: '509: Unassigned',
            510: '510: Not Extended',
            511: '511: Network Authentication Required'
        };

        $scope.contentTypes = {
            'text/html': 'HTML',
            'text/xml': 'XML',
            'image/jpeg': 'Image (JPG)',
            'image/png': 'Image (PNG)',
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
                /*jshint camelcase: false */
                CrawlLink.get({to_url: url.id}, function (res) {
                    url.toLinks = res.objects;
                });
                /*jshint camelcase: true */
            }
        };

        $scope.isActive = function(url) {
            return url === $scope.activeUrl;
        };

    });
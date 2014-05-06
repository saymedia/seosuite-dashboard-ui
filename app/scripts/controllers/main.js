'use strict';

angular.module('reclusedashApp')
    .controller('MainCtrl', function($scope, $location, $timeout, CrawlUrl) {
        $scope.crawlUrl = null;
        $scope.followInternal = false;

        function updateRecentJobs() {
            CrawlUrl.jobs()
            .success(function (data) {
                $scope.jobs = data.objects || [];
            })
            .error(function (error) {
                console.error(error);
            });
        }

        $scope.gotoJob = function (jobId) {
            $location.path('/job/' + jobId);
        };

        $scope.crawlSite = function () {
            if ($scope.crawlUrl) {
                CrawlUrl.crawl($scope.crawlUrl, $scope.followInternal).success(function () {
                    $scope.crawlJobState = 'text-success';
                    $scope.crawlJobStatus = '<i class="glyphicon glyphicon-ok"></i> ' +
                        $scope.crawlUrl + ' is now being crawled.';
                })
                .error(function () {
                    $scope.crawlJobState = 'text-danger';
                    $scope.crawlJobStatus = '<i class="glyphicon glyphicon-remove"></i> An error occurred while starting the crawl process.';
                });

                $timeout(function () {
                    $scope.crawlJobStatus = null;
                    updateRecentJobs();
                }, 3000);
            }
        };

        updateRecentJobs();

    });
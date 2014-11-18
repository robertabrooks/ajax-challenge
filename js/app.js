
"use strict";

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '99zLjvwSgJ5Yv0cQvzMo3MeOEufJnTEFMQU31B07';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'rVa5FYYUkCCfx9IDbYyrZHuW01oqAAup1vkOvaqf';
    })
    .controller('CommentController', function($scope, $http) {
        $scope.loading = false;

        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl+'?order=-votes')
                .success(function(data) {
                    $scope.comments = data.results;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.newComment = {votes: 0};

        $scope.incrementVotes = function(comment, amount) {
            if (comment.votes > 0 || amount > 0) {
                $http.put(commentsUrl + '/' + comment.objectId, {
                    votes: {
                        __op: 'Increment',
                        amount: amount
                    }
                })
                    .success(function (responseData) {
                        console.log(responseData);
                        comment.votes = responseData.votes;
                    })
                    .error(function () {
                        console.log(err);
                    })
            }
        };

        $scope.addComment = function() {
            $scope.loading = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {votes: 0};
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                })
        };

        $scope.removeComment = function(comment) {
            if (window.confirm("Are you sure you want to delete this comment?")) {
                $scope.loading = true;
                $http.delete(commentsUrl + '/' + comment.objectId)
                    .finally(function () {
                        $scope.refreshComments();
                        $scope.loading = false;
                    })
            }
        };
    });

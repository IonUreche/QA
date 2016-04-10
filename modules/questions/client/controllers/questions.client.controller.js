(function () {
    'use strict';
    angular
        .module('questions')
        .controller('QuestionsController', QuestionsController);

    QuestionsController.$inject = ['$scope', '$state', 'questionResolve', 'answerResolve', '$window', 'Authentication', '$http'];

    function QuestionsController($scope, $state, question, answer, $window, Authentication, $http) {
        var vm = this;

        vm.question = question;
        vm.answer = answer;
        vm.authentication = Authentication;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.saveAnswer = saveAnswer;
        vm.addVote = addVote;

        // Remove existing Question
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.question.$remove($state.go('questions.list'));
            }
        }

        // Save Question
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.questionForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.question._id) {
                vm.question.$update(successCallback, errorCallback);
            } else {
                vm.question.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('questions.view', {
                    questionId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        // Save Answer
        function saveAnswer(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.answerForm');
                return false;
            }

            vm.answer.question_id = vm.question._id;

            vm.answer.$save(successCallback, errorCallback);

            function successCallback(res) {
                $window.location.reload();
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        function addVote(index, isUpVote) {
            var answer = question.answers[index];

            $http.post('api/votes/', {answer: answer, user: Authentication.user, question_id: vm.question._id, isUpVote: isUpVote}).then(successCallback, errorCallback);

            function successCallback(res) {
                answer.voteCount = res.data.answer.voteCount;
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());

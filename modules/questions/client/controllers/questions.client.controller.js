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
        vm.resolveQuestion = resolveQuestion;
        vm.reopenQuestion = reopenQuestion;
        vm.addLinkedProblem = addLinkedProblem;
        vm.viewLinkedProblem = viewLinkedProblem;
        vm.sortedArray = sortedArray;

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

        function currentUserIsQuestionAuthor(question)
        {
            return question.user._id == Authentication.user._id;
        }

        function customOrder(question, answer) {
            var sortRating = question.resolving_answer_id == answer._id ? 2000000000 : 0;

            return sortRating + answer.voteCount;
        }

        function sortedArray(question, answersArray)
        {
            var resultArray = answersArray.slice();
            resultArray.sort(function (a,b){
                return customOrder(question, a) < customOrder(question,b);
            });
            return resultArray;
        }

        function addVote(answer, isUpVote) {
            $http
              .post(
                'api/votes/',
                {answer: answer, user: Authentication.user, question_id: vm.question._id, isUpVote: isUpVote})
              .then(successCallback, errorCallback);

            function successCallback(res) {
                if(answer.voteCount != res.data.answer.voteCount) {
                    answer.voteCount = res.data.answer.voteCount;

                    if (answer.user._id == Authentication.user._id)
                        if (isUpVote)
                            Authentication.user.score += 5;
                        else
                            Authentication.user.score = Math.max(0, Authentication.user.score - 5);
                }
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        function resolveQuestion(answer) {
            console.log(answer.user);

            $http.post(
              'api/questions/resolve/' + vm.question._id,
              {answer: answer, user: answer.user, question_id: vm.question._id}
            ).then(successCallback, errorCallback);

            function successCallback(res) {
                question.is_resolved = true
                question.resolving_answer_id = answer._id;
                if (answer.user._id == Authentication.user._id)
                    Authentication.user.score += 100;
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        function reopenQuestion() {
            var answer = question.answers.filter(function (answer) {
                return answer._id == question.resolving_answer_id
            })[0];

            $http.post(
              'api/questions/reopen/' + vm.question._id,
              {user: answer.user, question_id: vm.question._id}
            ).then(successCallback, errorCallback);

            function successCallback(res) {
                question.is_resolved = false;
                question.resolving_answer_id = '';
                if (answer.user._id == Authentication.user._id)
                    Authentication.user.score = Math.max(0, Authentication.user.score - 100);
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        function addLinkedProblem() {
            $state.go('problems.create', {question_id: vm.question._id});
        }

        function viewLinkedProblem() {
            $state.go('problems.view', {problemId: vm.question.linked_problem_id});
        }
    }
}());


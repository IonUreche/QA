(function () {
    'use strict';

    angular
        .module('judge')
        .controller('JudgeController', JudgeController);

    JudgeController.$inject = ['$http', '$scope', '$state', 'problemResolve', 'Authentication', 'FileUploader'];

    function JudgeController($http, $scope, $state, problem, Authentication, FileUploader) {
        var vm = this;

        vm.availableOptions = [{'id': 1, name: 'python2.7'},
            {'id': 2, name: 'python3'},
            {'id': 3, name: 'ruby'},
            {'id': 4, name: 'javascriptV8'}
        ];

        vm.selectedOption = vm.availableOptions[0];
        vm.uploader = new FileUploader();
        vm.canSubmit = false;
        vm.problem = problem;
        if (!vm.problem.examples) {
            vm.problem.examples = [];
        }

        if (!vm.problem.tests) {
            vm.problem.tests = [];
        }
        vm.authentication = Authentication;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

        vm.addExample = addExample;
        vm.removeExample = removeExample;

        vm.addTest = addTest;
        vm.removeTest = removeTest;

        vm.submit = submit;

        vm.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        vm.uploader.onAfterAddingFile = function(fileItem) {
            // TODO: Possible hack? There should be a better way to do it.
            var reader = new FileReader();
            reader.readAsText(fileItem._file);
            reader.onload = function(e) {
                vm.submissionData = e.target.result;
                vm.canSubmit = true;
            };
        };


        // Remove existing Problem
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.problem.$remove($state.go('problems.list'));
            }
        }

        // Save Problem
        function save(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.problemForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.problem._id) {
                vm.problem.$update(successCallback, errorCallback);
            } else {
                vm.problem.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('problems.view', {
                    problemId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        // Add new example input
        function addExample() {
            vm.problem.examples.push({
                input: "",
                output: ""
            });
        }

        // Remove one example input
        function removeExample() {
            if (vm.problem.examples.length) {
                vm.problem.examples.pop();
            }
        }

        // Add new test input
        function addTest() {
            vm.problem.tests.push({
                input: "",
                output: ""
            });
        }

        // Remove one test input
        function removeTest() {
            if (vm.problem.tests.length) {
                vm.problem.tests.pop();
            }
        }

        // Submit a solution to a problem
        function submit() {
            if (!vm.submissionData || !vm.canSubmit) {
                return false;
            }

            var req = {
                method: 'POST',
                url: '/api/submissions/' + problem._id,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    submission: vm.submissionData,
                    language: vm.selectedOption.name,
                    user: vm.authentication.user
                }
            };

            $http(req).then(function successCallback(res) {
                $state.go('submissions.list');
            }, function errorCallback(res) {
                vm.error = res.data.message;
            });
        }

    }
})();

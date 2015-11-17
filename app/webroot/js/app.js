/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', ['nvd3'])


    .service('APIService', ['$http', function ($http) {


        this.getCurriculumsByType = function (type) {
            return $http.get(Constants.BASE_URL + '/curriculums/.json?type=' + type);
        };

        this.getNodesByNumber = function (number) {

            return $http.get(Constants.BASE_URL + '/nodes/.json?curriculum_number=' + number);
        };

        this.getNodesPieChartById = function (id) {

            return $http.get(Constants.BASE_URL + '/grades/pie/' + id + '.json');

        };
    }])

    .service("NodesPieChartService", function ($rootScope) {

        this.broadcast = function (node) {
            $rootScope.$broadcast('updateNodesPieChart', {selectedNode: node});
        };

        this.listen = function (callback) {
            $rootScope.$on('updateNodesPieChart', callback);
        };
    })

    .controller('AppCtrl', function () {
        this.currentLevel = 0;
        this.currentUser = '';
        this.currentGraph = '';

        this.setLevel = function (lvl) {
            this.currentLevel = lvl;
        };

        this.collapse = function (lvl) {
            if (this.currentLevel > lvl) {
                return 'collapsed';
            }
            else return '';
        };

        this.setUser = function (user) {
            this.currentUser = user;
            this.setLevel(1)
        };

        this.setGraph = function (graph) {
            this.currentGraph = graph;
            this.setLevel(2);
        };

        this.showGraph = function () {
            if (this.currentUser == 'lecturer' && this.currentGraph == 'moduleGraph') {
                return 'moduleGraph'
            }
            else {
                return false
            }
        };


    })

    .controller('ModuleGradesCtrl', ['APIService', 'NodesPieChartService', function (APIService, NodesPieChartService) {
        this.curriculumTypes = [{name: 'Bachelor of Science', value: 'bachelor'}, {
            name: 'Master of Science',
            value: 'master'
        }];
        this.curriculums = [];
        this.nodes = [];

        this.selectedType = {};
        this.selectedCurriculum = {};
        this.selectedNode = {};

        var that = this;

        this.updateCurriculums = function () {
            APIService.getCurriculumsByType(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;
            });

            this.selectedNode = '';
        };

        this.updateNodes = function () {
            APIService.getNodesByNumber(this.selectedCurriculum.Curriculum.CURRICULUM_NR).success(function (data) {
                that.nodes = data.nodes;
            });
        };

        this.updateNodesPieChart = function () {
            NodesPieChartService.broadcast(this.selectedNode);

        };


    }])

    .controller('ModuleGraphCtrl', ['APIService', 'NodesPieChartService', '$scope', function (APIService, NodesPieChartService, $scope) {

        this.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function (d) {
                    return d.key;
                },
                y: function (d) {
                    return d.y;
                },
                donut: true,
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        this.data = [];



        NodesPieChartService.listen(function (event, args) {
            APIService.getNodesPieChartById(args.selectedNode.Node.NODE_ID).success(function (data) {
                $scope.api.updateWithData($scope.data);
                console.log(data)
            });
        });

    }]);
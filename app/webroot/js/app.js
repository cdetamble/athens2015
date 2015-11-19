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

        this.getSimilarNodesById = function (id) {

            return $http.get(Constants.BASE_URL + '/nodes/similarNodes/' + id + '.json');

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
        this.moduleList = false;

        this.setLevel = function (lvl) {
            this.currentLevel = lvl;
        };

        this.collapse = function (lvl) {
            if (this.currentLevel > lvl) {
                return 'collapsed';
            }
            else return '';
        };

        this.resetUI = function() {
            this.setLevel(0);
            this.currentUser="";
            this.currentGraph = '';
            this.moduleList = false;
        };

        this.setUser = function (user) {
            this.currentUser = user;
            if (this.currentLevel > 0) {
                this.resetUI();
            }
            else this.setLevel(1);
        };

        this.setGraph = function (graph) {
            this.currentGraph = graph;
            this.setLevel(2);
        };

        this.setModuleList = function () {
            this.moduleList = true;
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

    .controller('ModuleGradesCtrl', ['APIService', 'NodesPieChartService', '$scope', function (APIService, NodesPieChartService, $scope) {
        this.curriculumTypes = [{name: 'Bachelor of Science', value: 'bachelor'}, {
            name: 'Master of Science',
            value: 'master'
        }];
        this.curriculums = [];
        this.nodes = [];
        this.similarNodes = [];

        this.selectedType = {};
        this.selectedCurriculum = {};
        this.selectedNode = {};
        this.similarNode = {};

        var that = this;

        this.updateCurriculums = function () {
            APIService.getCurriculumsByType(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;

            });

        };

        this.updateNodes = function () {
            APIService.getNodesByNumber(this.selectedCurriculum.Curriculum.CURRICULUM_NR).success(function (data) {
                that.nodes = data.nodes;
            });
        };

        this.updateSimilar = function () {
            APIService.getSimilarNodesById(this.selectedNode.Node.NODE_ID).success(function (data) {
                that.similarNodes = data.similarNodes;
            });
        };

        this.updateNodesPieChart = function () {
            NodesPieChartService.broadcast(this.selectedNode);
        };

        this.updateSimilarNodesPieChart = function () {
            this.selectedNode = this.similarNode;
            this.similarNode = {};
            this.updateSimilar();
            this.updateNodesPieChart();
        };

    }])

    .controller('ModuleGraphCtrl', ['APIService', 'NodesPieChartService', '$scope', function (APIService, NodesPieChartService, $scope) {
        this.explanation = [];
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
        that = this;
        NodesPieChartService.listen(function (event, args) {
            APIService.getNodesPieChartById(args.selectedNode.Node.NODE_ID).success(function (response) {

                var recommendedSemester = response.semester.Grade.SEMESTER_TYPE_ID;
                var sumStudents = 0;
                var s = "";
                for (var i = 0; i < response.data.length; i++) {
                    var item = response.data[i];
                    sumStudents += item['y'];
                    if (item['key'] == 0) {
                        item['key'] = "on time (" + recommendedSemester + ". semester)";
                    } else if (item['key'] < 0) {
                        item['key'] = (-1 * item['key']) + " semester" + (-1 * item['key'] > 1 ? "s" : "") + " before";
                    } else if (item['key'] > 0) {
                        item['key'] = item['key'] + " semester" + (item['key'] > 1 ? "s" : "") + " late";
                    }
                    s += item['y'] + " did it " + item['key'] + "<br>";
                }

                that.explanation[0] = sumStudents;
                that.explanation[1] = args.selectedNode.Node.NODE_TITLE;
                that.explanation[2] = recommendedSemester;
                document.getElementById('summary').innerHTML = s;

                $scope.api.updateWithData(response.data);
            });
        });

    }])

    .controller('ModuleListCtrl', ['APIService', function (APIService) {
        this.curriculumTypes = [{name: 'Bachelor of Science', value: 'bachelor'}, {
            name: 'Master of Science',
            value: 'master'
        }];
        this.curriculums = [];
        this.nodes = [];
        this.selectedType = {};
        this.selectedCurriculum = {};
        var that = this;

        this.updateCurriculums = function () {
            APIService.getCurriculumsByType(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;

            });

        };

        this.updateNodes = function () {
            APIService.getNodesByNumber(this.selectedCurriculum.Curriculum.CURRICULUM_NR).success(function (data) {
                that.nodes = data.nodes;
            });


        };


    }]);
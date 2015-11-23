/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', ['nvd3'])


    .service('APIService', ['$http', function ($http) {


        this.getCurriculumsByType = function (type) {
            return $http.get(Constants.BASE_URL + '/curriculums/.json?type=' + type);
        };

        this.getCurriculumById = function (id) {

            return $http.get(Constants.BASE_URL + '/curriculums/curriculumById/' + id + '.json');

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

        this.getSimilarNodesByList = function (list) {
            var str = "";
            for (i in list) {
                if (str == "") {
                    str = i + '=' + list[i].Node.NODE_ID;
                }
                else {
                    str += '&' + i + '=' + list[i].Node.NODE_ID;
                }

            }


            return $http.get(Constants.BASE_URL + '/nodes/similarNodesByList/.json?' + str);

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

        this.resetUI = function () {
            this.setLevel(0);
            this.currentUser = "";
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

        this.getUserClass = function () {
            if (this.currentUser == 'lecturer') {
                return 'selectable' + ' ' + this.collapse(0);
            } else if (this.currentUser == 'student') {
                return 'selectable' + ' ' + this.collapse(0);
            }
            else return this.collapse(0);
        }

        this.setGraph = function (graph) {
            this.currentGraph = graph;
            this.setLevel(2);
        };

        this.setModuleList = function () {
            this.moduleList = true;
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

    .controller('ModuleListCtrl', ['APIService', '$scope', function (APIService, $scope) {

        this.curriculumTypes = [
            {name: 'Bachelor of Science', value: 'bachelor'},
            {name: 'Master of Science', value: 'master'}
        ];

        this.curriculums = [];
        this.nodes = [];
        this.selectedType = {};
        this.selectedCurriculum = {};
        this.addedModules = [];
        this.addedModulesStr = "";
        this.similarNodes = [];
        this.values = [];
        this.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
        };
        this.similarCurriculums = [
            {
                key: "Most Similar Curriculums",
                values: []
                }];
                var that = this;

        this.updateCurriculums = function () {
            APIService.getCurriculumsByType(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;

            });

        };

        this.updateNodes = function () {
            this.sent = false;
            APIService.getNodesByNumber(this.selectedCurriculum.Curriculum.CURRICULUM_NR).success(function (data) {
                that.nodes = data.nodes;
            });


        };

        this.addModule = function (index) {

            var contained = false;
            for (var m in this.addedModules) {
                if (this.addedModules[m] === this.nodes[index]) {
                    contained = true;
                }
            }
            if (!contained) {
                if (this.addedModulesStr == "") {
                    this.addedModulesStr = this.nodes[index].Node.NODE_TITLE;
                }
                else {
                    this.addedModulesStr += ", " + this.nodes[index].Node.NODE_TITLE;
                }

                this.addedModules.push(this.nodes[index]);
            }
        };

        this.resetModules = function () {
            this.addedModulesStr = "";
            this.addedModules = [];
        };

        this.getMostSimilarCurriculums = function () {
            var allSimilar = {};
            for (m in this.similarNodes) {

                if (typeof allSimilar[this.similarNodes[m].Node.CURRICULUM_NR] == 'undefined') {
                    allSimilar[this.similarNodes[m].Node.CURRICULUM_NR] = 1;
                }
                else {
                    allSimilar[this.similarNodes[m].Node.CURRICULUM_NR]++;
                }
            }

            for (c in allSimilar) {

                APIService.getCurriculumById(c).success(function (data) {
                    var curriculumName = data.curriculums[0].Curriculum.CURRICULUM_NAME;

                    if (typeof that.values[curriculumName] == 'undefined') {
                        console.log(allSimilar[c]);
                        that.similarCurriculums[0].values.push({"label": curriculumName,
                                "value": allSimilar[c]
                            });
                    }

                    $scope.api.updateWithData(that.similarCurriculums);
                });
            }
        };

        this.sendModules = function () {
            this.sent = true;
            APIService.getSimilarNodesByList(this.addedModules).success(function (data) {
                that.similarNodes = data.similarNodes;
                that.getMostSimilarCurriculums()
            });
        }




    }]);
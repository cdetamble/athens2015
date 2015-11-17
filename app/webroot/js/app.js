/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', [])


    .service('APIService', ['$http', function ($http) {


        this.getCurriculumsByType = function (type) {
            return $http.get(Constants.BASE_URL + '/curriculums/.json?type=' + type)
        };

        this.getNodesByNumber = function (number) {

            return $http.get(Constants.BASE_URL + 'nodes/.json?curriculum_number=' + number)
        };
    }])

    .controller('AppCtrl', function () {
        this.currentLevel = 0;
        this.currentUser = '';
        this.setLevel = function (lvl) {
            this.currentLevel = lvl;
        }

        this.collapse = function (lvl) {
            if (this.currentLevel > lvl) {
                return 'collapsed';
            }
            else return '';
        }

        this.setUser = function (user) {
            this.currentUser = user;
            this.setLevel(1)
        }
    })

    .controller('ModuleGradesCtrl', ['APIService', function (APIService) {
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

        this.updateCurriculums = function(){
            APIService.getCurriculumsByType(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;
            });
        };

        this.updateNodes = function(){
            APIService.getNodesByNumber(this.selectedCurriculum.Curriculum.CURRICULUM_NR).success(function (data) {
                that.nodes = data.nodes;
            });
        };


    }]);
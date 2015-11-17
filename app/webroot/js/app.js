/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', [])

    .service('APIService', ['$http', function ($http) {


        this.getCurriculumsByType = function (type) {
            return $http.get('curriculums/view/' + type + '.json')
        };

        this.getModulesByNumber = function (number) {

            return $http.get()
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
        this.modules = [];

        this.selectedType = {};
        this.selectedCurriculum = {};
        this.selectedModule = {};

        var that = this;

        this.updateCurriculums = function(){
            APIService.getCurriculumsByType(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;
            });
        };

        this.updateModules = function(){
            APIService.getModulesByNumber(this.selectedType.value).success(function (data) {
                that.curriculums = data.curriculums;
            });
        };


    }]);
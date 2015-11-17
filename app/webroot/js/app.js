/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', [])

    .service('curriculumService', ['$http', function ($http) {

        this.getByType = function (type) {
            return $http.get('curriculums/view/' + type + '.json')
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

    .controller('ModuleGradesCtrl', ['curriculumService', function (curriculumService) {
        this.curriculumTypes = [{name: 'Bachelor of Science', value: 'bachelor'}, {
            name: 'Master of Science',
            value: 'master'
        }];
        this.curriculum_names = [];
        this.selectedType = {};
        this.selectedCurriculum = {};
        var that = this;

        this.updateCurriculums = function(){
            curriculumService.getByType(this.selectedType.value).success(function (data) {
                that.curriculum_names = data.curriculums;
            });
        };


    }]);
/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', [])

    .service('curriculumService', ['$http', function ($http) {

        this.getByType = function(type){
            $http.get('/curriculums/view/' + type + '.json').then(function(response){
                return response;
            });
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

    .controller('ModuleGradesCtrl', ['curriculumService' ,function (curriculumService) {

        this.type = "bachelor";
        this.curriculum_names = curriculumService.getByType('master');

    }]);
/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', [])

    .service('curriculumService', ['$http', function ($http) {
        this.base_url = "localhost:8888/"
        this.getByType = function(type){
<<<<<<< HEAD:app/webroot/client/app.js
            $http.get('index.php/curriculums/view/' + type).success(function(response){
=======
            $http.get('curriculums/view/' + type + '.json').then(function(response){
>>>>>>> c6ca5258f876b7da004639bf58586f726ecca1d8:app/webroot/js/app.js
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
        
        this.curriculum_names = curriculumService.getByType('master');

    }]);
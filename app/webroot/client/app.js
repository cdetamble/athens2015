/**
 * Created by Rodrigo on 16/11/15.
 */

angular.module('Athens', [])

.controller('AppCtrl', function(){
    this.currentLevel = 0;
    this.currentUser = '';
    this.setLevel = function(lvl){
        this.currentLevel = lvl;
    };

    this.collapse = function(lvl){
        if (this.currentLevel > lvl){
            return 'collapsed';
        }
        else return '';
    }

    this.setUser = function(user){
        this.currentUser = user;
        this.setLevel(1)
    }
})

.controller('ModuleGradesCtrl', function(){
    this.curriculum_names = ['one', 'two', 'three'];

});
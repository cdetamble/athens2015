<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Athens 2015</title>

    <!--SOURCES -->
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <?php echo $this->Html->script('app'); ?>
    <?php echo $this->Html->css('theme'); ?>

    <!-- JavaScript Constants -->
    <script>
        var Constants = {
            BASE_URL: "<?php echo "http://" . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] . $_SERVER['REQUEST_URI']; ?>"
        };
    </script>

</head>
<body ng-app="Athens">
<h1 class="text-center">Welcome</h1>

<div class="container" ng-view ng-controller="AppCtrl as app">
    <div class="jumbotron" ng-class="app.collapse(0)">
        <div class="row">
            <div class="col-sm-6 text-center">
                <h2><a href ng-click="app.setUser('lecturer')">Lecturer</a></h2>
            </div>

            <div class="col-sm-6 text-center">
                <h2><a href ng-click="app.setUser('student')">Student</a></h2>
            </div>
        </div>
    </div>


    <div class="jumbotron" ng-class="app.collapse(1)" ng-show="app.currentUser == 'lecturer' ? true : false" ng-controller="ModuleGradesCtrl as grades">
        <div class="row">

            <div class="col-sm-4 text-center">
                <div class="form-group">
                    <label for="type">Type of Curriculum:</label>
                    <select class="form-control" id="type" ng-model="grades.selectedType" ng-options="type.name for type in grades.curriculumTypes" ng-change="grades.updateCurriculums()">
                    </select>
                </div>
            </div>

            <div class="col-sm-4 text-center">
                <div class="form-group">
                    <label for="curriculum">Curriculum:</label>
                    <select class="form-control" id="curriculum" ng-model="grades.selectedCurriculum" ng-options="current.Curriculum.CURRICULUM_NAME for current in grades.curriculums" ng-change="grades.updateNodes()">
                    </select>
                </div>
            </div>

            <div class="col-sm-4 text-center">
                            <div class="form-group">
                                <label for="modules">Modules:</label>
                                <select class="form-control" id="modules" ng-model="grades.selectedNode" ng-options="current.Node.NODE_TITLE for current in grades.nodes">
                                </select>
                            </div>
            </div>
        </div>
    </div>

</div>
</body>

</html>
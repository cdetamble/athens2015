<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Athens 2015</title>

    <!--SOURCES -->
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.9/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.1/nv.d3.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.1/nv.d3.min.css">

    <?php echo $this->Html->script('app'); ?>
    <?php echo $this->Html->script('angular-nvd3.min'); ?>
    <?php echo $this->Html->css('theme'); ?>

    <!-- JavaScript Constants -->
    <script>
        var Constants = {
            BASE_URL: "<?php echo "http://" . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] . $_SERVER['REQUEST_URI']; ?>"
        };
    </script>

</head>
<body ng-app="Athens">
<br>
<br>
<h1 class="text-center">University Analytics</h1>
<br>
<div class="container" ng-view ng-controller="AppCtrl as app">
    <div>
        <div class="row">
            <div class="col-sm-6 text-center">
                <div class="jumbotron custom-button" ng-click="app.setUser('lecturer')" ng-class="app.getUserClass()">
                    <h2>Lecturer</h2>
                </div>
            </div>

            <div class="col-sm-6 text-center">
                <div class="jumbotron custom-button" ng-click="app.setUser('student')" ng-class="app.getUserClass()">
                    <h2>Student</h2>
                </div>
            </div>
        </div>
    </div>

    <!-- LECTURER -->

    <div class="jumbotron" ng-class="app.collapse(1)" ng-show="app.currentUser == 'lecturer' ? true : false" ng-controller="ModuleGradesCtrl as grades">
        <div class="row">

            <div class="col-sm-3 text-center">
                <div class="form-group">
                    <label for="type">Type of Curriculum:</label>
                    <select class="form-control" id="type" ng-model="grades.selectedType" ng-options="type.name for type in grades.curriculumTypes" ng-change="grades.updateCurriculums()">
                    </select>
                </div>
            </div>

            <div class="col-sm-3 text-center">
                <div class="form-group">
                    <label for="curriculum">Curriculum:</label>
                    <select class="form-control" id="curriculum" ng-model="grades.selectedCurriculum" ng-options="current.Curriculum.CURRICULUM_NAME for current in grades.curriculums" ng-change="grades.updateNodes()">
                    </select>
                </div>
            </div>

            <div class="col-sm-3 text-center">
                            <div class="form-group">
                                <label for="modules">Modules:</label>
                                <select class="form-control" id="modules" ng-model="grades.selectedNode" ng-options="current.Node.NODE_TITLE for current in grades.nodes" ng-change="grades.updateSimilar(); app.setGraph('moduleGraph'); grades.updateNodesPieChart();">
                                </select>
                            </div>
            </div>

            <div class="col-sm-3 text-center">
                                        <div class="form-group">
                                            <label for="similar">Similar Modules:</label>
                                            <select class="form-control" id="similar" ng-model="grades.similarNode" ng-options="current.Node.NODE_TITLE for current in grades.similarNodes" ng-change="grades.updateSimilarNodesPieChart()">
                                            </select>
                                        </div>
                        </div>

        </div>
    </div>

    <div class="jumbotron" ng-class="app.collapse(2)" ng-show="app.showGraph() == 'moduleGraph' ? true : false" ng-controller="ModuleGraphCtrl as moduleGraph">
        <div class="row">


            <div class="col-sm-12 text-center">
                <h2>Students' Attendance Distribution</h2><br><br>
                <nvd3 options="moduleGraph.options" data="moduleGraph.data" api="api" config="{refreshDataOnly: true}"></nvd3>

               A total of <b>{{moduleGraph.explanation[0]}}</b> students were supposed to do "<i>{{moduleGraph.explanation[1]}}</i>" in the <b>{{moduleGraph.explanation[2]}}</b> semester.
               <br>
               <br>
               <div id="summary"></div>

            </div>

        </div>

    </div>


    <!-- STUDENT -->
    <div ng-controller="ModuleListCtrl as moduleList">
    <div class="jumbotron" ng-class="app.collapse(1)" ng-show="app.currentUser == 'student' ? true : false">
        <div class="row">

            <div class="col-sm-6 text-center">
                <div class="form-group">
                    <label for="type">Type of Curriculum:</label>
                    <select class="form-control" id="type" ng-model="moduleList.selectedType" ng-options="type.name for type in moduleList.curriculumTypes" ng-change="moduleList.updateCurriculums()">
                    </select>
                </div>
            </div>

            <div class="col-sm-6 text-center">
                <div class="form-group">
                    <label for="curriculum">Curriculum:</label>
                    <select class="form-control" id="curriculum" ng-model="moduleList.selectedCurriculum" ng-options="current.Curriculum.CURRICULUM_NAME for current in moduleList.curriculums" ng-change="app.setModuleList(); moduleList.updateNodes();">
                    </select>
                </div>
            </div>
        </div>
    </div>

   <div class="jumbotron" ng-if="app.moduleList" ng-class="app.collapse(2)">
        <div class="row">
            <div class="col-sm-6 text-center">
                <input type="text" placeholder="Search Modules" ng-model="query">
            </div>

            <div class="col-sm-6">
                <p class="label">Send</p> <button type="button" class="btn" id="btn-sender" ng-click="moduleList.sendModules()"><span class="glyphicon glyphicon-send"></span></button>
                <p class="label">Reset</p> <button type="button" class="btn" id="btn-sender" ng-click="moduleList.resetModules()"><span class="glyphicon glyphicon-remove"></span></button>
                <div id="added-modules"> {{moduleList.addedModulesStr}} </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <br>
                <ul ng-hide="moduleList.sent">
                    <li class="module-row" ng-repeat="node in moduleList.nodes | filter: query" ng-click="moduleList.addModule($index)">{{node.Node.NODE_TITLE}}</li>
                <ul>
                <br>
                <div ng-show="moduleList.sent">
                <nvd3 options="moduleList.options" data="moduleList.similarCurriculums"></nvd3>
                </div>
            </div>
        </div>

   </div>
   </div>

</body>

</html>
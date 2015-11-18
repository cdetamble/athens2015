<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

App::uses('Controller', 'Controller');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class GradesController extends Controller {
    public $components = array('RequestHandler');

    /**
     * GET /curriculums/.json?type=<bachelor|master>
     */
    function index() {
        $nodeId = isset($_GET['node_id']) ? $_GET['node_id'] : "";

        $grades = $this->Grade->find('all', array(
            'conditions' => array('NODE_ID' => $nodeId)
        ));
        $this->set('grades', $grades);
        $this->set('_serialize', array("grades"));
    }

    /**
     * @param $nodeId
     */
    function pie($nodeId) {
        $grades = $this->Grade->find('all', array(
            'conditions' => array('NODE_ID' => $nodeId)
        ));

        $pie = array();
        foreach ($grades as $grade) {
            $deltaSemester = $grade['Grade']['STUDENT_SEMESTER'] - $grade['Grade']['SEMESTER_TYPE_ID'];
            if (!isset($pie[$deltaSemester])) {
                $pie[$deltaSemester] = 1;
            } else {
                $pie[$deltaSemester]++;
            }
        }

        $data = array();
        foreach ($pie as $key => $value) {
            $item['key'] = $key;
            $item['y'] = $value;
            $data[] = $item;
        }

        $this->set('data', $data);
        $this->set('semester', $this->Grade->find('first', array(
            'fields' => array("SEMESTER_TYPE_ID"),
            'conditions' => array('NODE_ID' => $nodeId)
        )));
        $this->set('_serialize', array("data", "semester"));
    }

    /**
     *
     * @param $nodeId
     */
    function bar($nodeId) {
        $grades = $this->Grade->find('all', array(
            'conditions' => array('NODE_ID' => $nodeId)
        ));

        // init with zeros
        for ($i = 0; $i < 5; $i++) {
            $bars['in_time'][$i] = 0;
            $bars['not_in_time'][$i] = 0;
        }

        // count number of classes
        foreach ($grades as $grade) {
            $g = $grade['Grade']['STUDENT_GRADE'];
            $in_time = ($grade['Grade']['SEMESTER_TYPE_ID'] == $grade['Grade']['STUDENT_SEMESTER']) ? "in_time" : "not_in_time";

            if ($g >= 1 && $g < 1.5)
                $bars[$in_time][0]++;

            else if ($g >= 1.5 && $g < 2.5)
                $bars[$in_time][1]++;

            else if ($g >= 2.5 && $g < 3.5)
                $bars[$in_time][2]++;

            else if ($g >= 3.5 && $g < 4.5)
                $bars[$in_time][3]++;

            else if ($g >= 4.5)
                $bars[$in_time][4]++;
        }

        $this->set('bars', $bars);
        $this->set('_serialize', array("bars"));
    }

}


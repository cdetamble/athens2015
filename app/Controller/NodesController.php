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
class NodesController extends Controller {
    public $components = array('RequestHandler');
    public $uses = array('ActiveStudents', 'FormerStudents', 'Node');

    /**
     * GET /nodes/.json?curriculum_number=<number>
     */
    function index() {
        $this->layout = null;
        $conditions = array('NODE_TITLE !=' => "");

        if (isset($_GET['curriculum_number']))
            $conditions['CURRICULUM_NR'] = $_GET['curriculum_number'];

        $nodes = $this->Node->find('all', array(
            'conditions' => $conditions
        ));

        if (empty($nodes))
            $nodes[] = array("Node" => array("NODE_TITLE" => "None"));

        $this->set('nodes', $nodes);
        $this->set('_serialize', array("nodes"));
    }

    /**
     * This function returns nodes that students attend who attended in the given node id.
     * Corresponds to the first task of the assignment.
     * @param $nodeId
     */
    function similarNodes($nodeId) {
        $nodes = array();
        $participantNumbers = array();

        $participants = $this->ActiveStudents->find('list', array(
            'conditions' => array('NODE_ID' => $nodeId)
        ));

        foreach ($participants as $participant) $participantNumbers[] = $participant;

        if (!empty($participantNumbers)) {
            $nodes = $this->ActiveStudents->find('list', array(
                'fields' => array('NODE_ID'),
                'conditions' => array('ST_PERSON_NR' => $participantNumbers)
            ));
        }
        foreach ($nodes as $node) $nodeIds[] = $node;

        if (!empty($nodeIds)) {
            $nodes = $this->Node->find('all', array(
                'conditions' => array('NODE_ID' => $nodeIds)
            ));
        }

        $this->set('similarNodes', $nodes);
        $this->set('_serialize', array("similarNodes"));
    }

    /**
     * GET /nodes/similarNodesByList/.json&1=423&2=232&...
     * Corresponds to the second task of the assignment
     */
    function similarNodesByList() {
        $participants = array();
        if (!empty($_GET)) {
            $activeStudents = $this->ActiveStudents->find('all', array(
                'fields' => "DISTINCT (ST_PERSON_NR)",
                'conditions' => array('NODE_ID' => $_GET)
            ));
            $formerStudents = $this->FormerStudents->find('all', array(
                'fields' => "DISTINCT (ST_PERSON_NR)",
                'conditions' => array('NODE_ID' => $_GET)
            ));
            $participants = array_merge($activeStudents, $formerStudents);
        }

        foreach ($participants as $participant) {
            if (isset($participant['ActiveStudents']))
                $participantNumbers[] = $participant['ActiveStudents']['ST_PERSON_NR'];
            else if (isset($participant['FormerStudents']))
                $participantNumbers[] = $participant['FormerStudents']['ST_PERSON_NR'];
        }

        $nodes = array();
        if (!empty($participantNumbers)) {
            $nodes = $this->ActiveStudents->find('all', array(
                'fields' => array('NODE_ID'),
                'conditions' => array('ST_PERSON_NR' => $participantNumbers)
            ));
            $nodes2 = $this->FormerStudents->find('all', array(
                'fields' => array('NODE_ID'),
                'conditions' => array('ST_PERSON_NR' => $participantNumbers)
            ));
            $nodes = array_merge($nodes, $nodes2);
        }

        foreach ($nodes as $node) {
            if (isset($node['ActiveStudents']))
                $nodeIds[] = $node['ActiveStudents']['NODE_ID'];
            else if (isset($node['FormerStudents']))
                $nodeIds[] = $node['FormerStudents']['NODE_ID'];
        }

        if (!empty($nodeIds)) {
            $nodes = $this->Node->find('all', array(
                'conditions' => array('NODE_ID' => $nodeIds)
            ));
        }

        $this->set('similarNodes', $nodes);
        $this->set('_serialize', array("similarNodes"));
    }

}


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
class CurriculumsController extends Controller {
    public $components = array('RequestHandler');

    /**
     * GET /curriculums/.json?type=<bachelor|master>
     */
    function index() {
        $type = isset($_GET['type']) ? $_GET['type'] : "";

        // must be either "bachelor" or "master"
        if ($type == "bachelor") {
            $type = "Bachelor of Science";
        } else if ($type == "master") {
            $type = "Master of Science";
        }

        $this->layout = null;
        $curriculums = $this->Curriculum->find('all', array(
            'conditions' => array('DEGREE_NAME' => $type),
            'group' => array('CURRICULUM_NAME')
        ));
        $this->set('curriculums', $curriculums);
        $this->set('_serialize', array("curriculums"));
    }

}


import tk = require("taskobject");
import tkTest = require("taskobject/test/index");

import p = require ('./../index');
import typ = require('./../types/index'); // types


// Here a baby tree :
// A -> B.1
let baby_tree = {
	inlets: [
		{uuid: 'A1', tagtask: 'A', slot: '1'},
		{uuid: 'B1', tagtask: 'B', slot: '1'}
	],
	outlets: [
		{uuid: 'A', tagtask: 'A'},
		{uuid: 'B', tagtask: 'B'}
	],
	links: [
		{source: 'A', target: 'B1'}
	]
}

// Here a tree with one root :
// A -> B.1 -> D.1
// A -> C.1 -> D.2
let tree = {
	inlets: [
		{uuid: 'A1', tagtask: 'A', slot: '1'},
		{uuid: 'B1', tagtask: 'B', slot: '1'},
		{uuid: 'C1', tagtask: 'C', slot: '1'},
		{uuid: 'D1', tagtask: 'D', slot: '1'},
		{uuid: 'D2', tagtask: 'D', slot: '2'}
	],
	outlets: [
		{uuid: 'A', tagtask: 'A'},
		{uuid: 'B', tagtask: 'B'},
		{uuid: 'C', tagtask: 'C'},
		{uuid: 'D', tagtask: 'D'}
	],
	links: [
		{source: 'A', target: 'B1'},
		{source: 'A', target: 'C1'},
		{source: 'B', target: 'D1'},
		{source: 'C', target: 'D2'}
	]
}

// Here a tree with two roots : 
// A -> B.1
// C -> B.2
let tree2 = {
	inlets: [
		{uuid: 'A1', tagtask: 'A', slot: '1'},
		{uuid: 'B1', tagtask: 'B', slot: '1'},
		{uuid: 'B2', tagtask: 'B', slot: '2'},
		{uuid: 'C1', tagtask: 'C', slot: '1'}
	],
	outlets: [
		{uuid: 'A', tagtask: 'A'},
		{uuid: 'B', tagtask: 'B'},
		{uuid: 'C', tagtask: 'C'}
	],
	links: [
		{source: 'A', target: 'B1'},
		{source: 'C', target: 'B2'}
	]
}

/* ------ Here a true simple tree -------
* simpletask -> simpletask
*/
let truetree_full: typ.fullTopo = {
	inlets: [
		{uuid: '0.input', outletNum: 0, tagtask: 'simpletask', slot: 'input'}, // free
		{uuid: '1.input', outletNum: 1, tagtask: 'simpletask', slot: 'input'}
	],
	outlets: [
		{uuid: 'abc', index: 0, tagtask: 'simpletask'}, // index = 0
		{uuid: 'def', index: 1, tagtask: 'simpletask'} // index = 1
	],
	links: [
		{source: '0', target: '1.input'}
	]
}

/*
INLETS : 'uuid' est composé de deux parties séparées par un point
la 1ère partie = un nombre (parseInt) compris entre 0 (inclu) et outlets.length (exclu)
la 2ème partie = le nom du slot de la task (outlet) auquel il est associé
-->> On peut ensuite construire le reste du JSON de chaque inlet :
	- 'tagtask' est déductible grâce à la 1ère partie
	- 'slot' est déductible grâce aà la 2ème partie

OUTLETS : 'tagtask' is the unique tag specified at the task creation (must be unique)
-->> 'uuid' is randomly generated, 'index' is assigned in the pipeline constructor

LINKS : 'source' doit être un nombre (parseInt) compris entre 0 (inclu) et outlets.length (exclu)
'target' doit être le uuid d'un inlet
*/

let truetree_light: typ.lightTopo = {
	inlets: [
		{uuid: '0.input'}, // free
		{uuid: '1.input'}
	],
	outlets: [
		{tagtask: 'simpletask'}, // index = 0
		{tagtask: 'simpletask'} // index = 1
	],
	links: [
		{source: '0', target: '1.input'}
	]
}


let myPipeline = new p.Pipeline(truetree_light);

//console.log(myPipeline.isFree('B2'))

myPipeline.build().on('ready', () => {
	console.log(myPipeline.serialize())
})






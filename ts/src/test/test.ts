import events = require('events');

import tk = require("taskobject"); // task
import tkTest = require("taskobject/test/index");

import p = require ('./../index'); // pipeline
import typ = require('./../types/index'); // pipeline types


/*
* To test without any MicroService JobManager.
*/
function test_without_MS (opt?): events.EventEmitter {
	let emitter = new events.EventEmitter();
	tkTest.JMsetup(opt).on('ready', (JMobject) => {
		emitter.emit('ready', JMobject);
	});
	return emitter;
}



// Here a baby tree :
// A -> B.1
let baby_tree: typ.topology = {
	nodes: [
		{tagtask: 'A'}, // index = 0
		{tagtask: 'B'} // index = 1
	],
	links: [
		{source: 0, target: 1, slotName: '1'}
	]
}

// Here a tree with one root :
// A -> B.1 -> D.1
// A -> C.1 -> D.2
let tree: typ.topology = {
	nodes: [
		{tagtask: 'A'}, // index = 0
		{tagtask: 'B'}, // index = 1
		{tagtask: 'C'}, // index = 2
		{tagtask: 'D'} // index = 3
	],
	links: [
		{source: 0, target: 1, slotName: '1'},
		{source: 0, target: 2, slotName: '1'},
		{source: 1, target: 3, slotName: '1'},
		{source: 2, target: 3, slotName: '2'}
	]
}

// Here a tree with two roots : 
// A -> B.1
// C -> B.2
let tree2: typ.topology = {
	nodes: [
		{tagtask: 'A'}, // index = 0
		{tagtask: 'B'}, // index = 1
		{tagtask: 'C'} // index = 2
	],
	links: [
		{source: 0, target: 1, slotName: '1'},
		{source: 2, target: 1, slotName: '2'}
	]
}

/* ------ Here a true simple tree -------
* simpletask -> simpletask
*/

/*
NODES : 'tagtask' is the unique tag specified at the task creation (must be unique)

LINKS : 'source' must be a number (parseInt) between 0 (included) and nodes.length (excluded)
'target' has the same rule than 'source'. Both are an index referencing a node.
'slotName' is the slot name in the task which the 'target' number refer.
*/

let truetree_simple: typ.topology = {
	nodes: [
		{tagtask: 'simpletask'}, // index = 0
		{tagtask: 'simpletask'} // index = 1
	],
	links: [
		{source: 0, target: 1, slotName: 'input'}
	]
}

/* ------ Here a true dual tree -------
* simpletask_A -> dualtask_C
* simpletask_B -> dualtask_C
*/

let truetree_dual: typ.topology = {
	nodes: [
		{tagtask: 'simpletask'}, // index = 0
		{tagtask: 'simpletask'}, // index = 1
		{tagtask: 'dualtask'} // index = 2
	],
	links: [
		{source: 0, target: 2, slotName: 'input1'}, // target is the slot dualtask.input1
		{source: 1, target: 2, slotName: 'input2'} // target is the slot dualtask.input2
	]
}


let opt = {
	bean: {
		engineType: "slurm",
		binaries: {
	        "cancelBin": "/opt/slurm/bin/scancel",
	        "submitBin": "/opt/slurm/bin/sbatch",
	        "queueBin": "/opt/slurm/bin/squeue"
	    }
	}
}
test_without_MS(opt).on('ready', (jobManager) => {
	let myPipeline = new p.Pipeline(jobManager, truetree_dual.nodes);
	
	myPipeline.tasks[0].on('processed', () => {
		console.log('yeah task with index 0 is finished !');
	});
	
	myPipeline.makeLinks(truetree_dual.links);

	myPipeline.push('titi et toto sont sur un bateau', {taskIndex: 0, slotName: 'input'});
	myPipeline.push('toto tombe à l\'eau', {taskIndex: 1, slotName: 'input'});
});





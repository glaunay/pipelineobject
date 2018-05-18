import events = require("events");
import localIP = require('my-local-ip');
import ms_jobManager = require('ms-jobmanager/build/nativeJS/job-manager-client');

import p = require ('./../index'); // pipeline
import typ = require("../types/index"); // pipeline types




/*
NODES : 'tagtask' is the unique tag specified at the task creation (must be unique)

LINKS : 'source' must be a number (parseInt) between 0 (included) and nodes.length (excluded)
'target' has the same rule than 'source'. Both are an index referencing a node.
'slotName' is the slot name in the task which the 'target' number refer.
*/





/*
* Simple test :
* simpletask -> simpletask.input
*/
export function simpleTest (jobManager): typ.pipelineobject {
	let simpleTree: typ.topology = {
		nodes: [
			{tagtask: 'simpletask'}, // index = 0
			{tagtask: 'simpletask'} // index = 1
		],
		links: [
			{source: 0, target: 1, slotName: 'input'}
		]
	}

	let myPipeline = new p.Pipeline(jobManager, simpleTree.nodes, simpleTree.links);
	myPipeline.push('titi', {taskIndex: 0, slotName: 'input'});
	return myPipeline;
}


/* Dual test :
* simpletask_A -> dualtask_C
* simpletask_B -> dualtask_C
*/
export function dualTest (jobManager): typ.pipelineobject {
	let dualTree: typ.topology = {
		nodes: [
			{tagtask: 'simpletask'}, // task A ; index = 0
			{tagtask: 'simpletask'}, // task B ; index = 1
			{tagtask: 'dualtask'} // task C ; index = 2
		],
		links: [
			{source: 0, target: 2, slotName: 'input1'}, // target is the slot : dualtask.input1
			{source: 1, target: 2, slotName: 'input2'} // target is the slot : dualtask.input2
		]
	}

	let myPipeline = new p.Pipeline(jobManager, dualTree.nodes, dualTree.links);
	myPipeline.push('titi', {taskIndex: 0, slotName: 'input'}); // target is the slot : simpletask_A.input
	myPipeline.push('toto', {taskIndex: 1, slotName: 'input'}); // target is the slot : simpletask_B.input
	return myPipeline;
}


/*
* Function to run the jobManager.
*/
export function JMsetup (): events.EventEmitter {
    let emitter = new events.EventEmitter();

    let startData: {} = {
        TCPip : localIP(),
        port : '2326'
    }
    startData['TCPip'] = 'localhost';
    console.log(startData)

    ms_jobManager.start(startData).on('ready', () => {
        emitter.emit('ready', ms_jobManager);
    })
    return emitter;
}

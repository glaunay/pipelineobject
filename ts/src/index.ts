/*
* CLASS PIPELINE



***** TODO *****

- push method
- need to use a childProcess to 'npm install @tagTask' ? in the createTask function
- git
- npm
- doc README.md


****************

*/



import events = require('events');
import jobManager = require('nslurm');
import tkTest = require('taskobject/test/index'); // to access to JMsetup()
import uuid = require('uuid/v4');

import tkTyp = require('taskobject/ts/src/types/index'); // task types
import typ = require('./types/index'); // pipeline types

// all the tasks
import du = require('taskobject/test/dualtask');
import sim = require('taskobject/test/simpletask');


export class Pipeline {
	private readonly inlets: typ.fullInlet[] = []; // list of inlets (ie slots)
	private readonly outlets: typ.fullOutlet[] = []; // list of outlets (ie tasks)
	private readonly links: typ.link[] = []; // list of links (ie pipes)
	private readonly taskRoot: Object = null;

	constructor (topology: typ.lightTopo) {
		if (typeof topology == 'undefined') throw 'ERROR : a topology must be specified !';
		if (! typ.is_lightTopo(topology)) throw 'ERROR : wrong format of the topology !';

		let fullTopo = this.makeFullTopo(topology);

		this.inlets = fullTopo.inlets;
		this.outlets = fullTopo.outlets;
		this.links = fullTopo.links;
	}

	/*
	* From a light @topology (see the types script), make a full topology,
	* by checking the consitence of the light topology values :
	* (see ./ts/src/types/index.ts for more details)
	* - INLETS : the 'uuid' is composed of 2 parts splited with a "." :
	* 		1st part = a number between 0 (included) and outlets.length (excluded).
	* 		It is the outlet index which it (the slot) belongs.
	* 		2nd part = the name of the slot in the outlet (task).
	* 		-->> from the 'uuid', we find :
	* 			- 'outletNum' and 'tagtask' thanks to the 1st part
	* 			- 'slot' thanks to the 2nd part
	* - OULETS : 'tagtask' is the unique tag specified at the task creation (unique)
	* 		-->> in each outlet JSON we add :
	* 			- 'index' : the number of the outlet (used in the inlets with 'outletNum')
	* 			- 'uuid' : a random uuid (is it useful ?)
	* - LINKS : 'source' must be the index of an outlet and 'target' must be the uuid of
	* 		an inlet -> checkLinks method.
	*/
	makeFullTopo (topology: typ.lightTopo): typ.fullTopo {
		if (! typ.is_lightTopo(topology)) return null;
		let re_uuid_inlet = /([0-9]+)\.([a-z]+)/i;
		let fullTopo: typ.fullTopo = {
			'inlets': [],
			'outlets': [],
			'links': []
		};
		fullTopo.inlets = topology.inlets.map((i) => { // INLETS
			let re_res = re_uuid_inlet.exec(i.uuid);
			if (re_res == null) throw 'ERROR in a inlet uuid : ' + i.uuid;

			let outletNum = parseInt(re_res[1], 10);
			if (isNaN(outletNum)) throw 'ERROR : first part of an inlet uuid must be a number : ' + i.uuid;
			if (outletNum >= topology.outlets.length) throw 'ERROR : no outlet with the number ' +outletNum+ ' -> check inlet uuid : ' + i.uuid;
			
			let slot = re_res[2];
			let tagtask = topology.outlets[outletNum].tagtask;
			return {
				uuid: i.uuid,
				outletNum,
				slot,
				tagtask
			}
		});
		fullTopo.outlets = topology.outlets.map((elem, i) => { // OULETS
			return {
				tagtask: elem.tagtask,
				index: i,
				uuid: uuid() // is uuid really useful ?
			}
		});
		// LINKS : no modification needed
		if (! this.checkLinks(topology)) throw 'ERROR : topology inconsitency : \'source\' = outlet and \'target\' = inlet';
		fullTopo.links = topology.links;
		return fullTopo;
	}

	/*
	* IS IT USEFUL ?
	* For each literal of the @jsonArray, assign a uuid with the 'uuid' key.
	* If the 'uuid' key already exists, erase it (if @force = T) or not (if @force = F).
	*/
	assign_uuid (jsonArray: {}[], force: boolean): {}[] {
		return jsonArray.map((j) => {
			if (j.hasOwnProperty('uuid')) {
				if (force) j['uuid'] = uuid();
			} else {
				j['uuid'] = uuid();
			}
			return j;
		});
	}

	/*
	* Serialize the pipeline object.
	*/
	serialize (): typ.fullTopo {
		let topo: typ.fullTopo = {
			inlets: this.inlets,
			outlets: this.outlets,
			links: this.links
		};
		return topo;
	}

	/*
	* For each links of @topology, check if the source is an index outlet
	* and if the target is an inlet.
	*/
	checkLinks (topology: typ.lightTopo): boolean {
		if (! typ.is_lightTopo(topology)) return false;
		let inlet_ids: string[] = topology.inlets.map(e => e.uuid);
		for (let l of topology.links) {
			if (! inlet_ids.includes(l.target)) return false;
			if (parseInt(l.source, 10) >= topology.outlets.length) return false;
		}
		return true;
	}

	/*
	* Find the inlets that are not in a link. We call them "free inlets".
	* Goal : to push an input on an inlet (either at the beginning or in the middle of the pipeline),
	* the inlet needs to be free (no pipe on it so not involved in a link).
	*/
	/*
	findFreeInlets (): typ.Inlet[] {
		let targets: string[] = this.links.map(e => e.target);
		return this.inlets.filter((val) => {
			return !targets.includes(val.uuid);
		});
	}
	*/

	/*
	* Search if the @inletId is free (ie not involved in a link).
	*/
	isFree (inletId: string): boolean {
		// check if @inletId exists in the inlets
		let inlet_ids: string[] = this.inlets.map(e => e.uuid);
		if (! inlet_ids.includes(inletId)) throw 'ERROR : the inlet id ' + inletId + ' does not exists !';
		// is it free ?
		let targets: string[] = this.links.map(e => e.target);
		return !targets.includes(inletId); // includes is the contrary to free
	}

	/*
	* To test without any MicroService JobManager.
	*/
	test_without_MS (opt?): events.EventEmitter {
		let emitter = new events.EventEmitter();
		tkTest.JMsetup(opt).on('ready', (JMobject) => {
			emitter.emit('ready', JMobject);
		});
		return emitter;
	}

	/*
	* Create a pipe from @taskA to @taskB and listen to the events (coming from taskB) :
	* taskA.pipe(taskB).on('events', (data) => {});
	*/
	createPipe (taskA: any, taskB: any) {
		taskA.pipe(taskB)
		.on('processed', results => {
	        console.log('**** data');
	    })
	    .on('err', (err, jobID) => {
	        console.log('**** ERROR');
	    })
	    .on('stderrContent', buf => {
	        console.log('**** STDERR');
	    });
	}

	/*
	* TO BE COMPLETED !
	* Create a specific task.
	*/
	createTask (tagTask: string, JMobject: any): tkTyp.taskobject {
		// need to 'npm install @tagTask' ? or at least check the existence of the package ?

		console.log(sim)
		console.log(tagTask)
		console.log(sim[tagTask])

		let management: {} = {'jobManager' : JMobject}
		let syncMode: boolean = true;
		let newTask = new sim[tagTask](management, syncMode);
		return newTask;
	}

	/*
	* TO BE COMPLETED !
	* Construct the pipeline : create the tasks (1) and the pipes (2).
	*/
	// OLD VERSION WITHOUT SLOTS
	// build () {
		// let taskArray: any[] = [];
		// this.test_without_MS().on('ready', (JMobject) => {
		// 	for (let task of this.nodes) { // (1)
		// 		taskArray.push(this.createTask(task.tag, JMobject));
		// 	}
		// 	for (let link of this.links) { // (2)
		// 		this.createPipe(link.source, link.target);
		// 	}
		// });
	// }

	/*
	* TO BE COMPLETED !
	* Construct the pipeline : create the tasks (1) and the pipes (2).
	*/
	build (): events.EventEmitter {
		let self = this;
		let emitter = new events.EventEmitter();
		let taskArray: tkTyp.taskobject[] = [];
		this.test_without_MS().on('ready', (JMobject) => {
			// task instantiations
			self.outlets.map((val) => {
				console.log(val.tagtask)
				let toto = self.createTask(val.tagtask, JMobject);
			});
			emitter.emit('ready')
		});
		return emitter;
	}

	/*
	* TO BE COMPLETED !
	* To start a pipeline with an input.
	*/
	push (inputFile) {
		//tkTest.fileToStream(inputFile).pipe() // prototype
	}

	/*
	* Find the root(s) of the pipeline tree.
	* MAYBE NOT USEFULL NOW IF WE PUSH ONTO A SPECIFIC TASK.
	*/
	// OLD VERSION WITHOUT SLOTS
	// findRoot (): {}[] {
	// 	let sources = this.links.map(element => element.source);
	// 	let targets = this.links.map(element => element.target);
	// 	let treeRoot = this.nodes.filter(val => {
	// 		if (sources.includes(val.id) && !targets.includes(val.id)) return true;
	// 		else return false;
	// 	});
	// 	return treeRoot;
	// }
}
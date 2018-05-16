/*
* CLASS PIPELINE



***** TODO *****

- modify the duplicate imports of the task types by creating a @types/taskobject/ NPM repo
	(see https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
	and https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724)
- need to use a childProcess to 'npm install @tagTask' ? in the createTask function
- git
- npm
- doc README.md


****************

*/



import events = require('events');
import jobManager = require('nslurm');
import stream = require('stream');
import tkTest = require('taskobject/test/index'); // to access to JMsetup()
import util = require('util');
import uuid = require('uuid/v4');

import tkTyp_ts = require('taskobject/ts/src/types/index'); // task types TS file (for )
import tkTyp_js = require('taskobject/types/index'); // task types JS file
import typ = require('./types/index'); // pipeline types

// all the tasks
import du = require('taskobject/test/dualtask');
import sim = require('taskobject/test/simpletask');


/******************************** TO COMPLETE ********************************/
// literal to complete with all the possible task modules

let taskModules = {
	dualtask: require('taskobject/test/dualtask').dualtask,
	simpletask: require('taskobject/test/simpletask').simpletask
}

/*****************************************************************************/


export class Pipeline {
	private readonly jobManager: Object = null; // job manager (engineLayer version)
	private readonly nodes: typ.node[] = []; // list of outlets (ie tasks)
	public readonly tasks: tkTyp_ts.taskobject[] = []; // list of the tasks of the pipeline (corresponding to this.nodes)
	private readonly slots: { [s: string] : tkTyp_ts.slot }[] = []; // list of the slots of the tasks of the pipeline
	private links: typ.link[] = []; // list of links (ie pipes)

	public constructor (jobManager: Object, nodes: typ.node[], links: typ.link[]) {
		if (! jobManager) throw 'ERROR : no jobManager specified !';
		if (typeof nodes == 'undefined') throw 'ERROR : a topology must be specified !';
		if (! Array.isArray(nodes)) throw 'ERROR : nodes must be an array !';
		for (let n of nodes) if (! typ.isNode(n)) throw 'ERROR : @nodes must contain only node types !';

		this.jobManager = jobManager;
		this.nodes = nodes;
		this.tasks = this.createTasks();
		this.slots = this.collectSlots();

		this.makeLinks(links)
	}

	/*
	* Serialize the pipeline object.
	*/
	public serialize (): typ.topology {
		let topo: typ.topology = {
			nodes: this.nodes,
			links: this.links
		};
		return topo;
	}

	/*
	* For each task of the pipeline, collect its slots in an array of JSONs.
	* For example, for the following pipeline :
	* A -> C.a
	* B -> C.b
	* we have the following topology :
	* { nodes: [ {tagtask: A}, {tagtask: B}, {tagtask: C} ]
	*   links: [ {source: 0, target: 2, slotName: a}, {source: 1, target: 2, slotName: b} ] }
	* an we have the following return to this method :
	* 		[ { a: A.a Object }, { a: B.a Object }, { a: C.a Object, b: C.b Object } ]
	*/
	private collectSlots (): { [s:string] : tkTyp_ts.slot }[] {
		return this.tasks.map((t) => {
			let slots: tkTyp_ts.slot[] = t.getSlots(); // returns an array of slots
			let slotsMap: { [s: string]: tkTyp_ts.slot } = {};
			for (let s of slots) {
				slotsMap[s.symbol] = s;
			}
			return slotsMap;
		});
	}

	/*
	* Create a pipe from a readable stream (@rs) to a writable stream (@slot)
	* and listen to the events (coming from the slot and its task) :
	* rs.pipe(slot).on('events', (data) => {});
	*/
	private createPipe (rs: stream.Readable, slot: tkTyp_ts.slot): void {
		if (! tkTyp_js.isSlot(slot)) throw 'ERROR : @slot must be a slot type';
		rs.pipe(slot);
	}

	/*
	* Create the tasks of the pipeline.
	*/
	private createTasks (): tkTyp_ts.taskobject[] {
		let jobProfile = null; // "arwen_express" or "arwen_cpu" for example
		let management: {} = {
			'jobManager' : this.jobManager,
			'jobProfile': jobProfile
		};
		return this.nodes.map((n) => {
			return new taskModules[n.tagtask](management);
		});
	}

	/*
	* Check if the @link is valid by :
	* 	(1) looking if its type is link (type guard)
	* 	(2) checking the existence of the source and target indexes in this.nodes
	* 	(3) checking if the slotName exists in our slot list
	*/
	private linkIsValid (link: typ.link): boolean {
		// (1)
		if (! typ.isLink(link)) return false;
		// (2)
		if (typeof this.nodes[link.source] === 'undefined') return false;
		if (typeof this.nodes[link.target] === 'undefined') return false;
		// (3)
		for (let s in this.slots[link.target]) {
			if (s == link.slotName) return true;
		}
		return false;
	}

	/*
	* For each link in @links :
	* 	(1) check if it is valid
	* 	(2) create the link between the task (index link.source into this.tasks)
	* 							and the slot (index link.target into this.slots and key link.slotName)
	* When all links have been created (and are obviously valids), take the @links in this.links (3)
	*/
	public makeLinks (links: typ.link[]): void { //tkTyp_ts.slot[] {
		for (let l of links) {
			if (! this.linkIsValid(l)) throw 'ERROR : the link ' + util.format(l) + ' is invalid !'; // (1)
			let s = this.slots[l.target];
			this.createPipe(this.tasks[l.source], s[l.slotName]); // (2)
		}
		this.links = links; // (3)
	}

	/*
	* Find the slots that are not in a link. We call them "free slots".
	* Goal : to push an input on a slot (either at the beginning or in the middle of the pipeline),
	* the slot needs to be free (no pipe on it so not involved in a link).
	*/
	/* NOT SURE IT IS USEFUL
	private findFreeSlots (links: typ.link[]): tkTyp_ts.slot[] {
		let freeSlots: tkTyp_ts.slot[] = [];
		for (let [s_i, s_lit] of this.slots.entries()) { // for each literal in the array this.slots (corresponding to a task)
			for (let s_key in s_lit) { // for each slot in the literal
				let slotFound: boolean = false;
				for (let l of links) { // for each link
					if (l.target === s_i && l.slotName === s_key) {
						slotFound = true;
						break;
					}
				}
				if (!slotFound) freeSlots.push(s_lit[s_key]);
			}
		}
		return freeSlots;
	}*/

	/*
	* Check if the @slotRef exists in this.slots.
	*/
	private slotRefExists (slotRef: typ.slotRef): boolean {
		if (! typ.isSlotRef(slotRef)) throw 'ERROR : @slotRef must be a type slotRef !';
		if (typeof this.slots[slotRef.taskIndex] === 'undefined') return false;
		let s_lit: { [s:string]: tkTyp_ts.slot } = this.slots[slotRef.taskIndex];
		if (! s_lit.hasOwnProperty(slotRef.slotName)) return false;
		return true;
	}

	/*
	* Check if a slot is free (no pipe on it = not involved in a link), thanks to the @slotRef.
	*/
	private isFree (slotRef: typ.slotRef): boolean {
		if (! typ.isSlotRef(slotRef)) throw 'ERROR : @slotRef must be a type slotRef !';
		if (! this.slotRefExists(slotRef)) return false;
		for (let l of this.links) {
			if (l.target === slotRef.taskIndex && l.slotName === slotRef.slotName) return false;
		}
		return true;;
	}

	/*
	* From a string (@myString) and a key (@myKey), create a JSON
	* and push it into a readable stream to then return it.
	*/
	private stringToJsonStream (myString: string, myKey: string): stream.Readable {
		if (typeof myString !== 'string') throw 'ERROR : @myString must be a string type !';
		if (typeof myKey !== 'string') throw 'ERROR : @myKey must be a string type !';

        myString = myString.replace(/\n/g, '\\n').replace(/\r/g, '\\r');

        let rs: stream.Readable = new stream.Readable();
        rs.push('{ "' + myKey + '" : "');
        rs.push(myString);
        rs.push('"}');
        rs.push(null);
        return rs;
	}

	/*
	* To push the content of an input on a slot.
	*/
	public push (inputContent: string, slotRef: typ.slotRef): void {
		if (typeof inputContent !== 'string') throw 'ERROR : @inputContent must be a type string !';
		if (! typ.isSlotRef(slotRef)) throw 'ERROR : @slotRef must be a type slotRef !';

		if (this.isFree(slotRef)) {
			let rs: stream.Readable = this.stringToJsonStream(inputContent, slotRef.slotName);
			let mySlot: tkTyp_ts.slot = this.slots[slotRef.taskIndex][slotRef.slotName];
			this.createPipe(rs, mySlot);
		} else {
			console.log('push not possible')
		}
	}
}
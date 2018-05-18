
import p = require('../index');

export interface pipelineobject extends p.Pipeline {}

export interface node {
	tagtask: string
}

export function isNode (arg: any): arg is node {
	if (! arg) return false;
	if (! arg.hasOwnProperty('tagtask')) return false;
	if (typeof arg.tagtask !== 'string') return false;
	return true;
}

export interface link {
	source: number,
	target: number,
	slotName: string
}

export function isLink (arg: any): arg is link {
	if (! arg) return false;
	if (! arg.hasOwnProperty('source')) return false;
	if (typeof arg.source !== 'number') return false;
	if (! arg.hasOwnProperty('target')) return false;
	if (typeof arg.target !== 'number') return false;
	if (! arg.hasOwnProperty('slotName')) return false;
	if (typeof arg.slotName !== 'string') return false;
	return true;
}

export interface topology {
	nodes: node[],
	links: link[]
}

export function isTopology (arg: any): arg is topology {
	if (! arg) return false;
	// nodes
	if (! arg.hasOwnProperty('nodes')) return false;
	if (! Array.isArray(arg.nodes)) return false;
	for (let n of arg.nodes) {
		if (! isNode(n)) return false;
	}
	// links
	if (! arg.hasOwnProperty('links')) return false;
	if (! Array.isArray(arg.links)) return false;
	for (let l of arg.links) {
		if (! isLink(l)) return false;
	}
	return true;
}

export interface slotRef {
	taskIndex: number,
	slotName: string
}

export function isSlotRef (arg: any): arg is slotRef {
	if (! arg) return false;
	if (! arg.hasOwnProperty('taskIndex')) return false;
	if (typeof arg.taskIndex !== 'number') return false;
	if (! arg.hasOwnProperty('slotName')) return false;
	if (typeof arg.slotName !== 'string') return false;
	return true;
}

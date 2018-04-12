

export interface lightInlet {
	uuid: string
}

export function is_lightInlet (arg: any): arg is lightInlet {
	if (! arg) return false;
	if (! arg.hasOwnProperty('uuid')) return false;
	if (typeof arg.uuid !== 'string') return false;
	return true;
}

export interface fullInlet extends lightInlet {
	outletNum: number,
	tagtask: string,
	slot: string
}

export function is_fullInlet (arg: any): arg is fullInlet {
	if (! arg) return false;
	if (! arg.hasOwnProperty('outletNum')) return false;
	if (typeof arg.outletNum !== 'number') return false;
	if (! arg.hasOwnProperty('tagtask')) return false;
	if (typeof arg.tagtask !== 'string') return false;
	if (! arg.hasOwnProperty('slot')) return false;
	if (typeof arg.slot !== 'string') return false;
	if (! is_lightInlet(arg)) return false;
	return true;
}

export interface lightOutlet {
	tagtask: string
}

export function is_lightOutlet (arg: any): arg is lightOutlet {
	if (! arg) return false;
	if (! arg.hasOwnProperty('tagtask')) return false;
	if (typeof arg.tagtask !== 'string') return false;
	return true;
}

export interface fullOutlet extends lightOutlet {
	uuid: string,
	index: number
}

export function is_fullOutlet (arg: any): arg is fullOutlet {
	if (! arg) return false;
	if (! arg.hasOwnProperty('uuid')) return false;
	if (typeof arg.uuid !== 'string') return false;
	if (! arg.hasOwnProperty('index')) return false;
	if (typeof arg.index !== 'number') return false;
	if (! is_lightOutlet(arg)) return false;
	return true;
}

export interface link {
	source: string, // must be the ID of an Outlet
	target: string // must be the ID of an Inlet
}

export function is_link (arg: any): arg is link {
	if (! arg) return false;
	if (! arg.hasOwnProperty('source')) return false;
	if (typeof arg.source !== 'string') return false;
	if (! arg.hasOwnProperty('target')) return false;
	if (typeof arg.target !== 'string') return false;
	return true;
}

export interface lightTopo {
	inlets: lightInlet[],
	outlets: lightOutlet[],
	links: link[]
}

export function is_lightTopo (arg: any): arg is lightTopo {
	if (! arg) return false;
	// Inlets
	if (! arg.hasOwnProperty('inlets')) return false;
	if (! Array.isArray(arg.inlets)) return false;
	for (let n of arg.inlets) {
		if (! is_lightInlet(n)) return false;
	}
	// Outlets
	if (! arg.hasOwnProperty('outlets')) return false;
	if (! Array.isArray(arg.outlets)) return false;
	for (let n of arg.outlets) {
		if (! is_lightOutlet(n)) return false;
	}
	// Links
	if (! arg.hasOwnProperty('links')) return false;
	if (! Array.isArray(arg.links)) return false;
	for (let l of arg.links) {
		if (! is_link(l)) return false;
	}
	return true;
}

export interface fullTopo {
	inlets: fullInlet[],
	outlets: fullOutlet[],
	links: link[]
}

export function is_fullTopo (arg: any): arg is fullTopo {
	if (! arg) return false;
	// Inlets
	if (! arg.hasOwnProperty('inlets')) return false;
	if (! Array.isArray(arg.inlets)) return false;
	for (let n of arg.inlets) {
		if (! is_fullInlet(n)) return false;
	}
	// Outlets
	if (! arg.hasOwnProperty('outlets')) return false;
	if (! Array.isArray(arg.outlets)) return false;
	for (let n of arg.outlets) {
		if (! is_fullOutlet(n)) return false;
	}
	// Links
	if (! arg.hasOwnProperty('links')) return false;
	if (! Array.isArray(arg.links)) return false;
	for (let l of arg.links) {
		if (! is_link(l)) return false;
	}
	return true;
}



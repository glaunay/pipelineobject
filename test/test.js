"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tkTest = require("taskobject/test/index");
const p = require("./../index"); // pipeline
// Here a baby tree :
// A -> B.1
let baby_tree = {
    nodes: [
        { tagtask: 'A' },
        { tagtask: 'B' } // index = 1
    ],
    links: [
        { source: 0, target: 1, slotName: '1' }
    ]
};
// Here a tree with one root :
// A -> B.1 -> D.1
// A -> C.1 -> D.2
let tree = {
    nodes: [
        { tagtask: 'A' },
        { tagtask: 'B' },
        { tagtask: 'C' },
        { tagtask: 'D' } // index = 3
    ],
    links: [
        { source: 0, target: 1, slotName: '1' },
        { source: 0, target: 2, slotName: '1' },
        { source: 1, target: 3, slotName: '1' },
        { source: 2, target: 3, slotName: '2' }
    ]
};
// Here a tree with two roots : 
// A -> B.1
// C -> B.2
let tree2 = {
    nodes: [
        { tagtask: 'A' },
        { tagtask: 'B' },
        { tagtask: 'C' } // index = 2
    ],
    links: [
        { source: 0, target: 1, slotName: '1' },
        { source: 2, target: 1, slotName: '2' }
    ]
};
/* ------ Here a true simple tree -------
* simpletask -> simpletask
*/
/*
NODES : 'tagtask' is the unique tag specified at the task creation (must be unique)

LINKS : 'source' must be a number (parseInt) between 0 (included) and nodes.length (excluded)
'target' has the same rule than 'source'. Both are an index referencing a node.
'slotName' is the slot name in the task which the 'target' number refer.
*/
let truetree_simple = {
    nodes: [
        { tagtask: 'simpletask' },
        { tagtask: 'simpletask' } // index = 1
    ],
    links: [
        { source: 0, target: 1, slotName: 'input' }
    ]
};
/* ------ Here a true dual tree -------
* simpletask_A -> dualtask_C
* simpletask_B -> dualtask_C
*/
let truetree_dual = {
    nodes: [
        { tagtask: 'simpletask' },
        { tagtask: 'simpletask' },
        { tagtask: 'dualtask' } // index = 2
    ],
    links: [
        { source: 0, target: 2, slotName: 'input1' },
        { source: 1, target: 2, slotName: 'input2' } // target is the slot dualtask.input2
    ]
};
tkTest.JMsetup()
    .on('ready', (jobManager) => {
    let myPipeline = new p.Pipeline(jobManager, truetree_dual.nodes, truetree_dual.links);
    myPipeline.tasks[0].on('processed', () => {
        console.log('yeah task with index 0 is finished !');
    });
    myPipeline.push('titi', { taskIndex: 0, slotName: 'input' });
    myPipeline.push('toto', { taskIndex: 1, slotName: 'input' });
});

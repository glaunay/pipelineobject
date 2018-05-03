# Pipelineobject

Class to instantiate pipelines


Pre-requisite to understand and use this library : taskobject ([GitHub repo][3], [NPM package][4]).



## Data structures

This part helps to understand the data you have to give to your pipeline object and the data it creates. All examples are related.

### List of nodes

When you want to instantiate a pipeline, you need to give it a list of nodes (see the [Instantiation](#instantiation) section).  
It's a list of all the tasks composing the pipeline, like for example :

```javascript
myNodes = [
	{ tagtask: "taskA" }, // index = 0
	{ tagtask: "taskB" }, // index = 1
	{ tagtask: "taskC" } // index = 2
];
```

>**Note** : the "tagtask" designs the task module name (like "naccesstask" for example [GitHub repo][1], [NPM package][2]). This task module must be required in the `index.js` script (see the [New task modules](#new-task-modules) section).

### List of tasks

At the instantiation (see the [Instantiation](#instantiation) section), the pipeline class will create a list of task objects, like :

```javascript
this.tasks = [
	[Object object], // taskA object
	[Object object], // taskB object
	[Object object] // taskC object
]
```


### Literal of slots

At the instantiation (see the [Instantiation](#instantiation) section), the pipeline class will create a literal of slots objects, like :

```javascript
this.slots = [
	{ slot1: [Object object] }, // belongs to taskA (index = 0)
	{ slot1: [Object object] }, // belongs to taskB (index = 1)
	{ slot1: [Object object], slot2: [Object object] } // belong to taskC (index = 2)
]
```

>**Note** : each element of this list refers to a task (same index). An element is a literal containing all the slots of the task (the key is the name of the slot).


### List of links

To use pipeline, you need to specify the links between the tasks (see the [Make Links](#make-links) section). A link is described by :
1. the index of the source task,
2. the index of the task to which the target slot belongs,
3. the name of the target slot.  

Thus, the list of links must be like :

```javascript
myLinks = [
	{ source: 0, target: 2, slot: "slot1" },
	{ source: 1, target: 2, slot: "slot2" }
]
```


### Slot reference

When you want to push an input onto a slot (see the [Push Input](#push-input) section), you need to use a reference to this slot. A slot reference is described by :
1. the index of the task to which the slot belongs,
2. the name of the slot.  

For example, the reference to the `slot1` of the `taskA` is :

```javascript
let slot1_taskA_ref = {
	taskIndex: 0,
	slotName: "slot1"
}
```


## Installation

In your project directory :

```sh
npm install pipelineobject
```


## Usage

All examples are related.  

>**Note** : in our team we develop with TypeScript but here the example are in JavaScript.

### Import

```javascript
import p = require("pipelineobject");
```

### Instantiation - TO COMPLETE

To instantiate a pipeline object, you need :
- a Job Manager object (`JMobject`) given by the function ...
- a literal describing the pipeline nodes (see the [List of nodes](#list-of-nodes) section).  

Then you can instantiate your pipeline object :

```javascript
test_without_MS().on('ready', (JMobject) => {
	let myPipeline = new p.Pipeline(JMobject, myNodes);
});
```

### Make links

Before pushing your inputs on the slots, you need to create the links. Use the `makeLinks` method and give it a list of links (see the [List of links](#list-of-links) section) :

```javascript
myPipeline.makeLinks(myLinks);
```


### Push input

You have to give the content of your input and a reference to the slot (see the [Slot reference](#slot-reference) section) :

```javascript
let contentInput = fs.readFileSync(myFile, "utf8");
myPipeline.push(contentInput, { taskIndex: 0, slotName: "slot1" });
```


## New task modules

When you want to use a task newly created in a pipeline (`myNewTask`), you have to add it to the imports in the `./index.js` script :

```javascript
let taskModules = {
	naccesstask: require('naccesstask').naccesstask,
	hextask: require('hextask').hextask,
	myNewTask: require('myNewTask').myNewTask
}
```

>**Note** : your task class need to respect the implementation explained in the taskobject documentation ([GitHub repo][3], [NPM package][4]).


[1]: https://github.com/melaniegarnier/naccesstask
[2]: https://www.npmjs.com/package/naccesstask
[3]: https://github.com/melaniegarnier/taskobject
[4]: https://www.npmjs.com/package/taskobject

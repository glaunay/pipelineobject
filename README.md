# Pipelineobject

Class to instantiate pipelines. All the documentation here is in TypeScript.  


Pre-requisite to understand and use this library : taskobject ([GitHub repo][3], [NPM package][4]).




## Installation

In your project directory :

```sh
npm install pipelineobject
```


## Usage

All examples are related.  


### Import

```typescript
import p = require("pipelineobject");
```

### Instantiation - TO COMPLETE

To instantiate a pipeline object, you need :
- a Job Manager object (`JMobject`) given by the function `JMsetup()` (in the `./node_modules/pipelineobject/ts/src/test/index.js`)
- a list of literals describing the pipeline nodes (see the [List of nodes](#list-of-nodes) section),
- a list of the links (see the [List of links](#list-of-links) section).  

Then you can instantiate your pipeline object :

```typescript
import testFunc = require("./test/index")
testFunc.JMsetup().on('ready', (JMobject) => {
	let myPipeline = new p.Pipeline(JMobject, myNodes, myLinks);
});
```

### Push input

You have to give the content of your input and a reference to the slot (see the [Slot reference](#slot-reference) section) :

```typescript
let contentInput = fs.readFileSync(myFile, "utf8");
myPipeline.push(contentInput, { taskIndex: 0, slotName: "slot1" });
```


## New task modules

When you want to use a task newly created in a pipeline (`myNewTask`), you have to add it to the imports in the `./node_modules/pipelineobject/ts/src/index.ts` script, at its beginning :

```typescript
let taskModules = {
	naccesstask: require('naccesstask').naccesstask,
	hextask: require('hextask').hextask,
	myNewTask: require('myNewTask').myNewTask // added
}
```

Then you have to compile the code : go in the `./node_modules/pipelineobject/` directory and use the command :

```sh
tsc -p ./tsconfig.json
```

>**Warning** : do not forget to install your new task module in `./node_modules` !   

>**Note** : your task class need to respect the implementation explained in the taskobject documentation ([GitHub repo][3], [NPM package][4]).



## Data structures

This part helps to understand the data you have to give to your pipeline object and the data it creates. All examples are related.

### List of nodes

When you want to instantiate a pipeline, you need to give it a list of nodes (see the [Instantiation](#instantiation) section).  
It's a list of all the tasks composing the pipeline, like for example :

```typescript
myNodes = [
	{ tagtask: "taskA" }, // index = 0
	{ tagtask: "taskB" }, // index = 1
	{ tagtask: "taskC" } // index = 2
];
```

>**Note** : the "tagtask" designs the task module name (like "naccesstask" for example [GitHub repo][1], [NPM package][2]). This task module must be required in the `./node_modules/pipelineobject/ts/src/index.ts` script (see the [New task modules](#new-task-modules) section).


### List of links

When you instantiate a pipeline, you have to give it a list of links (see the [Instantiation](#instantiation) section). A link is described by :
1. the index of the source task,
2. the index of the task to which the target slot belongs,
3. the name of the target slot.  

Thus, the list of links must be like :

```typescript
myLinks = [
	{ source: 0, target: 2, slot: "slot1" },
	{ source: 1, target: 2, slot: "slot2" }
]
```


### List of tasks

At the instantiation (see the [Instantiation](#instantiation) section), the pipeline class will create a list of task objects, like :

```typescript
this.tasks = [
	[Object object], // taskA object
	[Object object], // taskB object
	[Object object] // taskC object
]
```


### Literal of slots

At the instantiation (see the [Instantiation](#instantiation) section), the pipeline class will create a literal of slots objects, like :

```typescript
this.slots = [
	{ slot1: [Object object] }, // belongs to taskA (index = 0)
	{ slot1: [Object object] }, // belongs to taskB (index = 1)
	{ slot1: [Object object], slot2: [Object object] } // belong to taskC (index = 2)
]
```

>**Note** : each element of this list refers to a task (same index). An element is a literal containing all the slots of the task (the key is the name of the slot).


### Slot reference

When you want to push an input onto a slot (see the [Push Input](#push-input) section), you need to use a reference to this slot. A slot reference is described by :
1. the index of the task to which the slot belongs,
2. the name of the slot.  

For example, the reference to the `slot1` of the `taskA` is :

```typescript
let slot1_taskA_ref = {
	taskIndex: 0,
	slotName: "slot1"
}
```


[1]: https://github.com/melaniegarnier/naccesstask
[2]: https://www.npmjs.com/package/naccesstask
[3]: https://github.com/melaniegarnier/taskobject
[4]: https://www.npmjs.com/package/taskobject

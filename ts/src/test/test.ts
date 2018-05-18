import commander = require('commander');

import testFunc = require("./index"); // pipeline test functions


let simpleTest: boolean = false,
	dualTest: boolean = false;
let treePath: string = null,
	inputPath: string = null;


//////////////// usage //////////////////
var usage = function (): void {
    let str: string = '\n\n  Examples:\n\n'
    str += '    For a simple test (with a simple tree):\n';
    str += '      node ./test/test.js\n';
    str += '        -s\n\n';
    str += '    For a dual test (with a dual tree):\n';
    str += '      node ./test/test.js\n';
    str += '        -d\n\n';
    str += '	*****   what is a simple tree ?   *****\n';
    str += '	simpletask -> simpletask.input\n\n';
    str += '	*****    what is a dual tree ?    *****\n';
    str += '	simpletask_A -> dualtask_C.input1\n';
    str += '	simpletask_B -> dualtask_C.input2\n\n';
    console.log(str);
}


///////////// arguments /////////////
commander
    .usage('node ./test/test.js [options]        # in the taskobject directory')
    .description('A script for testing a simpletask or a dualtask')
    .on('--help', () => { usage(); })
    .option('-u, --usage', 'display examples of usages',
        () => { usage(); process.exit(); })
    .option('-s, --simple', 'make a simple test (with a simple tree, more info with -h)',
        () => { simpleTest = true; })
    .option('-d, --dual', 'make a dual test (with a dual tree, more info with -h)',
        () => { dualTest = true; })
    .parse(process.argv);

if (! simpleTest && ! dualTest) throw usage();




testFunc.JMsetup()
.on('ready', (jobManager) => {
	let myPipeline;

	if (simpleTest) myPipeline = testFunc.simpleTest(jobManager);
	else if (dualTest) myPipeline = testFunc.dualTest(jobManager);

	myPipeline.tasks[0].on('processed', (results) => {
		console.log('yeah task with index 0 is finished !');
		console.log('results are :');
		console.dir(results);
	});
});








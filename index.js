const shell = require('shelljs');
const { argv } = require('yargs');
const http = require('http');


const PORT = argv.port || 5567;
const PATH = argv.path ;

if(PATH === '') {
	shell.echo('Please enter path');
	shell.exit(1);
}

const services = http.createServer((request, response) => {
	if (request.url.search(/deploy\/?$/i) > 0) {
		shell.echo('deploying...');
		shell.cd(PATH);
		shell.exec('git pull origin master',(code, stdout, stderr) => {
			console.log(code);
			console.log(stdout);
			console.log(stderr);

			if (code != 0 ) {
				response.writeHead(500);
				response.write(stderr);
				response.end();
			} else {
				response.writeHead(200);
				response.end('Deploy Done.');
			}

		});
	}
});

services.listen(PORT);


services.on('listening', ()=>{
	console.log(`Services start on ${PORT}`);
});

'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');


// a. the action name from the tell_number Dialogflow intent
const NAME_ACTION = 'tell_number';
// b. the parameters that are parsed from the tell_number intent
const NAME_ARGUMENT = 'Name';
//const NUMBER_ARGUMENT = 'number';

function convertLetterToNumber(str) {
  var out = 0, len = str.length;
  for (var pos = 0; pos < len; pos++) {
    out += (str.charCodeAt(pos) - 64);
  }
  return out;
}


exports.luckynumberfinder = functions.https.onRequest((request, response) => {
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
	const app = new App({request, response});
  

// c. The function that generates the silly name
  function makeName (app) {
    let inputName = app.getArgument(NAME_ARGUMENT);
	let number = Math.floor((Math.random() * 10) + 1);
    if(!!inputName) {
		number = convertLetterToNumber(inputName);
	}
	app.tell('Alright, your lucky number is ' + number +
      '! I hope you like it. See you next time.');
  }
  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set(NAME_ACTION, makeName);


app.handleRequest(actionMap);
});


exports.privacypolicy = functions.https.onRequest((request, response) => {
	response.status(200).send(`<!doctype html>
    <head>
      <title>Privacy Policy</title>
    </head>
    <body>
      <h1>
		Privacy Policy
	  </h1>
	  <ul>
		<li>
			<h4>What information do you collect?</h4>
			<div>This app is created for just fun purpose only. We are only collecting your name to calculate your lucky number. That's it!</div>
		</li>
		<li>
			<h4>How do you use the information?</h4>
			<div>We are not stroing any single information collected from you (which is just your name). So no need to worry.</div>
		</li>
		<li>
			<h4>What information do you share?</h4>
			<div>The answer is very simple. <b>Nothing.</b></div>
		</li>
	  </ul>
    </body>
  </html>`);
});
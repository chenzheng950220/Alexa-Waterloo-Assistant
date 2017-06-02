# Alexa-Waterloo-Assistant
[Alexa](https://www.amazon.com/Amazon-Echo-And-Alexa-Devices/b?ie=UTF8&node=9818047011) is the personal intelligent assistant developed by Amazon. Alexa-Waterloo-Assistant is an [Alexa Skill](https://developer.amazon.com/alexa-skills-kit) that gives you personal assistant on all aspects of living at the University of Waterloo.

## What has been done?
* Parking Information
	* You can ask for meter, permit, visitor, short term, accessible, and motorcycle parking information. WatPark will provide you with a list of lot names and lot descriptions.
	* You can ask for current student parking condition. The parking condition is updated real-time, and WatPark will give you suggestions on where to park based on current parking conditions.
* Weather Information
	* You can ask for current weather condition on campus, which is measured from the University of Waterloo [Weather Station](http://weather.uwaterloo.ca).

## What will be done?
Check out the [issues](https://github.com/chenzheng950220/AlexaWatPark/issues) tab to see what's on the roadmap.

## How to use?
You need to first find a place to [host the server](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service).
* If you are using Lambda function on AWS, create your own function and zip the following files, then upload to your Lambda function
	* index.js (file)
	* alexa-modules (folder)
	* node_modules (folder)
* If you are hosting your own server, clone this folder and run
	```bash
	npm install
	```
	After finished, run
	```bash
	node app.js
	```
	This command executes the server and server is listening on port 8000 in default. If you want to change this, modify the file config.js.

The Alexa skill requires a secure HTTPS connection to your server. If this is not an option on your current server, a proxy re-route might be a good option. There are many tools that can achieve this - [caddy](https://caddyserver.com), [nginx](https://www.nginx.com/resources/wiki/).

Also, if you would like to run app.js at background, even if your current ssh session is terminated, [pm2](https://github.com/Unitech/pm2) might be a good choice.

## Developer
* Zheng Chen (chenzheng950220@gmail.com)

## Resources
* [Alexa Developer Kit](https://developer.amazon.com/alexa-skills-kit)
* [Node.JS](https://nodejs.org/en/)
* [UW Open API](https://uwaterloo.ca/api/)


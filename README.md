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
You need to first find a place to [host the server](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service). I personally chose AWS Lambda since it's easier to hook up with AVS services from Alexa Developer Kit. However, hosting your own server is also an option, which requires a secure https link.

After making the choice, you need to install npm dependencies in a bash shell with command
```bash
npm install
```

## Developer
* Zheng Chen (chenzheng950220@gmail.com)

## Resources
* [Alexa Developer Kit](https://developer.amazon.com/alexa-skills-kit)
* [Node.JS](https://nodejs.org/en/)
* [UW Open API](https://uwaterloo.ca/api/)


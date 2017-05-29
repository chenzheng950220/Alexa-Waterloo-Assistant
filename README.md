# AlexaWatPark
[Alexa](https://www.amazon.com/Amazon-Echo-And-Alexa-Devices/b?ie=UTF8&node=9818047011) is the personal intelligent assistant developed by Amazon. WatPark is an [Alexa Skill](https://developer.amazon.com/alexa-skills-kit) that gives you real-time update on parking status at the University of Waterloo.

## What has been done?
* You can ask for meter, permit, visitor, short term, accessible, and motorcycle parking information. WatPark will provide you with a list of lot names and lot descriptions.
* You can ask for the detailed information on a specific lot, like lot T. WatPark will provide you with detailed information on that specific lot.
* You can ask for current student parking condition. The parking condition is updated real-time, and WatPark will give you suggestions on where to park based on current parking conditions.

## What will be done?
Check out the [issues](https://github.com/chenzheng950220/AlexaWatPark/issues) tab to see what's on the roadmap.

## How to use?
You need to first find a place to [host the server](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service). I personally chose AWS Lambda since it's easier to hook up with AVS services from Alexa Developer Kit. However, hosting your own server is also an option, which requires a secure https link.

After making the choice, you need to install npm dependencies in a bash shell with command
```bash
npm install
```

## Resources
* [Alexa Developer Kit](https://developer.amazon.com/alexa-skills-kit)
* [Node.JS](https://nodejs.org/en/)
* [UW Open API](https://uwaterloo.ca/api/)


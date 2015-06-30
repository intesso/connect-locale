# connect-locale

 - this module provides flexible strategies to detect (get) and store the locale.
 - it is not a full featured localization (i18n) solution that loads ressource files.
 - it only detects and stores the best locale per request/response for the user,
 - and it is good at it :-)


# install
```bash
npm install connect-locale
```
note: if you want to the use `cookie` locale strategy, make sure you have loaded the [cookie-parser](https://github.com/expressjs/cookie-parser) middleware before this middleware.

# use

these are the default options:

```js
// require module
var Locale = require('connect-locale');

// add express/connect middleware with options object
app.use(Locale(options));

// e.g.
app.use(Locale({
    locales: ['de', 'de-ch', 'en', 'en-GB', 'en-us'],
    getLocaleFrom: ['path', 'cookie', 'acceptLanguage'],
    storeLocaleTo: ['cookie']
}));
```

# options

## locales

Array or comma separated String, default: undefined

 - e.g. ['de', 'de-ch', 'en', 'en-GB', 'en-us']
 - This is the definition of the supported locales (optional).
 - If this option is omitted, it accetps the first locale that is detected with the given `getLocaleFrom` Strategy definition.


## getLocaleFrom

Array or comma separated String, default: undefined

 - Available Strategies: ['path', 'subdomain', 'query', 'cookie', 'session', 'acceptLanguage']
 - Mandatory Locale Detection Strategy Array.
 - The provided strategies are processed from left to right until a locale matches
 - if no `locales` definitions are provided, it just returns the first locale it finds


## storeLocaleTo

Array or comma separated String, default: empty Array

 - Available Strategies: ['cookie', 'session', 'request', 'locals']
 - Mandatory Locale Storage Strategy Array.
 - The provided strategies are always processed from left to right
 - if no locale was found, nothing get's stored


## matchSubTags

Boolean, default: true

 - SubTags are detected. 
 - the requested `de-CH` matches the defined `de` Locale, if `de-CH` is not defined.
 - turn this option off (false), if you want to match only the exact locales. e.g. 


## path

Function, default: req.path

 - provide a specific path function if you get the locale with the `path` strategy, but don't want the path to be based on req.path.
  
  ```js
  path : function(req) {
  	  var url = require('url');
  	  return url.parse(req.originalUrl);
  }
  ```

## strategies

Object, default: all strategies from path './lib/stragety'

 - if you want to provide additional stategies, have a look how to implement it in the './lib/stragety' folder.
 - provide an object with the additional strategies in the form: {strategyName: strategy}


## queryLocaleName

String, default: 'lang'

 - url query parameter name. example: `localhost?lang=de`


## cookieLocaleName

String, default: 'lang'

 - cookie name
	 

# request/response properties

`connect-locale` stores the following properties to all the defined `storeLocaleTo` targets:

 * `req.locale`: matched `locale`
 * `req.requestedLocale`: requested locale detected via the given strategies
 * `req.isPreferredLocale`:  `locale` is equal `requestedLocale`
 * `req.isSubLocale`: sub locale was matched e.g. `en` instead of `en-GB`


# test
```bash
npm test
```

# credits
 * the `acceptLanguage` uses the great [negotiator](https://github.com/jshttp/negotiator)/language module.
 * the other `strategies` were copied from [loc](https://github.com/intesso/loc).

# license
MIT

# connect-locale

 - this module provides flexible strategies to detect (get) and store the locale.
 - it is not a full featured localization (i18n) solution that loads ressource files.
 - it only detects the best locale per request/response for the user,
 - and it is good at it :-)


## install
```bash
npm install connect-locale
```
note: if you want to the use `cookie` locale strategy, make sure you have loaded the [cookie-parser](https://github.com/expressjs/cookie-parser) middleware before this middleware.

## use

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

## options

> locales: ['de', 'de-ch', 'en', 'en-GB', 'en-us']

Array or comma separated String, default: undefined

 - This is the definition of the supported locales (optional).
 - If this option is omitted, it accetps the first locale that is detected with the given `getLocaleFrom` Strategy definition.


> getLocaleFrom: ['path', 'subdomain', 'query', 'cookie', 'session', 'acceptLanguage']

Array or comma separated String, default: undefined

 - Mandatory Locale Detection Strategy Array.
 - The provided strategies are processed from left to right until a locale matches
 - if no `locales` definitions are provided, it just returns the first locale it finds


> storeLocaleTo: ['cookie', 'session']

Array or comma separated String, default: undefined

 - Mandatory Locale Storage Strategy Array.
 - The provided strategies are always processed from left to right
 - if no locale was found, nothing get's stored

> getLocaleAlways: false

Boolean, default: false

 - if set to `false`, it just takes the already stored locale if available, and does not try to get the locale again. 
 - if set to `true` always get locale even when stored already e.g. in cookie or session

> matchSubTags: true

Boolean, default: true

 - SubTags are detected. 
 - the requested `de-CH` matches the defined `de` Locale, if `de-CH` is not defined.
 - turn this option off (false), if you want to match only the exact locales. e.g. 

> path

Function, default: req.path

 - provide a specific path function if you get the locale with the `path` strategy, but don't want the path to be based on req.path.
  
  ```js
  path : function(req) {
  	  var url = require('url');
  	  return url.parse(req.originalUrl);
  }
  ```

> strategies

Object, default: all strategies from path './lib/stragety'

 - if you want to provide additional stategies, have a look how to implement it in the './lib/stragety' folder.
 - provide an object with the additional strategies in the form: {strategyName: strategy}
  
> queryLocaleName

String, default: 'lang'

 - url query parameter name. example: `localhost?lang=de`

> cookieLocaleName

String, default: 'lang'

 - cookie name
  
> sessionLocaleName

String, default: 'lang'

 - session nested locale properte name. example: `req.session.lang`
	  

> sessionLocaleName

String, default: 'session'

 - session property name. example: `req.session`
	 


## test
```bash
npm test
```

## credits
 * the `acceptLanguage` uses the great [negotiator](https://github.com/jshttp/negotiator)/language module.
 * the other `strategies` were copied from [loc](https://github.com/intesso/loc).

## license
MIT

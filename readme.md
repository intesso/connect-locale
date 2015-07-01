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
    // provided locales
    locales: ['de', 'de-ch', 'en', 'en-GB', 'en-us'],
    
    // strategies where to look for the locale:
    // in this example, it looks first for the locale in the path, then in the cookie, 
    // and if it still didn't find it, it reads the users language/region preferences sent via the accept-language header.
    getLocaleFrom: ['path', 'cookie', 'acceptLanguage'],
    
    // strategies where to store the locale:
    // in this configuration it stores the locale in a cookie (to persist between requests), 
    // in the request object (helpful in other middlewares), 
    // and in the res.locals object (helpful in templates)
    storeLocaleTo: ['cookie', 'request', 'locals']
}));
```

# `locale` what?
`locale` can be the short form of the language and can contain the region as well.

examples:
 - `en` for english
 - `en-GB` for english used in Great Britain

specifications:
> http://www.ietf.org/rfc/rfc1766.txt

> http://www.rfc-editor.org/rfc/rfc4647.txt

> http://www.rfc-editor.org/rfc/rfc5646.txt

> http://www.rfc-editor.org/rfc/bcp/bcp47.txt


# locale strategies
With locale-connect, you can define several strategies to detect/get the requested locale by the user,

and you can define several targets where the evaluated locale shall be stored.


## get (getLocaleFrom)
the strategies are handled from left to right, until one strategy finds the locale.

available options:
 - `path`: , it reads the locale from the url path: `http://server:port/{locale}/rest/of/the/path`
 - `subdomain`: it reads the locale from the subdomain: `https://{locale}.domain.com/path`, 
 - `query`: it reads the locale from the url query: `www.mywebsite.com/home?{locale}
 - `cookie`: it reads the locale from the cookie. when previously stored.
 - `session`: it reads the locale from the session. when previously stored.
 - `acceptLanguage`: it reads the users language/region preferences sent via the accept-language header.

## store (storeLocaleTo)
the locale (if found) gets stored in the configured targets.

available options:
 - `cookie`: it stores the locale in a cookie to persist for later requests.
 - `session`: it stores the locale in the session on the server side (which also requires a cookie for later requests).
 - `request`: it stores the locale in the request object. This might be helpful for use in following middlewares.
 - `locals`: it stores the locale in the res.locals object. This might be helpful for using the locale in the templates.

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
	 

# stored properties

`connect-locale` stores the following properties to all the defined `storeLocaleTo` targets:

 * `locale`: matched `locale`
 * `requestedLocale`: requested locale detected via the given strategies
 * `isPreferredLocale`:  `locale` is equal `requestedLocale`
 * `isSubLocale`: sub locale was matched e.g. `en` instead of `en-GB`


# test
```bash
npm test
```

# credits
 * the `acceptLanguage` uses the great [negotiator](https://github.com/jshttp/negotiator)/language module.
 * the other `strategies` were copied from [loc](https://github.com/intesso/loc).

# license
MIT

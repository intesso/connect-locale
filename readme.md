# connect-locale


## install
```bash
npm install connect-locale
```
note: if you want to the use `cookie` locale strategy, make sure you have loaded the [cookie-parser](https://github.com/expressjs/cookie-parser) middleware before this middleware.


```js
var locale = require('connect-locale')({
		// it gets the locale from the following strategies in this order.
		// if the locale is not part of the `path`it looks it up in the `query` ect.
	  getLocaleFrom: ['path', 'query', 'subdomain', 'cookie'],

	  // if the locale was found in one of the strategies above, it stores it with this strategy.
	  // in this case in the `cookie`
	  storeLocaleTo: ['cookie'],

	  // the following locales are supported (optional). 
	  // If this option is omitted, it accetps what ever is defined in the definitions.
	  locales: ['de', 'de-ch', 'en', 'en-GB', 'en-us'],
	  
	  cookieLocaleName : 'lang',
	  
	  sessionLocaleName : 'lang',
	 
	  queryLocaleName : 'lang',

	});
```

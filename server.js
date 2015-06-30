var debug = require('debug')('connect-locale');

module.exports = function locale(options) {

  // initialize option parameters, set defaults
  options = options || {};
  var strategies = options.strategies || {};

  if (!options.getLocaleFrom) throw new Error('getLocaleFrom option is missing');
  if (typeof options.getLocaleFrom === 'string') {
    options.getLocaleFrom = options.getLocaleFrom.split(',');
  }
  if (!Array.isArray(options.getLocaleFrom)) throw new Error('getLocaleFrom must be an Array or a comma separated String');

  if (!options.storeLocaleTo) throw new Error('storeLocaleTo option is missing');
  if (typeof options.storeLocaleTo === 'string') {
    options.storeLocaleTo = options.storeLocaleTo.split(',');
  }
  if (!Array.isArray(options.storeLocaleTo)) options.storeLocaleTo = [];

  options.cookieLocaleName = options.cookieLocaleName || 'lang';
  options.queryLocaleName = options.queryLocaleName || 'lang';
  options.sessionName = options.sessionName || 'session';
  options.sessionLocaleName = options.sessionLocaleName || 'lang';
  options.matchSubTags = typeof  options.matchSubTags !== 'undefined' ? options.matchSubTags : true;
  options.reqResProperties = typeof  options.reqResProperties !== 'undefined' ? options.reqResProperties : true;
  options.locals = typeof  options.locals !== 'undefined' ? options.locals : true;

  // create defined locales lookup
  var definedLocales = options.locales;
  var localesLookup = {};
  if (options.locales) {
    if (Array.isArray(options.locales)) {
      definedLocales = options.locales.join(',');
    }
    definedLocales = definedLocales.replace(/_/g, '-').toLowerCase().split(',');
    definedLocales.forEach(function(locale){
      localesLookup[locale] = true;

      if (options.matchSubTags) {
        // according to http://www.rfc-editor.org/rfc/rfc4647.txt page 12
        while (~locale.indexOf('-')) {
          var index = locale.lastIndexOf('-');
          locale = locale.substring(0, index);
          localesLookup[locale] = true;
        }
      }

    });
  }

  // require new strategies
  [options.getLocaleFrom, options.storeLocaleTo].forEach(function(array) {
    array.forEach(function(name) {
      // only require new strategies
      if (strategies[name]) return;
      var strategy = require('./lib/strategy/' + name)(options);
      strategies[name] = strategy;
    })
  });

  // helper function to detect locale or sublocale
  function matchLocale(locale) {
    var found = false;
    if (!locale) return false;
    if (localesLookup[locale]) return locale;
    if (options.matchSubTags) {
      while (~locale.indexOf('-')) {
        var index = locale.lastIndexOf('-');
        locale = locale.substring(0, index);
        if (localesLookup[locale]) {
          found = locale;
          break;
        }
      }
    }
    return found;
  }

  // connect/express middleware
  return function localeMiddleware(req, res, next) {
    // reuse stored locale
    if (!options.getLocaleAlways) {
      if (req[options.sessionName] && req[options.sessionName][options.sessionLocaleName]) return next();
      if (req.cookie && req.cookie[options.cookieLocaleName]) return next();
    }

    // detect locale
    var locale, requestedLocale;
    options.getLocaleFrom.some(function(name) {
      var strategy = strategies[name];
      locale = requestedLocale = strategy.getLocaleFrom(req);
      if (definedLocales) locale = matchLocale(locale);
      return !!locale;
    });

    // no locale detected to store, last try with acceptLanguage
    if (!locale) {
      if (strategies.acceptLanguage) {
        var accepted = strategies.acceptLanguage.getLocalesFrom(req);
        // the first one was already tested with getLocaleFrom
        accepted.shift();
        accepted.some(function(l){
          locale = requestedLocale = l;
          if (definedLocales) locale = matchLocale(l);
          return !!locale;
        });
      }
    }

    // no locale at all
    if (!locale) return next();

    // store locale to req and res.locals
    if (options.reqResProperties) {
      req.locale = locale;
      req.requestedLocale = requestedLocale;
      req.isPreferredLocale = locale === requestedLocale;
      req.isSubLocale = !req.isPreferredLocale && requestedLocale.indexOf(locale) !== -1;
    }

    if (options.reqResProperties && options.locals) {
      ['locale', 'requestedLocale', 'isPreferredLocale', 'isSubLocale'].forEach(function(property){
        res.locals[property] = req.property;
      });
    }

    // ok finally, locale detected -> store locale
    options.storeLocaleTo.forEach(function(name) {
      var strategy = strategies[name];
      strategy.storeLocaleTo(req, res, locale);
      return next();
    });

  }

};

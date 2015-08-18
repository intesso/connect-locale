var debug = require('debug')('connect-locale');
var merge = require('utils-merge');

module.exports = function locale(options) {

  // initialize option parameters, set defaults
  options = options || {};
  var strategies = options.strategies || {};

  options.locales = typeof options.locales !== 'undefined' ? cleanupArray(options, 'locales', true) : undefined;
  options.getLocaleFrom = cleanupArray(options, 'getLocaleFrom');
  options.storeLocaleTo = cleanupArray(options, 'storeLocaleTo');
  options.cookieLocaleName = options.cookieLocaleName || 'lang';
  options.queryLocaleName = options.queryLocaleName || 'lang';
  options.matchSubTags = typeof  options.matchSubTags !== 'undefined' ? options.matchSubTags : true;

  // default locale
  var defaultLocale = (options.locales && options.locales.length > 0) ? options.locales[0] : undefined;

  // create defined locales lookup
  var localesLookup = {};
  if (options.locales) {
    options.locales.forEach(function(locale) {
      localesLookup[locale] = locale;

      if (options.matchSubTags) {
        // according to http://www.rfc-editor.org/rfc/rfc4647.txt page 12
        var subtag = locale;
        while (~subtag.indexOf('-')) {
          var index = subtag.lastIndexOf('-');
          subtag = subtag.substring(0, index);
          if (!localesLookup[subtag] || localesLookup[subtag] !== subtag) localesLookup[subtag] = locale;
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

  // helper function to trim, lowerCase the comma separated string or array
  function cleanupArray(obj, name) {
    var arr = obj[name];
    if (!arr) throw new Error(name + ' option is missing');
    if (Array.isArray(arr)) {
      arr = arr.join(',');
    }
    if (typeof arr !== 'string') throw new Error(name + ' option must be an Array or a comma separated String');
    arr = arr.replace(/_/g, '-').replace(/\s/g, '').toLowerCase().split(',');
    return arr;
  }


  // helper function to detect locale or sublocale
  function matchLocale(locale) {
    var found = false;
    if (!locale) return false;
    locale = locale.replace(/_/g, '-').toLowerCase();
    if (localesLookup[locale]) return localesLookup[locale];
    if (options.matchSubTags) {
      while (~locale.indexOf('-')) {
        var index = locale.lastIndexOf('-');
        locale = locale.substring(0, index);
        if (localesLookup[locale]) {
          found = localesLookup[locale];
          break;
        }
      }
    }
    return found;
  }


  function isAccept(accept, locale) {
    if (!accept || accept.length == 0 || !locale) return false;
    return accept.some(function(l) {
      return l === locale
    });
  }

  function createLocaleObject(locale, accept, requested) {
    var isPreferredLocale = locale && locale === requested;
    var isSubLocale = requested && requested.split('-')[0] === locale.split('-')[0];
    var isAcceptLocale = isAccept(accept, locale);
    var isDefaultLocale = locale && locale === defaultLocale;

    return typeof locale === 'object' ? locale : {
      locale: locale,
      requestedLocale: requested,
      isPreferredLocale: isPreferredLocale,
      isSubLocale: !isPreferredLocale && isSubLocale,
      isAcceptLocale: !isPreferredLocale && isAcceptLocale,
      isDefaultLocale: !isPreferredLocale && isDefaultLocale
    };
  }

  // connect/express middleware
  return function localeMiddleware(req, res, next) {

    // detect locale
    var locale = undefined, requested = undefined, accept = undefined;
    options.getLocaleFrom.some(function(name) {
      if (name === 'default') return false;
      var strategy = strategies[name];
      locale = strategy.getLocaleFrom(req, options.locales);
      if (!requested) {
        requested = (typeof locale === 'object') ? locale.requestedLocale : locale;
      }
      if (typeof locale === 'object') return true;
      if (options.locales) locale = matchLocale(locale);
      return !!locale;
    });

    // no locale detected to store, try with acceptLanguage
    if (!locale) {
      if (strategies.acceptLanguage) {
        accept = strategies.acceptLanguage.getLocalesFrom(req);
        // the first one was already tested with getLocaleFrom
        accept.shift();
        accept.some(function(l) {
          locale = l;
          if (!requested) requested = l;
          if (options.locales) locale = matchLocale(l);
          return !!locale;
        });
      }
    }

    // no locale detected to store, take default locale when added as strategy
    if (!locale) {
      if (strategies.default) {
        locale = strategies.default.getLocaleFrom(req, options.locales);
        requested = null;
      }
    }

    // no locale at all
    if (!locale) return next();

    if (typeof locale === 'string') locale = locale.toLowerCase();
    if (typeof requested === 'string') requested = requested.toLowerCase();

    // store locale
    var localeObject = typeof locale === 'object' ? locale : createLocaleObject(locale, accept, requested);

    // ok finally, locale detected -> store locale
    options.storeLocaleTo.forEach(function(name) {
      var strategy = strategies[name];
      strategy.storeLocaleTo(req, res, localeObject);
    });
    return next();

  }

};

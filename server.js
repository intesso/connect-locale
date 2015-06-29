var debug = require('debug')('connect-locale');

module.export = function locale(options) {

  // initialize option parameters
  options = options || {};
  var strategies = options.strategies || {};

  if (!options.getLocaleFrom) throw new Error('getLocaleFrom option is missing');
  if (!Array.isArray(options.getLocaleFrom)) throw  new Error('getLocaleFrom must be an Array');

  if (!options.storeLocaleTo) throw new Error('storeLocaleTo option is missing');
  if (!Array.isArray(options.storeLocaleTo)) throw  new Error('storeLocaleTo must be an Array');

  options.cookieLocaleName = options.cookieLocaleName || 'lang';
  options.queryLocaleName = options.queryLocaleName || 'lang';
  options.sessionName = options.sessionName || 'session';
  options.sessionLocaleName = options.sessionLocaleName || 'lang';


  // require new strategies
  [options.getLocaleFrom, options.storeLocaleTo].forEach(function(array) {
    array.forEach(function(name) {
      // only require new strategies
      if (strategies[name]) return;
      var strategy = require('./lib/strategy/' + name)(options);
      strategies[name] = strategy;
    })
  });

  // connect/express middleware
  return function localeMiddleware(req, res, next) {
    // reuse stored locale
    if (!options.readAlways) {
      if (req[options.sessionName] && req[options.sessionName][options.sessionLocaleName]) return next();
      if (req.cookie && req.cookie[options.cookieLocaleName]) return next();
    }

    // detect locale
    var locale;
    options.getLocaleFrom.some(function(name) {
      var strategy = strategies[name];
      return !!(locale = strategy.getLocaleFrom(req));
    });

    // no locale to store
    if (!locale) return next();

    // ok finally, locale detected -> store locale
    options.storeLocaleTo.forEach(function(name) {
      var strategy = strategies[name];
      strategy.storeLocaleTo(req, res, locale);
      return next();
    })

  }

};

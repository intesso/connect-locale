/**
 * Stragety =  session
 * gets and stores the locale to the requests session.
 */
module.exports = function(options) {
  options = options || {};
  options.sessionLocaleName = options.sessionLocaleName || 'lang';

  return {
    name: 'session',


    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req    connect / express request object
     * @return {String|false}     Locale if the locale was found with the given strategy, otherwise false.
     */
    getLocaleFrom: function(req) {
      if (!req || !req.session || !req.session[options.sessionLocaleName]) return false;

      var locale = req.session[options.sessionLocaleName];
      console.log('sess get', locale);
      return locale;
    },

    /**
     * Stores the locale to the given strategy.
     * Note: not all strategies have to implement this. Most likely this is suitable for cookie or session strategy.
     *
     * @param {Object} req    connect / express request object
     * @param {Object} res    connect / express response object
     * @param {String} locale the locale like `en` or `de-CH`
     * @return {Boolean}        true if stored sucessfully, otherwise false
     */
    storeLocaleTo: function(req, res, locale) {
      if (!req || !locale) return false;
      if (!req.session) req.session = {};
      req.session[options.sessionLocaleName] = locale;
      console.log('sess store', locale);
      return locale;
    }

  };

};

/**
 * Stragety =  query
 * example: `http://localhost:3000?lang=de-CH` or `http://suuper.com?query=true&lang=en`
 * in this case the locale would be `de-CH` or `en`
 */

module.exports = function(options) {
  options = options || {};
  options.queryLocaleName = options.queryLocaleName || 'lang';

  return {
    name: 'query',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req) {
      if (!req || !req.query || !req.query[options.queryLocaleName]) return false;

      var locale = req.query[options.queryLocaleName];
      return locale;
    },

    /**
     * Stores the locale to the given strategy.
     * Note: not all strategies have to implement this. Most likely this is suitable for cookie or session strategy.
     *
     * @param {Object} req      connect / express request object
     * @param {Object} res      connect / express response object
     * @param {Object} locale   the locale Object with the Keys: ['locale', 'requestedLocale', 'isPreferredLocale', 'isSubLocale']
     * @return {Boolean}        true if stored sucessfully, otherwise false
     */caleTo: function storeLocaleTo(req, res, locale) {
      console.error('i18n query strategy. function storeLocaleTo not implemented');
    }

  };
};



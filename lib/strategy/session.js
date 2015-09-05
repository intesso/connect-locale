var merge = require('utils-merge');

/**
 * Stragety =  session
 * gets and stores the locale to the requests session.
 */
module.exports = function(options) {
  options = options || {};

  return {
    name: 'session',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @param {Array} locales           locale definition Array.
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req, locales) {
      if (!req || !req.session || !req.session.locale) return false;

      var localeObject = {};
      var properties = ['locales', 'locale', 'requestedLocale', 'isPreferredLocale', 'isSubLocale', 'isAcceptLocale', 'isDefaultLocale'];

      properties.forEach(function(property) {

        localeObject[property] = req.session[property]
      });

      return localeObject;
    },

    /**
     * Stores the locale to the given strategy.
     * Note: not all strategies have to implement this. Most likely this is suitable for cookie or session strategy.
     *
     * @param {Object} req      connect / express request object
     * @param {Object} res      connect / express response object
     * @param {Object} locale   the locale Object with the Keys: ['locales', 'locale', 'requestedLocale', 'isPreferredLocale', 'isSubLocale', 'isAcceptLocale', 'isDefaultLocale']
     * @return {Boolean}        true if stored sucessfully, otherwise false
     */
    storeLocaleTo: function storeLocaleTo(req, res, locale) {
      if (!req || !locale) return false;
      if (!req.session) req.session = {};
      merge(req.session, locale);
      return true;
    }

  };

};

var merge = require('utils-merge');

/**
 * Stragety =  request
 * Stores the locale to the request object.
 */
module.exports = function(options) {
  options = options || {};

  return {
    name: 'request',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @param {Array} locales           locale definition Array.
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req, locales) {
      if (!req || !req.session || !req.session[options.sessionLocaleName]) return false;
      console.error('i18n request strategy. function getLocaleFrom not implemented');
      return false;
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
      merge(req, locale);
      return locale;
    }

  };

};

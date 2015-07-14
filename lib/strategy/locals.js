var merge = require('utils-merge');

/**
 * Stragety =  locals
 * Stores the locale to the res.locals object.
 */
module.exports = function(options) {
  options = options || {};

  return {
    name: 'locals',


    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @param {Array} locales           locale definition Array.
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req, locales) {
      if (!req || !req.session || !req.session[options.sessionLocaleName]) return false;
      console.error('i18n locals strategy. function getLocaleFrom not implemented');
      return false;
    },

    /**
     * Stores the locale to the given strategy.
     * Note: not all strategies have to implement this. Most likely this is suitable for cookie or session strategy.
     *
     * @param {Object} req      connect / express request object
     * @param {Object} res      connect / express response object
     * @param {Object} locale   the locale Object with the Keys: ['locale', 'requestedLocale', 'isPreferredLocale', 'isSubLocale']
     * @return {Boolean}        true if stored sucessfully, otherwise false
     */
    storeLocaleTo: function storeLocaleTo(req, res, locale) {
      if (!res || !locale) return false;
      if (!res.locals) res.locals = {};
      merge(res.locals, locale);
      return locale;
    }

  };

};

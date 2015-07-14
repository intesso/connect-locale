/**
 * Strategy = default
 * This strategy is most likely useful as the very last getLocaleFrom Strategy.
 * It simply takes the first locale from the `locales` Array.
 */

module.exports = function(options) {
  options = options || {};

  return {
    name: 'query',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @param {Array} locales           locale definition Array.
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req, locales) {
      if (!locales || !locales.length > 0) return false;
      return locales[0];
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
      console.error('i18n default strategy. function storeLocaleTo not implemented');
    }

  };
};



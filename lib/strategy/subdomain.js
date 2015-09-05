/**
 * Stragety =  subdomain
 * example: `http://de-CH.test.localhost:3000/rest/of/the/path` or `http://en.suuper.com/path-to-the-end`
 * in this case the locale would be `de-CH` or `en`
 */
module.exports = function(options) {
  options = options || {};
  options.pattern = options.pattern || '([a-zA-Z]{1,3}(?:-(?:[a-zA-Z0-9]{2})){0,1})';

  var pattern = new RegExp('^' + options.pattern + '\\.');


  return {
    name: 'subdomain',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @param {Array} locales           locale definition Array.
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req, locales) {
      if (!req || !req.headers || !req.headers.host) return false;

      // match the first subdomain
      if (pattern.test(req.headers.host)) {
        var locale = RegExp.$1;
        return locale;
      }
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
      console.error('i18n subdomain strategy. function storeLocaleTo not implemented');
    }
  };

};

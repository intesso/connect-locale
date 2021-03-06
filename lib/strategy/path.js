/**
 * Stragety =  path
 * example: `http://localhost:3000/de-CH/rest/of/the/path` or `http://suuper.com/en/path-to-the-end`
 * in this case the locale would be `de-CH` or `en`
 */

module.exports = function(options) {
  options = options || {};
  options.pattern = options.pattern || '([a-zA-Z]{1,3}(?:-(?:[a-zA-Z0-9]{2})){0,1})';

  var pattern = new RegExp('^\\/' + options.pattern + '\\/');

  return {
    name: 'path',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @param {Array} locales           locale definition Array.
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req, locales) {
      if (!options.path && (!req || !req.path)) return false;

      // simplified and more general (bigger) pattern than the following spec:
      // http://www.ietf.org/rfc/rfc1766.txt  				(obsolete)
      // http://www.rfc-editor.org/rfc/rfc4647.txt 		(fallback Page 11)
      // http://www.rfc-editor.org/rfc/rfc5646.txt 		(blabla)
      // http://www.rfc-editor.org/rfc/bcp/bcp47.txt 	(case insensitive Page 5; definition: Page 3-5)
      // regex: /^\/([a-zA-Z]{1,3}(?:-(?:[a-zA-Z0-9]{2,8}))*)\//
      var path = typeof options.path === 'function' ? options.path(req) : req.path;
      if (pattern.test(path)) {
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
      console.error('i18n path strategy. function storeLocaleTo not implemented');
    }
  };

};

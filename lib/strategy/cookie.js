/**
 * Stragety =  cookie
 * gets and stores the locale to the response cookies.
 */

module.exports = function(options) {
  options = options || {};
  options.cookieLocaleName = 'lang';

  return {
    name: 'cookie',

    /**
     * gets the locale from the given strategy
     *
     * @param {Object} req              connect / express request object
     * @return {Object|String|false}    Object: if it was previously stored, String: if the locale was found with the given Strategy, Boolean:false otherwise.
     */
    getLocaleFrom: function getLocaleFrom(req) {
      if (!req || !req.cookies || !req.cookies[options.cookieLocaleName]) return false;

      var localeCookie = req.cookies[options.cookieLocaleName];
      var locale = false;
      try {
        locale = JSON.parse(localeCookie);
      } catch (e) {
        console.error('i18n cookie getLocaleFrom Error:' + e);
      }
      return locale;
    },

    /**
     * Stores the locale to the given strategy.
     * Note: not all strategies have to implement this. Most likely this is suitable for cookie or session strategy.
     *
     * @param {Object} req    connect / express request object
     * @param {Object} res    connect / express response object
     * @param {Object} locale the locale object
     * @return {Boolean}      true if stored sucessfully, otherwise false
     */
    storeLocaleTo: function storeLocaleTo(req, res, locale) {
      if (!req || !res || !locale) return false;
      var result = true;
      try {
        res.cookie(options.cookieLocaleName, JSON.stringify(locale));
      } catch(e) {
        console.error('i18n cookie storeLocaleTo Error:' + e);
        result = false;
      }
      return result;
    }
  };

};






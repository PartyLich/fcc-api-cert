/** Timestamp microservice
 * A date string is valid if can be successfully parsed by new Date(date_string)
 *  (JS) .
 * Note that the unix timestamp needs to be an integer (not a string) specifying
 *  milliseconds.
 * In our test we will use date strings compliant with ISO-8601
 * (e.g. "2016-11-20") because this will ensure an UTC timestamp.
 * If the date string is empty it should be equivalent to trigger new Date(),
 *  i.e. the service uses the current timestamp.
 * If the date string is valid the api returns a JSON having the structure
 *  {"unix": <date.getTime()>, "utc" : <date.toUTCString()> }
 *  e.g. {"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}.
 * If the date string is invalid the api returns a JSON having the structure
 *  {"unix": null, "utc" : "Invalid Date" }.
 * It is what you get from the date manipulation functions used above.
 */
const reIso8601 = /^\d{4}-\d{2}-\d{2}$/;
const reDigits = /^\d*$/;
const formatDate = (date) => ({
  unix: date.getTime(),
  utc: date.toUTCString(),
});

/** create Date object from request path parameter
 * set req.date field
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @param  {Function} next the next handler to execute
 * @return {object} created Date object
 */
const parseDate = function parseDate(req, res, next) {
  const timeStr = req.params.date_string;

  const date = (!timeStr)
    ? new Date()
    : (reIso8601.test(timeStr))
      ? new Date(timeStr)
      : reDigits.test(timeStr)
        ? new Date(parseInt(timeStr))
        : new Date('x')
    ;

  req.date = date;
  next();
  return date;
};

/** send json formatted response
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @return {object}
 */
const serveTimestamp = (req, res) => {
  const dateResponse = formatDate(req.date);
  res.json(dateResponse);
  return dateResponse;
};

module.exports = {
  timestamp: [
    parseDate,
    serveTimestamp,
  ],
};

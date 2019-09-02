/**
 * check if {input} is missing (null, undefined, etc)
 * @param  {*} input
 * @return {boolean}
 */
const inputMissing = (input) => !input || input == '';

/**
* check if {input} exists
* @param  {*} input
* @return {boolean}
*/
const inputExists = (input) => input && input != '';


module.exports = {
  inputMissing,
  inputExists,
};

/** Whoami microservice
 * [base url]/api/whoami
 * {"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5",
 * "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}
 */
module.exports = {
  whoami,
}

/**
 */
function whoami(req, res) {
  const whoamiResp = {
    ipaddress: `${req.ip}`,
    language: `${req.get('accept-language')}`,
    software: `${req.get('user-agent')}`,
  };

  res.json(whoamiResp);
}

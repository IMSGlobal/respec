// @ts-check
/*
 * Fetch the online ims-biblio json and append the data to conf.localBiblio.
 * This approach allows us to reuse the W3C biblio logic & implementation untouched.
 * The effect is that we have three levels of sources for biblio entries:
 * - localBiblio
 * - ims-biblio on purl.imsglobal.org
 * - specref.org
 *
 * Note: Run before core/biblio
 */

import { pub } from "../core/pubsubhub.js";

export const name = "ims/biblio";

/**
 * @param {*} conf
 */
export async function run(conf) {
  let imsBiblioURL = "https://purl.imsglobal.org/spec/ims-biblio.json";
  if (conf.overrideIMSbiblioLocation) {
    imsBiblioURL = conf.overrideIMSbiblioLocation;
  }

  if (!conf.disableFetchIMSbiblio) {
    // console.log("fetching ims biblio...");
    fetch(imsBiblioURL, { mode: "cors" })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        // TODO invalid json should be caught here
        // JSON.stringify(conf.localBiblio) --> throws error?
        // TODO we might want to worry about dupes and precedence
        conf.localBiblio = Object.assign(conf.localBiblio, json);
      })
      .catch(error => {
        pub("warn", error.toString());
      });
  }
}

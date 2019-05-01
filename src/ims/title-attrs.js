//@ts-check

import { pub } from "../core/pubsubhub";

export const name =  "ims/title-attrs";

/**
 * Add title attributes to relevant elements. 
 */
export async function run(conf) {
    
  if(conf.noTitleAttrs) {
      return;
      
  } 

  //for now we deal only with a.internalDFN, whose title attr value is 
  //fetched from the destination link 
  
  var anchors = document.body.querySelectorAll("a[href].internalDFN");
  anchors.forEach(function(anchor) {
      var selector = anchor.getAttribute('href');      
      var dfn = document.body.querySelector(selector);
      if(dfn && dfn.tagName === "DFN") {
        var text = "";
        if(hasAncestor(dfn, "dt")) {
          //get the text content of the dd
          var dt = dfn.closest("dt");
          var dd = dt.nextElementSibling;          
          if(dd && dd.tagName === "DD") {            
            text = dd.textContent;
          }
        } else {          
          //get the text content of the neareset dfn block(?) parent
          var blockishParent = dfn.closest("p, td, li, div, aside");
          if(blockishParent) {
            //console.log("found blockish parent " + blockishParent);
            text = blockishParent.textContent;
          } else {
            pub("warn", "Could not find suitable parent container for dfn#" + dfn.id );
          }
        }
        
        if(text.length > 0) {
          //console.log(text);
          text = text.replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
          var ttl = document.createAttribute("title");
          ttl.value = text;
          anchor.setAttributeNode(ttl);
        }
        
      }
  });
}

function hasAncestor(element, ancestorName) {
  var anc = element.closest(ancestorName);
  return anc != null;
}



/*
Virtual css virtualCssSheet
to be used in browser by calling
var css = new virtualCssSheet(document);

you can use it in node,
I guess,
if you have some kind of document object...

*/


var virtualCssSheet = function ( doc=undefined ) {
  //Module ---------------------------------------------

  //_______________________initialize

  this.autoUpload = true;

  if ( doc instanceof HTMLDocument == false )
  {
    console.log("virtualCssSheet >> no document, method upload unavailable")
    this.document = undefined;
    //this.document = document;
  } else {
    this.document = doc;
  }

  this.cssTree = {}

  this.set = function (selector, property, value)
  {
    if ( this.cssTree[selector] ) {
      this.cssTree[selector][property] = value;
    } else {
      this.cssTree[selector]={};
      this.cssTree[selector][property] = value;
    }
    if ( this.autoUpload == true )
    {
      this.upload();
    }
  };


  this.renderSelector = function (selector, cssScript = "")
  {
    var selectorTree = this.cssTree[selector];
    var br = `
`;

    cssScript += br + selector +' {'+br;

    var properties = Object.keys(selectorTree);
    for ( var i=0; i<properties.length; i++ )
    {
      var value = this.cssTree[selector][properties[i]];
      cssScript += '  ' + properties[i] +': '+value+';'+ br;
    }
    cssScript += '}'+br;

    return cssScript;
  };


  this.render = function ()
  {
    var cssScript = "";

    for ( var selector in this.cssTree )
    {
      cssScript += this.renderSelector(selector)
    }

    return cssScript;
  };

  this.upload = function ( doc=undefined ) {

    if ( doc instanceof HTMLDocument == false )
    {
      if ( this.document instanceof HTMLDocument == false )
      {
        throw new Error ("virtualCssSheet >> no valid document, no upload possible");
        return undefined;//I'm not sure throw will stop the code, I beginner
      } else {
        doc = this.document;
      }
    }

    if ( doc.getElementById("ggCss") == null )
    {
      var ggCss= doc.createElement("style");
      ggCss.id = "ggCss"
      doc.head.appendChild(ggCss)
      console.log("..css tag uploaded to document")
    }
    var ggCss = doc.getElementById("ggCss");
    this.removeAllChilds(ggCss);
    ggCss.appendChild( doc.createTextNode( this.render() ) );
  };




  // useful functions ---------------------------------
  this.removeAllChilds = function(element)
  {
    while (element.firstChild)
    {
      element.removeChild(element.firstChild)
    }
  };




  // end of Module-------------------------------------
  return this;
};


// Other exports ---------------------------
var exports;
if (exports) {
  // for node JS ---------------------------
  for (key in virtualCssSheet) {
    exports[key] = virtualCssSheet[key];
  }
}
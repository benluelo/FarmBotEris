module.exports = {
  
  isAlpha: function (str) {
    var code, i, len

    for(i = 0, len = str.length; i < len; i++){
      code = str.charCodeAt(i)
      if(!(code > 64 && code < 91) && /* upper alpha (A-Z) */ !(code > 96 && code < 123)) { /* lower alpha (a-z) */
        return false
      }
    }
    return true
  },

  isNumeric: function (str) {
    var code, i, len

    for(i = 0, len = str.length; i < len; i++){
      code = str.charCodeAt(i)
      if((!code > 47 && code < 58) /* numeric (0-9) */ ){
        return false
      }
    }
    return true
  },

  formatForPlotNumberLETTER: function (str){
    // console.log("LETTER:", str)
    switch(str){
    case("a"): return "0"
    case("b"): return "1"
    case("c"): return "2"
    case("d"): return "3"
    case("e"): return "4"
    }
  },

  formatForPlotNumberNUMBER: function (str){
    // console.log("NUMBER:", str)
    if(parseInt(str) > 0){
      return (parseInt(str)-1).toString()
    }else{
      return "0"
    }
  }
}

// export const isAlpha = isAlpha;
// export const isNumeric = isNumeric;
// export const formatForPlotNumberLETTER = formatForPlotNumberLETTER;
// export const formatForPlotNumberNUMBER = formatForPlotNumberNUMBER;
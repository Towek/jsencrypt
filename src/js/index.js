function inputchange() {
  var x = $('#input').val()

  $('.output').html(encrypt(x, keyEC))
  var enc = encrypt(x, keyEC)
  $('.decoded').html(encrypt(enc, keyEC))
}

function encrypt(text, key){
  var textArr = text.split("")
  var keyArr = key.split("")
  var encrypted = []
  var j = 0
  for(var i = 0; i < textArr.length; i++){
    if(j < keyArr.length){
      var code = (textArr[i].charCodeAt(0) ^ ~keyArr[j].charCodeAt(0) + 32 + j*i)
      //console.log(key.charCodeAt(j))
      j++
    }else{
      j = 0;
      var code = (textArr[i].charCodeAt(0) ^ ~keyArr[j].charCodeAt(0) + 32 + j*i)
      //console.log(key.charCodeAt(j))
    }
    //console.log(code);
    encrypted[i] = String.fromCharCode(code)
  }
  console.log(encrypted)
  var ECstring = ""
  for(var i = 0; i < text.length; i++) {
    ECstring += encrypted[i]
  }
  return ECstring
}
var keyEC
var key = "A4mqLf9gZeeiPgUDqAxQ"
$(window).on("load", function() {
    var mainKey = "silnyKlucz"
    keyEC = encrypt(key, mainKey)
})

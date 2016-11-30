function inputchange() {
  var x = $('#input').val()
  $('.output').html(encrypt(x, "5"))
  var enc = encrypt(x, "5")
  $('.decoded').html(encrypt(enc, "5"))
}

function encrypt(text, key){
  var text_arr = text.split("")
  var encrypted = []
  for(var i = 0; i < text.length; i++){
    var code = (text_arr[i].charCodeAt(0) ^ ~key.charCodeAt(0) + 32)
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

$(window).on("load", function() {

})

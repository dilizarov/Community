Number.prototype.toThousandsString = function() {
  var number = parseInt(this);

  if (number < 10000) {
    return number.toLocaleString()
  } else if (number < 100000){
    // ex: "52913"
    var stringNum = number.toString()

    // If 52013,show 52k instead of 52.0k
    if (stringNum[2] === "0") {
      return stringNum.substring(0, 2) + "k"
    } else {
      return stringNum.substring(0, 2) + "." + stringNum[2] + "k"
    }
  } else {
    var stringNum = number.toString()

    return stringNum.substring(0, stringNum.length - 3) + "k"
  }
}

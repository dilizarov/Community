$(document).ready(function() {

  // This is to mitigate the user for whatever reason changing up the URL after successfully getting there.
  var email = getUrlParameter("email");
  var resetToken = getUrlParameter("reset_token");

  $('.password-input').on('input', function() {
    var passwordVal = $('#password-field').val();
    var confirmVal  = $('#confirm-field').val();

    if (passwordVal !== "" && confirmVal !== "" && passwordVal === confirmVal) {
      $('.change-password').removeClass('disabled');
    } else {
      $('.change-password').addClass('disabled');
    }
  })

  $('.change-password').on('click', function() {
    var passwordVal = $('#password-field').val();
    var confirmVal  = $('#confirm-field').val();

    if ($('.change-password').is('.disabled') || !(passwordVal !== "" && confirmVal !== "" && passwordVal === confirmVal)) {
      return false;
    }

    $.ajax({
      method: "POST",
      url: '/api/v1/users/reset_password.json',
      data: { email: email, reset_token: resetToken, password: passwordVal },
      success: function() {
        console.log("WE SUCCEEDED~!");
      },
      error: function(err) {
        console.log("My dear friends, I am so sorry... but... we have failed you \\(T^T)/");
      }
    })
  })

})

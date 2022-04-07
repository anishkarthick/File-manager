$(document).ready(function () {
  $('#login').on('click', function (event) {
    event.preventDefault();
    let email = $('#email').val();
    let password = $('#password').val();

    $.ajax({
      url: `${window.location.origin}/users/login`,
      method: 'POST',
      data: { email: email, password: password },
      success: function (data) {
        console.log(data);
        alert('login success!');
        window.location.href = '/users';
      },
      error: function (err) {
        alert('Email or password is incorrect. Please try again!');
        // alert(err);
      },
    });
  });
});

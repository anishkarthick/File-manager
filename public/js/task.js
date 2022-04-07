$(document).ready(function () {
  getdata();

  document.getElementById('update').addEventListener('click', (e) => {
    e.preventDefault();

    // let id = $('#id').val();
    let id = document.getElementById('id').value;
    console.log(id, 'iddd');

    let image = $('#updateFileInput')[0].files[0];
    console.log(image, 'update');

    let formdata = new FormData();
    formdata.append('file', image);
    $.ajax({
      url: '/updateFile/' + id,
      data: formdata,
      contentType: false,
      processData: false,
      type: 'patch',
      success: function (response) {
        if (response.msg == 'success') {
          console.log(response, '11');
          alert('File updated');
          $('#id').val('');
          $('#updateFileInput').val('');
          getdata();
        }
      },
      error: function (response) {
        console.log(response, 'ddwddw');
        if (response.status === 404) {
          alert('File is required');
          console.log(response, 'no file');
        }
        if (response.status === 400) {
          alert('File Already exists');
          $('#customFileInput').val('');
          console.log(response, 'duplicate');
        }
        if (response.status === 500) {
          alert('upload server error');
        }
      },
    });
  });

  document.getElementById('upload').addEventListener('click', (e) => {
    e.preventDefault();
    let data = [];
    let image = $('#customFileInput')[0].files;
    // image.map((value) => {
    //   console.log(value);
    // });
    for (let i = 0; i < image.length; i++) {
      // data.push(image[i]);
      // }
      console.log(data, 'data');
      console.log(image, 'iiimmaagggee');
      // let multiple = Object.assign({}, data);
      // console.log(multiple);

      let formdata = new FormData();
      formdata.append('file', image[i]);

      $.ajax({
        url: '/fileUpload',
        data: formdata,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
          if (response.msg == 'success') {
            console.log(response, '11');
            // alert('File uploaded');
            $('#customFileInput').val('');
            getdata();
          }
        },
        error: function (response) {
          console.log(response, 'ddwddw');
          if (response.status === 404) {
            alert('File is required');
            console.log(response, 'no file');
          }
          if (response.status === 400) {
            return alert('File Already exists');
            $('#customFileInput').val('');
            console.log(response, 'duplicate');
          }
          if (response.status === 500) {
            alert('upload server error');
          }
        },
      });
    }
    // window.location.reload();
  });

  ///////////////////////////////////////////////////////////////////////////////////

  $(document).on('click', 'button.update', function () {
    var id = $(this).parent().find('button.update').val();
    console.log(this, 'this');
    document.getElementById('updateModal').classList.remove('hidden');
    document.querySelector('.overlay').classList.remove('hidden');

    document.getElementById('close').addEventListener('click', () => {
      console.log('btn upload');
      $('#id').val('');
      $('#updateFileInput').val('');
      document.getElementById('updateModal').classList.add('hidden');
      document.querySelector('.overlay').classList.add('hidden');
    });

    //close modal with escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape')
        document.querySelector('.overlay').classList.add('hidden');
    });

    $.ajax({
      url: '/getFile/' + id,
      method: 'get',
      dataType: 'json',
      success: function (response) {
        if (response.msg == 'success') {
          $('#id').val(response.data._id);
          // $('#uploadFileInput').val(response.data.name);
          console.log(response.data._id);
          console.log(response.data.name);

          getdata();
        }
      },
      error: function (response) {
        console.log(response);
        alert('update server error');
      },
    });
  });
  /////////////////////////////////////////////////////////////////////////////////
  $(document).on('click', 'button.del', function () {
    let text = 'Do you need to delete this file?';
    if (confirm(text) === true) {
      var id = $(this).parent().find('button.del').val();
      $.ajax({
        url: '/deleteFile/:id', //web
        //  url: '/deleteTask'+id,                 //api
        method: 'delete',
        dataType: 'json',
        data: { id: id },
        success: function (response) {
          if (response.msg == 'success') {
            console.log(response, 'del0');
            alert('File deleted');
            getdata();
          } else {
            alert('File not get deleted');
          }
        },
        error: function (response) {
          alert('delete server error');
          console.log(response, 'del1');
        },
      });
    } else return;
  });

  function getdata() {
    $.ajax({
      url: '/getAllFile',
      method: 'get',
      dataType: 'json',
      success: function (response) {
        console.log(response.data, 'get0');

        if (response.msg == 'success') {
          $('tr.taskrow').remove();
          if (
            response.data == undefined ||
            response.data == null ||
            response.data == ''
          ) {
            console.log(response.data, 'get1');
            $('.tblData').hide();
          } else {
            $('.tblData').show();
            $.each(response.data, function (index, data) {
              var url = url + data._id;
              index += 1;
              $('tbody').append(
                "<tr class='taskrow'><td>" +
                  index +
                  '</td><td>' +
                  data.name +
                  '</td><td>' +
                  `${Math.trunc(data.size / 1000)} kb` +
                  '</td><td>' +
                  "<button style=' border-radius: 8px;border: none;color: white;background-color: #4CAF50;padding: 7px 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;margin: 4px 2px;cursor: pointer;' class='update' value='" +
                  data._id +
                  "'>update</button>" +
                  '</td><td>' +
                  "<button style=' border-radius: 8px;border: none;color: white;background-color: #ee3131;padding: 7px 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;margin: 4px 2px;cursor: pointer;' class='del' value='" +
                  data._id +
                  "'>delete</button>" +
                  '</td></tr>'
              );
            });
          }
        }
      },
      error: function (response) {
        alert('get server error');
      },
    });
  }

  $(function () {
    $('#logout').click(function (event) {
      event.preventDefault();
      let text = 'Do you want to log out now?';
      if (confirm(text) === true) {
        $.ajax({
          type: 'POST',
          url: '/users/logout',
          success: function (response) {
            alert('Logged out successfully!');
            window.location.href = '/users/login';
          },
        });
      } else return;
    });
  });

  $(function () {
    $('#logoutall').click(function (event) {
      event.preventDefault();
      let text = 'Do you want to log out now?';
      if (confirm(text) === true) {
        $.ajax({
          type: 'POST',
          url: '/users/logout',
          success: function (response) {
            alert('Logged out successfully!');
            window.location.href = '/users/login';
          },
        });
      } else return;
    });
  });
});

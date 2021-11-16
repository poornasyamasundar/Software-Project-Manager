document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}
		document.querySelector('.reghere').onclick = () =>
		{
			window.location = '/register';
		}


		const form = document.querySelector("#signup");

		form.querySelector('#save').onclick = (event) =>
		{
			event.preventDefault();

			var email = form.querySelector('#username').value;
			var password = form.querySelector('#password').value;

			$.ajax(
				{
					type: "POST",
					url: "isTrueCredentials",
					data: {
						username: email,
						password: password,
					},
					success: function(data){
						console.log(data);
						if(data != '')
						{
							alert('successfull Sign Ined');
							data = JSON.parse(data);
							console.log(data);
							localStorage.setItem('Username', email);
							localStorage.setItem('gitUserName', data[4]);
							localStorage.setItem('token', data[1]);
							window.location = "http://127.0.0.1:8000/";
						}
						else
						{
							alert("Login Credentials wrong! Please try again");
							window.location = '';
						}
					}
				}
			)

		}
	});

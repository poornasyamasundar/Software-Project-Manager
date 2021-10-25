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
						if(data == 'C'){
							alert('successfull Sign Ined');
							window.history.back();
							localStorage.setItem('Username', email);
						}
						else{
							alert("Login Credentials wrong! Please try again");
							window.location = '';
						}
					}
				}
			)

		}
	});

function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() 
	{
		// goback and help button
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.location = "/";
		}
		document.querySelector('.reghere').onclick = () =>
		{
			window.location = '/register';
		}
		document.querySelector('#helpbutton').onclick = function(){
			window.location = '/Help';
		}

		const form = document.querySelector("#signup");

		// login details validation

		form.querySelector('#save').onclick = (event) =>
		{
			startWait();
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
						// console.log(data);
						if(data != '')
						{
							alert('Sign In Successful');
							data = JSON.parse(data);
							// console.log(data);
							localStorage.setItem('Username', email);
							localStorage.setItem('gitUserName', data[4]);
							localStorage.setItem('token', data[1]);
							stopWait();
							window.location = '/';
						}
						else
						{
							stopWait();
							alert("Login Credentials wrong! Please try again");
							window.location = '';
						}
					}
				}
			)

		}
	});

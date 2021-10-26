document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}

		const form = document.querySelector("#register");

		form.querySelector('#save').onclick = (event) =>
		{
			event.preventDefault();

			var name = form.querySelector('#name').value;
			var email = form.querySelector('#email').value;
			var git = form.querySelector('#github_name').value;
			var password = form.querySelector('#password').value;
			var retypepassword = form.querySelector('#retype-password').value;
			if(password == retypepassword)
			{
				$.ajax(
					{
						type: "POST",
						url: "insertUser",
						data: {
							username: name,
							password: password,
							git: git,
							email: email,
						},
						success: function(data){
							if(data === 'S'){
								alert('Successfully registered');
								window.location = '';
							}
							else{
								alert("Error: couldn't register");
								window.location = '';
							}
						}
					}
				)
			}
			else{
				alert("Password do not match! Please try again");
				window.location = '';
			}

		}
	});

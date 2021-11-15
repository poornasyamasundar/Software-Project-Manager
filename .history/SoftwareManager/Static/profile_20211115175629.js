document.addEventListener('DOMContentLoaded', function() 
	{
		// document.querySelector('#gobackbutton').onclick = () =>
		// {
		// 	window.history.back()
		// }

		const form = document.querySelector("#profile");

		form.querySelector('#update').onclick = (event) =>
		{
			event.preventDefault();

			var name = form.querySelector('#username').value;
			var email = form.querySelector('#email').value;
			var git_id = form.querySelector('#githubid').value;
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
								localStorage.setItem("gitUserName", git);
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

document.addEventListener('DOMContentLoaded', function() 
	{

		const form = document.querySelector("#profile");

		form.querySelector('#update').onclick = (event) =>
		{
			event.preventDefault();

			var name = form.querySelector('#username').value;
			var email = form.querySelector('#email').value;
			var git_id = form.querySelector('#githubid').value;
			var password = form.querySelector('#password').value;
			var retypepassword = form.querySelector('#reTypePassword').value;
			if(password == retypepassword)
			{
				$.ajax(
					{
						type: "POST",
						url: "",
						data: {
							username: name,
							password: password,
							git: git_id,
							email: email,
						},
						success: function(data){
							if(data === 'S'){
								
								window.location = '';
							}
							else{
								
								window.location = '';
							}
						}
					}
				)
			}
			else{
                alert("Unable to update, passwords do not match?")
				window.location = '';
			}

		}
	});
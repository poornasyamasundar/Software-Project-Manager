function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}

//to check if the github username is valid or not 

function verifyGithubUsername( username, callback )
{
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/users/'+username,
			success: function(response)
			{
				console.log(response);
				callback();
			},
			error: function()
			{
				stopWait();
				alert('Incorrect Github Username');
				window.location = '';
			}
		}
	)
}
document.addEventListener('DOMContentLoaded', function() 
	{

		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.location = '/login';
		}
		document.querySelector('#helpbutton').onclick = function(){
			window.location = '/Help';
		}

		const form = document.querySelector("#register"); // collecting data from registration form

		form.querySelector('#save').onclick = (event) =>
		{
			event.preventDefault();

			var name = form.querySelector('#name').value;
			var email = form.querySelector('#email').value;
			var git = form.querySelector('#github_name').value;
			var token = form.querySelector('#github_token').value;
			var password = form.querySelector('#password').value;
			var retypepassword = form.querySelector('#retype-password').value;
			if( name == '' )
			{
				alert("user name is empty");
			}
			else if( email == '' )
			{
				alert("Email is empty");
			}
			else if( git == '' )
			{
				alert("Github username is empty");
			}
			else if( token == '' )
			{
				alert("Github access token is empty");
			}
			else if( password == '' )
			{
				alert("Password is empty");
			}
			else if( password.length < 8 )
			{
				alert("Password should be atleast 8 characters");
			}
			else if( retypepassword == '' )
			{
				alert("Enter the password again");
			}
			else if( password != retypepassword )
			{
				alert("Passwords do not match");
			}
			else
			{
				startWait();
				verifyGithubUsername(git, function()
					{
						if(password == retypepassword)
						{
							$.ajax(
								{
									type: "POST",
									url: "insertUser",
									data: {
										username: name,
										password: password,
										token: token,
										git: git,
										email: email,
									},
									success: function(data){
										if(data === 'S'){
											stopWait();
											alert('Successfully registered');
											window.location = "/";
										}
										else{
											stopWait();
											alert("Error: couldn't register");
											window.location = '';
										}
									}
								}
							)
						}
						else{
							stopWait();
							alert("Password do not match! Please try again");
							window.location = '';
						}
					});
			}
		}
	});


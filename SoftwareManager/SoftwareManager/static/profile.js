function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}
function loadPage()
{
	startWait();
	const form = document.querySelector("#profile");
	var email = form.querySelector('#email');
	var git_id = form.querySelector('#githubid');
	var token = form.querySelector('#token');
	document.querySelector('#username').innerHTML = localStorage.getItem('Username');
	$.ajax(
		{
			type: "POST",
			url: "testPOST",
			data: {
				username: localStorage.getItem('Username'),
				choice: 1,
			},
			success: function(data){
				if(data)
				{
					data = JSON.parse(data);
					email.value = data[5];
					git_id.value = data[4];
					token.value = data[1];
					stopWait();
				}
			}
		}
	)
}

document.addEventListener('DOMContentLoaded', function() 
	{
		loadPage();
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.location = "/";
		}
		document.querySelector('#helpbutton').onclick = function(){
			window.location = '/Help';
		}
		document.querySelector('#changePassword').style.display = 'none';
		document.querySelector('#change').onclick = function(event)
		{
			event.preventDefault();
			if( document.querySelector('#changePassword').style.display == 'block' )
			{
				document.querySelector('#changePassword').style.display = 'none';
			}
			else
			{
				document.querySelector('#changePassword').style.display = 'block';
			}
		}


		const form = document.querySelector("#profile");

		form.querySelector('#update').onclick = (event) =>
		{
			event.preventDefault();
			startWait();

			var email = form.querySelector('#email').value;
			var git_id = form.querySelector('#githubid').value;
			var token = form.querySelector('#token').value;
			$.ajax(
				{
					type: "POST",
					url: "testPOST",
					data: 
					{
						username: localStorage.getItem('Username'),
						gitusername: git_id,
						mail: email,
						token: token,
						choice: 2,
					},
					success: function(data){
						if(data == 'y'){
							localStorage.setItem('gitUserName', git_id);
							localStorage.setItem('token', token);
							stopWait();
							alert("Details updated Successfully");
							window.location = '';
						}
						else
						{
							stopWait();
							alert("Couldn't update details, try again");
						}
					}
				}
			)
		}
		document.querySelector('#updatePassword').onclick = (event)=>
		{
			event.preventDefault();
			var oldPassword = form.querySelector('#oldpassword').value;
			var newPassword = form.querySelector('#newpassword').value;
			var retypePassword = form.querySelector('#reTypePassword').value;
			if( newPassword.length < 8 )
			{
				alert("Password should be atleast 8 characters");
			}
			else if( newPassword != retypePassword )
			{
				alert("New Password do not match");
			}
			else
			{
				startWait();
				$.ajax({
					type: "POST",
					url: "testPOST",
					data: 
					{
						username: localStorage.getItem('Username'),
						oldPassword: oldPassword,
						newPassword: newPassword,
						choice: 3,
					},
					success: function(data)
					{
						if(data == 'y')
						{
							stopWait();
							alert("Old Password is incorrect");
						}
						else if( data == 'z' )
						{
							stopWait();
							alert("Password updated successfully");
							window.location = '';
						}
					}
				}
				)
			}
		}
	});

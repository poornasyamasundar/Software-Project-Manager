document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}

		const form = document.querySelector('#new_project');

		form.querySelector('#save').onclick = (event) =>
		{
			event.preventDefault();

		var name = form.querySelector('#name').value;
		var type = 'agile';
		var repo_link = form.querySelector("#repo").value;
		var description = form.querySelector('#des').value;

		const d = new Date();
		var x = d.getDate()+"-"+ (d.getMonth()+1) +"-"+d.getFullYear();

		$.ajax(
			{
				type: "POST",
				url: "insertProject",
				data: {
					model: type,
					projectName: name,
					table_name: localStorage.getItem('Username')+'projects',
					createdBy:localStorage.getItem('Username'),
					createdOn: x, 
					repolink: repo_link,
					description: description,
				},
				success: function(data){
					if(data == 'y'){
						window.location = '';
						alert("New Project Created");
					}
				}
			}
		)
		}

	});

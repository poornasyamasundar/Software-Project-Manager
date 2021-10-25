document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}
	});

	const form = document.querySelector("#new_project");

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		var name = form.elements['name'];
		var type = form.elements['type'];
		var contributors = form.elements['contributors'];
		var repo_link = form.elements['repo'];

		const d = new Date();
		var x = d.getDate()+"-"+ (d.getMonth()+1) +"-"+d.getFullYear();

		$.ajax(
			{
				type: "POST",
				url: "",
				data: {
					model: type,
					projectName: name,
					table_name:	,
					createdBy:	,
					createdOn: x, 
					description: 
				},
				success: function(data){
					if(data == True){
						window.location = '';
						alert("New Project Created");
					}
				}
			}
		)
		
	});

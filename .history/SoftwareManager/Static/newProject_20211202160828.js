function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}
function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}

// to check whether the repoName exists in the user's github

function getFolderList( repoName, path, callBack )
{
	username = localStorage.getItem('gitUserName');
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path,
			beforeSend: beforeSend,
			success: function(response)
			{
				//console.log(response);
				callBack();
			},
			error: function()
			{
				stopWait();
				alert("Incorrect Repo name");
			}
		}
	)
}

// given a name and the name of the existing repo, it creates a new project under the user with the given name

function createProject( name, callback , repoName)
{
	username = localStorage.getItem('gitUserName');
	console.log("gitUsername = ", username);
	$.ajax(
		{
			type: 'POST',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 
			data:
			JSON.stringify({
				name: name,
			}),
			success: function(response)
			{
				console.log("Created Project = ", name, " Successfully");
				console.log(response);
				obj = { name: response.name, columnsURL: response.columns_url, projectURL: response.url };
				callback(obj);
			},
			error: function()
			{
				stopWait();
				console.log("Couldn't create project");
			}
		})
}

// this takes the url to the project and creates columns withe the given name under this project

function createColumn( projectURL, name, callback )
{
	$.ajax(
		{
			type:'POST',
			url: projectURL+'/columns',
			beforeSend: beforeSend,
			data: JSON.stringify({
				name: name,
			}),
			success: function(response)
			{
				console.log("CreatedColumns = ",name, "  successfully");
				console.log(response);
				obj = { name: response.name, cardsURL: response.cards_url, columnURL: response.url , createdTime: response.created_at }
				callback(obj);
			},
			error: function()
			{
				console.log("Couldn't create column");
			}
		})
}

// creates a new card, given the url to the column and the text that must be added under it

function createCard( columnURL, content, callback )
{
	$.ajax(
		{
			type:'POST',
			url: columnURL + '/cards',
			beforeSend: beforeSend,
			data: JSON.stringify({
				note: content,
			}),
			success: function(response)
			{
				//console.log("Created a card");
				console.log(response)
				obj = {note: response.note, url: response.url, time: response.updated_at, creator: response.creator['login']};
				callback(obj);
			}
		})
}
document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.location = '/';
		}
		document.querySelector('#helpbutton').onclick = function(){
			window.location = '/Help';
		}

		const form = document.querySelector('#new_project');

		// to save the changes
		form.querySelector('#save').onclick = (event) =>
		{
			event.preventDefault();

			var name = form.querySelector('#name').value;
			var type = form.querySelector("select").value;
			var repo_link = form.querySelector("#repo").value;
			var description = form.querySelector('#des').value;
			var list = [localStorage.getItem('Username')];
			var obj = {
				contributors: list,
				des: description,
			};
			description = JSON.stringify(obj);
			if(name == '' )
			{
				alert("Name is empty");
			}
			else if( type == '-Select-' )
			{
				alert("Select a model");
			}
			else if( repo_link == '' )
			{
				alert("Enter the Repo Name");
			}
			else if( description == '' )
			{
				alert("Provide a description for the project");
			}
			else
			{
				getFolderList( repo_link, '', function() {
					startWait();

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
							success: function(data)
							{
								if(data == 'y')
								{		
									createProject( "Notices", function(projectObj) {
										createColumn( projectObj.projectURL, 'Notices', function(tasksObj) {
											localStorage.setItem('NoticeDetails', JSON.stringify(tasksObj));
											if( type != 'Agile Model' )
											{
												createColumn( projectObj.projectURL, 'Meetings', function(tasksobj1) {
													localStorage.setItem('MeetingsDetails', JSON.stringify(tasksobj1));
													stopWait();
													alert("New Project Created");
													window.location = "/";
												});
											}
											else
											{
												createProject('ProductBacklogs', function(projectObj1) {
													localStorage.setItem('ProductBacklogs', JSON.stringify(projectObj1));
													createColumn( projectObj1.projectURL, 'FileInfo', function(columnObj) {
														createColumn( projectObj1.projectURL, 'root', function(rootObj){
															l = [{name: 'root', cardsURL: rootObj.cardsURL, columnURL: rootObj.columnURL, folders: []}];
															createCard( columnObj.columnURL, JSON.stringify(l), function(obj){
																localStorage.setItem('FileInfo', JSON.stringify(obj));
																stopWait();
																alert("New Project Created");
																window.location = "/";
															});
														});
													});
												}, repo_link);
											}
										});
									}, repo_link);
								}
							}
						}
					);
				});
			}

		}

	});

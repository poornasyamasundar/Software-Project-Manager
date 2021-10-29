function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}
function getAllProjects( callback )
{
	username = localStorage.getItem('Username');
	repoName = localStorage.getItem('repoName');
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend,
			data:
				{
					state: 'all',
				},
			success: function(response)
			{
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					list.push({ name: response[i].name, projectURL: response[i].url, columnsURL: response[i].columns_url});
				}
				console.log(response);
				console.log(list);
				callback(list);
			}
		}
	)
}

function getAllColumns( url, callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					list.push({name:response[i].name, columnURL: response[i].url, cardsURL: response[i].cards_url});
				}
				console.log(response);
				console.log(list);
				callback(list);
			}
		}
	)
}

function getAllCards( url , callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				console.log(response);
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					list.push({note: response[i].note, url: response[i].url, time: response[i].updated_at, creator: response[i].creator['login']});
				}
				console.log(list);
				callback(list);
			}
		}
	)
}

function editCard( url , note, callback )
{
	$.ajax(
		{
			type: 'PATCH',
			url: url,
			beforeSend: beforeSend,
			data: JSON.stringify(
			{
				note: note,
			}),
			success: function(response)
			{
				console.log(response);
				callback(response);
			}
		}
		)
}

function deleteCard( url, callback )
{
	$.ajax(
		{
			type:'DELETE',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				console.log(response);
				callback(response);
			}
		})
}

function createProject( name, callback )
{
	username = localStorage.getItem('Username');
	repoName = localStorage.getItem('repoName');
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
				console.log(response);
				obj = { name: response.name, columnsURL: response.columns_url, projectURL: response.url };
				console.log(obj);
				callback(obj);
			}
		})
}

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
				console.log(response);
				obj = { name: response.name, cardsURL: response.cards_url, columnURL: response.url }
				console.log(obj);
				callback(obj);
			}
		})
}

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
				console.log(response)
				obj = {note: response.note, url: response.url, time: response.updated_at, creator: response.creator['login']};
				console.log(obj);
				callback(obj);
			}
		})
}

function createScrum( name )
{
	createProject( name, function(projectObj) {
		createColumn( projectObj.projectURL, 'Tasks', function(tasksObj) {
			createColumn( projectObj.projectURL, 'Meetings', function(MeetsObj) {} );
		});
	});
}

function createSprint( name )
{
	createProject( name, function(projectObj) {
		createColumn( projectObj.projectURL, 'Tasks', function(tasksObj) {});
	});
}

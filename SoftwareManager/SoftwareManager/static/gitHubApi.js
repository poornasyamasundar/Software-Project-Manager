function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}
export function getAllProjects( callback )
{
	var username = localStorage.getItem('Username');
	var repoName = localStorage.getItem('repoName');
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
				var list = [];
				for( let i = 0 ; i < response.length ; i++ )
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

export function getAllColumns( url, callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				var list = [];
				for( let i = 0 ; i < response.length ; i++ )
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

export function getAllCards( url , callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			cache: false,
			beforeSend: beforeSend,
			data:{
				archived_state: 'all',
			},
			success: function(response)
			{
				console.log("Displaying all Cards");
				console.log(response);
				var list = [];
				for( let i = 0 ; i < response.length ; i++ )
				{
					list.push({note: response[i].note, url: response[i].url, time: response[i].updated_at, creator: response[i].creator['login'], archived: response[i].archived});
				}
				callback(list);
			}
		}
	)
}

export function editCard( url , note, archived, callback )
{
	console.log("entered editcard");
	$.ajax(
		{
			type: 'PATCH',
			url: url,
			beforeSend: beforeSend,
			data: JSON.stringify(
			{
				note: note,
				archived: archived,
			}),
			success: function(response)
			{
				console.log("Edited");
				console.log(response);
				callback(response);
			}
		}
		)
}

export function deleteCard( url, callback )
{
	$.ajax(
		{
			type:'DELETE',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				callback(response);
			}
		})
}

export function createProject( name, callback )
{
	var username = localStorage.getItem('gitUserName');
	var repoName = localStorage.getItem('repoName');
	console.log("gitUsername = ", username);
	console.log("repoName = ", repoName);
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
				var obj = { name: response.name, columnsURL: response.columns_url, projectURL: response.url };
				callback(obj);
			}
		})
}

export function createColumn( projectURL, name, callback )
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
				var obj = { name: response.name, cardsURL: response.cards_url, columnURL: response.url , createdTime: response.created_at }
				callback(obj);
			}
		})
}

export function createCard( columnURL, content, callback )
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
				console.log("Created a card");
				console.log(response)
				var obj = {note: response.note, url: response.url, time: response.updated_at, creator: response.creator['login']};
				callback(obj);
			}
		})
}

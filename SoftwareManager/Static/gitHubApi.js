// to get the authentication
function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}

// this gets all hte projects present in the current user's repo

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

// given a url to the project, this gets alll the columns present under it.

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

// given the url to the column, this gets all the cards present in the given column

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

// given the url to a card, this fucntion edits the content of it
// it also archives the card.

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
				//console.log(response);
				callback(response);
			}
		}
		)
}

// deletes a card if it is present in the github projects
// url to that card is passed to it and the callback func that must be invoked after successfully
// deleting a card is also given.

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

// creates a new project in the user's repo

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

// creates columns after creating a new project in the git repo
// the project url is passed to it and the name of the new column is also passsed to the func.

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

// creates a new card given the url to that column and the content that must be written is also
// passed to it.

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

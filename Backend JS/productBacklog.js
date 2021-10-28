function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}

/* path should start with '/' */
export function getFolderList( path, callBack )
{
	username = localStorage.getItem('Username');
	repoName = localStorage.getItem('repoName');
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path,
			beforeSend: beforeSend,
			success: function(response)
			{
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					if( response[i].type == 'dir')
					{
						list.push({'name':response[i].name, 'path':response[i].path});
					}
				}
				console.log(response);
				console.log(list);
			},
		}
	)
}

function getTaskList( path, callback )
{
	username = localStorage.getItem('Username');
	repoName = localStorage.getItem('repoName');
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path+'/data.json',
			beforeSend: beforeSend,
			success: function(response)
			{
				content = atob(response.content);
				list = JSON.parse(content);
				console.log(list);
				console.log(taskListToString([]));
			},
		}
	)
}

function taskListToString( list )
{
	str = '';
	for( i = 0 ; i < list.length ; i++ )
	{
		str += (i+1)+')'+list[i].heading+'\n';
		str += '\t'+list[i].description+'\n';
	}
	return str;
}

function insertFolder( path, callback )
{
	username = localStorage.getItem('Username');
	repoName = localStorage.getItem('repoName');
	$.ajax(
		{
			type: 'PUT',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path+'/data.json',
			beforeSend: beforeSend,
			data: JSON.stringify(
				{
					content: btoa(JSON.stringify([])),
					message: 'created '+path,
				}),
			success: function(response)
			{
				console.log(response);
				$.ajax(
					{
						type: 'PUT',
						url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path+'/tasks.txt',
						beforeSend: beforeSend,
						data: JSON.stringify(
							{
								content: btoa(JSON.stringify([])),
								message: 'created Tasks file in '+path,
							}),
						success: function(response)
						{
							console.log(response);
						},
					}
				)
			},
		}
	)	
}

function insertTasks( content, path, callback )
{
	username = localStorage.getItem('Username');
	repoName = localStorage.getItem('repoName');
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path+'/data.json',
			beforeSend: beforeSend,
			success: function(response)
			{
				console.log(response);
				$.ajax(
					{
						type: 'PUT',
						url: 'https://api.github.com/repos/'+username+'/'+repoName+'/contents'+path+'/data.json',
						beforeSend: beforeSend,
						data: JSON.stringify(
							{
								content: btoa(JSON.stringify(content)),
								message: 'updated tasks',
								sha: response.sha,
							}),
						success: function(response)
						{
							console.log(response);
						},
					}
				)
			}
		}
	)
}

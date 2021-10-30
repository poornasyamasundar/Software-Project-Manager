
function getCommits(path, time)
	{
		username = 'poornasyamasundar';
		repoName = 'git_demo';

		$.ajax(

				{
					type: "GET",
					url: "https://api.github.com/repos/"+username +'/'+ repoName+'/commits',
					beforeSend: beforeSend, 
					data: JSON.stringify(
						{ 
							since: time,
						}),
					success: function(response)
					{
						list = []
						for(i=0 ; i<response.length ; i++)
						{
							obj = {author: response[i].commit.author.name, message: response[i].commit.message, date: response[i].commit.author.date}
							//console.log(response[i].commit)
							//console.log(response[i].commit.author.name)
							//console.log(response[i].commit.message)

							list.push(obj)
						}
						console.log(list)
						return list
					}
				}

			)	
	}
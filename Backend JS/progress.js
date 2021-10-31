function print(tasksDone, typeCount)
{
	console.log(tasksDone, typeCount);
	console.log(tasksDone/typeCount);
	return tasksDone/typeCount;
}

function avgTasksHelper(list, counter, tasksDone)
{
	if(counter == list.length)
	{
		print(tasksDone, list.length)
	}
	else 
	{
	$.ajax(

		{

			type: 'GET',
			url: list[counter],
			beforeSend: beforeSend, 
								
			success: function(response)
			{
									//console.log(response)
				$.ajax(

					{

						type: 'GET',
						url: response[0].cards_url,
						beforeSend: beforeSend, 
						data:
						{
							archived_state: 'archived',
						},
						success: function(response)
						{
							avgTasksHelper(list, counter+1, tasksDone+response.length)
						}
					}

					)
			}
		}

	)
	}
}

function avgTasksCompleted(type)
	{
		username = 'poornasyamasundar';
		repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
				beforeSend: beforeSend, 
				
				success: function(response)
				{
					list = []
					for(i=0 ; i<response.length ; i++)
					{

						model = response[i].name.slice(0, type.length).toLowerCase();
						//console.log(model)
						if(model != type)
							continue;

						list.push(response[i].columns_url); 
						
					}

					avgTasksHelper(list, 0, 0);
				}
			}

			)
	}
	


function productivityHelper2(list, url, counter, tasksDone, meetings)
{
	
				$.ajax(

					{

						type: 'GET',
						url: url,
						beforeSend: beforeSend, 
						
						success: function(response)
						{

							productivityHelper(list, counter+1, tasksDone, meetings+response.length)
						}
					}

					)
		
}

function productivityHelper(list, counter, tasksDone, meetings)
{
	if(counter == list.length)
	{
		print(tasksDone, meetings)
	}
	else 
	{
	$.ajax(

		{

			type: 'GET',
			url: list[counter],
			beforeSend: beforeSend, 
								
			success: function(response)
			{
				//console.log(response)
				$.ajax(

					{

						type: 'GET',
						url: response[0].cards_url,
						beforeSend: beforeSend, 
						data:
						{
							archived_state: 'archived',
						},
						success: function(response_)
						{

							productivityHelper2(list, response[1].cards_url, counter, tasksDone+response_.length, meetings)
						}
					}

					)
			}
		}

	)
	}
}

function productivity()
	{
		username = 'poornasyamasundar';
		repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
				beforeSend: beforeSend, 
				
				success: function(response)
				{
					list = []
					for(i=0 ; i<response.length ; i++)
					{

						model = response[i].name.slice(0, 5).toLowerCase();
						//console.log(model)
						if(model != 'scrum')
							continue;

						list.push(response[i].columns_url); 
						
					}

					productivityHelper(list, 0, 0, 0);
				}
			}

			)
	}
	
function avgCardsHelper(list, counter, avg)
{
	if(counter == list.length)
	{
		print(avg, list.length)
	}
	else 
	{
	$.ajax(

		{

			type: 'GET',
			url: list[counter],
			beforeSend: beforeSend, 
								
			success: function(response)
			{
									//console.log(response)
				$.ajax(

					{

						type: 'GET',
						url: response[0].cards_url,
						beforeSend: beforeSend, 
						data:
						{
							archived_state: 'all',
						},
						success: function(response)
						{
							done=0;
							for(i=0 ; i<response.length ; i++)
							{
								if(response[i].archived)
									done++;
							}
							total = response.length;
							if(done==0)
								total++;
							avgCardsHelper(list, counter+1, avg+(done/total))
						}
					}

					)
			}
		}

	)
	}
}

function avgCards(type)
	{
		username = 'poornasyamasundar';
		repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
				beforeSend: beforeSend, 
				
				success: function(response)
				{
					//console.log(response.length)
					list = []
					for(i=0 ; i<response.length ; i++)
					{

						model = response[i].name.slice(0, type.length).toLowerCase();
						//console.log(model)
						if(model != type)
							continue;

						list.push(response[i].columns_url); 
						
					}

					avgCardsHelper(list, 0, 0);
				}
			}

			)
	}
	

function timeLeft(url, callback)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: url,
				beforeSend: beforeSend, 

				success: function(response)
				{
					createdTime = response.created_at;
					type1 = response.name.slice(0,6).toLowerCase();
					type2 = response.name.slice(0,5).toLowerCase();
					//console.log(createdTime, type)

					if(type1 == 'sprint')
					{
						endTime=new Date(createdTime);
    					endTime.setDate(endTime.getDate()+ 30);
					}
					else if(type2 == 'scrum')
					{
						endTime=new Date(createdTime);
    					endTime.setDate(endTime.getDate()+ 2);
					}
					endTime = endTime.toISOString();
					console.log(createdTime, endTime)
				}
			}
			)
}


function sprintsInfo()
	{
		username = 'poornasyamasundar';
		repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
				beforeSend: beforeSend, 
				
				success: function(response)
				{
					//console.log(response)
					list = []
					for(i=0 ; i<response.length ; i++)
					{

						model = response[i].name.slice(0, 6).toLowerCase();
						//console.log(model)
						if(model != 'sprint')
							continue;

						createdTime = response[i].created_at;
						endTime=new Date(createdTime);
    					endTime.setDate(endTime.getDate()+ 30);
    					endTime = endTime.toISOString();

						list.push({name: response[i].name, createdTime: createdTime, endTime: endTime})
						
					}

					console.log(list)
					return list;
				}
			}

			)
	}


	function scrumTasksDone(url)
{
	$.ajax(

	{
		type: 'GET',
		url: url,
		beforeSend: beforeSend,
		data: {
			archived_state: 'archived'
		},

		success: function(response)
		{
			console.log(response);
			list = []

			for(i=0 ; i<response.length ; i++)
			{
				list.push({creater: response[i].creator['login'], name: response[i].note, created_at: response[i].created_at, closed_at: response[i].updated_at})
			}

			console.log(list)
		}

	}

	)
}


function getScrums(endTime)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
				beforeSend: beforeSend, 
				
				success: function(response)
				{
					//console.log(response)
					list = []
					for(i=0 ; i<response.length ; i++)
					{

						model = response[i].name.slice(0, 5).toLowerCase();
						//console.log(model)
						if(model != 'scrum')
							continue;

						createdTime = response[i].created_at;
						scrum_endTime=new Date(createdTime);
    					scrum_endTime.setDate(scrum_endTime.getDate()+ 2);
    					scrum_endTime = scrum_endTime.toISOString();

    					//endTime = endTime.toISOString()
    					//console.log(createdTime, endTime) 
    					if(createdTime <= endTime)
						list.push({name: response[i].name, createdTime: createdTime, endTime: scrum_endTime})
						
					}

					console.log(list)
					return list;
				}
			}

			)
}

function specificScrums(url)
	{
		username = 'poornasyamasundar';
		repoName = 'git_demo';
		
		$.ajax(

			{

				type: 'GET',
				url: url,
				beforeSend: beforeSend, 
				
				success: function(response)
				{
					console.log(response)

					createdTime = response.created_at;
					endTime=new Date(createdTime);
    				endTime.setDate(endTime.getDate()+ 30);

    				return getScrums(endTime.toISOString())
				}
			}

			)
	}
	
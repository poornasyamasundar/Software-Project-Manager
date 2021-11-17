
// this function needs the end time of the required sprint
// that info is available in the arrays returned by getAll()
// this returns all the scrums that come under a specific scrum

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
					//return list;
				}
			}

			)
}

// this is a helper function to getTasks()
// we will not call this function explicitly

function getTasksHelper(url)
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

// from the arrays you have, pass columns_url as a parameter to this function

function getTasks(url)
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
					getTasksHelper(response[0].cards_url);
				}
			}

			)
}

// this function saves all scrums and sprints in 2 arrays
// there will be name, url, columns_url 

function getAll()
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
					sprints = []
					scrums = []
					for(i=0 ; i<response.length ; i++)
					{

						model = response[i].name.slice(0, 6).toLowerCase();
						model_ = response[i].name.slice(0, 5).toLowerCase();
						if(model != 'sprint' && model_ != 'scrum')
							continue;

						name = response[i].name;
						url = response[i].url;
						columns_url = response[i].columns_url;
						createdTime = response[i].created_at;
						if(model == 'sprint')
						{
							endTime=new Date(createdTime);
    						endTime.setDate(endTime.getDate() + 30);
    						endTime = endTime.toISOString(); 
							sprints.push({name: name, url: url, columns_url: columns_url,
											createdTime: createdTime, endTime: endTime
										})

						}
						else
						{	
							endTime=new Date(createdTime);
    						endTime.setDate(endTime.getDate() + 2);
    						endTime = endTime.toISOString(); 
							scrums.push({name: name, url: url, columns_url: columns_url,
											createdTime: createdTime, endTime: endTime
										}) 
						}
						
					}

					console.log('sprints');
					console.log('scrums');
				}
			}

			)

}

// order of collection of Info
// avgCards of sprint, scrum
// productivity
// avgTasks for sprint, scrum
// timeLeft for sprint, scrum

infoArray = []

function timeLeft(sprints, scrums)
{
	list = []
	for(i=0 ; i<sprints.length ; i++)
	{
		temp = sprints[i].endTime - sprints[i].createdTime ;
		list.push({name: sprints[i].name, time_left: temp});
	}
	infoArray['sprint_timeLeft'] = list;

	list = []
	for(i=0 ; i<scrums.length ; i++)
	{
		temp = scrums[i].endTime - scrums[i].createdTime ;
		list.push({name: scrums[i].name, time_left: temp});
	}
	infoArray['scrum_timeLeft'] = list;
}

function avgTasksHelper(list, counter, tasksDone, type, sprints, scrums)
{
	if(counter == list.length)
	{
		//print(tasksDone, list.length)
		if(type == 'sprint')
		{
			infoArray['sprint_avgTasks'] = tasksDone / list.length;
			//console.log('avgTasksCompleted for scrum');
			avgTasksCompleted('scrum', sprints, scrums); 
		}
		else
		{
			infoArray['scrum_avgTasks'] = tasksDone / list.length;
			//console.log('printing time left for each sprint');
			timeLeftHelper(sprints, scrums);
		}
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
							avgTasksHelper(list, counter+1, tasksDone+response.length, type, sprints, scrums)
						}
					}

					)
			}
		}

	)
	}
}

function avgTasksCompleted(type, sprints, scrums)
{
		list = [];
		if(type == 'sprint')
			for(i=0 ; i<scrums.length ; i++)
				list.push(scrums[i].columns_url)
		else
			for(i=0 ; i<sprints.length ; i++)
				list.push(sprints[i].columns_url)

	productivityHelper(list, 0, 0, 0, sprints, scrums);	
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

							productivityHelper(list, counter+1, tasksDone, meetings+response.length, sprints, scrums)
						}
					}

					)
		
}

function productivityHelper(list, counter, tasksDone, meetings, sprints, scrums)
{
	if(counter == list.length)
	{
		//print(tasksDone, meetings)
		//console.log('avgTasksCompleted for sprint');
		infoArray['productivity'] = tasksDone / meetings;
		avgTasksCompleted('sprint', sprints, scrums);
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

							productivityHelper2(list, response[1].cards_url, counter, tasksDone+response_.length, meetings, sprints, scrums)
						}
					}

					)
			}
		}

	)
	}
}

function productivity(sprints, scrums)
{
	list = [];
	for(i=0 ; i<scrums.length ; i++)
		list.push(scrums[i].columns_url)

	productivityHelper(list, 0, 0, 0, sprints, scrums);			
			
}
	
	
function avgCardsHelper(avg, type, sprints, scrums, idx)
{
	if(type == 'sprint' && idx == sprints.length)
	{
		//print(avg, sprints.length)
		infoArray['sprint_avgCards'] = avg / sprints.length;
		avgCardsHelper(0, 'scrum', sprints, scrums, 0);
	
	}
	else if(type == 'scrum' && idx == scrums.length)
	{
		//print(avg, scrums.length)
		infoArray['scrum_avgCards'] = avg / scrums.length;
		productivity(sprints, scrums);
	}
	else 
	{

		if(type == 'scrum')
		{
			url = scrums[idx].columns_url;
		}
		else
		{
			url = sprints[idx].columns_url;
		}

	$.ajax(

		{

			type: 'GET',
			url: url,
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
							avgCardsHelper(avg+(done/total), type, sprints, scrums, idx+1);
						}
					}

					)
			}
		}

	)
	}
}

function avgCards(sprints, scrums)
{
			
	avgCardsHelper(0, 'sprint', sprints, scrums, 0);
	
}
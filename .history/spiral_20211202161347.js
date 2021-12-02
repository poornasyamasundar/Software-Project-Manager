
function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+'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');
}


// 

function spiralColumnsHelper(spiralCards, columns, idx)
	{
		if(idx == columns.length)
		{
			console.log(spiralCards);
		}
		else
		{
			$.ajax(

			  {
			  	  type: 'GET',
			  	  url: columns[idx].cards_url,
			  	  beforeSend: beforeSend,
			  	  data: {
			  	  	archived_state: 'all',
			  	  },

			  	  success: function(response)
			  	  {
			  	  	 list = [];
			  	  	 for(i=0 ; i<response.length ; i++)
			  	  	 	list.push(response[i]);

			  	  	 spiralCards.push({name: columns[idx].name, cards: list});

			  	  	 spiralColumnsHelper(spiralCards, columns, idx+1);
			  	  } 
			  }

			)
		}
	}

	function getSpiralColumns(url)
	{
		$.ajax(
		
		  {
		  	  type: 'GET',
		  	  url: url,
		  	  beforeSend: beforeSend,

		  	  success: function(response)
		  	  {
		  	  	 spiralCards = []
		  	  	 columns = []
		  	  	 for(i=0 ; i<response.length ; i++)
		  	  	 {
		  	  	 	columns.push({name: response[i].name, cards_url: response[i].cards_url});
		  	  	 }
		  	  	 spiralColumnsHelper(spiralCards, columns, 0);
		  	  }   
		  }

		)
	}

	function spiral(number)
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
			   		for(i=0 ; i<response.length ; i++)
			   		{
			   			arr = response[i].name.split('-');
			   			model = arr[0].toLowerCase();
			   			no = parseInt(arr[1]);
			   			if(model == 'spiral' && number == no)
			   			{
			   				getSpiralColumns(response[i].columns_url);
			   				break;

			   			}  
			   		}
			   }
		  }

		)
	}
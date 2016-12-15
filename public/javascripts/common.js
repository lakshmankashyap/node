EndPoint = "/api";

/*
* function to get url parameter
*/
function getUrlParameter(sParam) {
	sParam = sParam.toLowerCase();
	var sPageURL = window.location.search.substring(1).toLowerCase();
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) 
		{
			return sParameterName[1];
		}
	}
}
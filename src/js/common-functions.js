function isEnter(e,preventDefault){
	if (e.which == '13') {
		if(preventDefault){
			e.preventDefault();
		}
		return true;
   }
   return false;
}
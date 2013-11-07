var app = {};


function App() {
	this.tasks=[];
	this.author="me";
	this.storageName='content';
}

App.prototype.pause = function() {
  this.isPlaying = false;
};

App.prototype.add = function(task){
	this.tasks.push(task);
	this.persist();
};

App.prototype.persist = function() {
	this.saveToSession(this.storageName,$.toJSON(this));
};

App.prototype.isLocalStorageAvailable = function(){
	var available = Modernizr.localstorage;
	if(available){
		console.log("localstorage is available. content="+$.toJSON(content));
	} else {
		console.log("localstorage is NOT available");
	}
	return Modernizr.localstorage;
};

App.prototype.retrieveFromStorage = function (){
	if(this.isLocalStorageAvailable){
		var appStorage = this.loadFromSession(this.storageName);

		console.log("retrieveFromStorage :: "+appStorage);

		if(undefined != appStorage){
			this.copyFrom($.parseJSON(appStorage));
		}

	}
};

App.prototype.removeAll = function(){
	if(undefined!=this.tasks){
		this.tasks.length = 0;
	}
	this.copyFrom(new App());
	this.persist();
}

App.prototype.copyFrom = function(object) {
	for (var attr in object) {
		if (object.hasOwnProperty(attr)) this[attr] = object[attr];
	}
};

App.prototype.loadFromSession = function(name) {
	return localStorage.getItem(name);
};

App.prototype.saveToSession = function(name,data){
	localStorage.setItem(name,data);
}

/*
Object.prototype.clone = function() {
  if(this.cloneNode) return this.cloneNode(true);
  var copy = this instanceof Array ? [] : {};
  for(var attr in this) {
    if(typeof this[attr] == "function" || this[attr]==null || !this[attr].clone)
      copy[attr] = this[attr];
    else if(this[attr]==this) copy[attr] = copy;
    else copy[attr] = this[attr].clone();
  }
  return copy;
}

Date.prototype.clone = function() {
  var copy = new Date();
  copy.setTime(this.getTime());
  return copy;
}

Number.prototype.clone = 
Boolean.prototype.clone =
String.prototype.clone = function() {
  return this;
}
*/
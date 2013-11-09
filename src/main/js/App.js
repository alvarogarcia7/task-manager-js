var Task = function(name,deadline){
	var self = this;
	self.name = name;
	self.deadline = deadline;
};


var App = function() {
	var self = this;
	self.tasks=ko.observableArray([]);

	self.currentItem= undefined;
	
	self.author=ko.observable("me");
	self.storageName='content';


	self.add = function(task){
		
		self.tasks.push(task);
		this.persist();
	};

	self.setCurrentItem = function(task){
		this.currentItem = ko.observable(task);
	}

	self.add(new Task("task 1","today"));
	self.setCurrentItem(new Task("comprar pan","maNana"));
}
App.prototype.pause = function() {
  this.isPlaying = false;
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



var AppModel = function(app) {
    var self = this;

    //console.log(app);
    self.app = ko.observable(app);
    //console.log(self.app().tasks);
 
    self.addTask = function() {
   
         self.app().add({
            name: "",
            deadline: ""
        });
    };
 
    self.removetask = function(task) {
        self.tasks.remove(task);
    };
 
    self.save = function(form) {
        alert("Could now transmit to server: " + ko.utils.stringifyJson(self.tasks));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.tasks);
    };
};
 

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
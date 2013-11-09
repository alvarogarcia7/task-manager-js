var Task = function(name,deadline){
	var self = this;
	self.name = name;
	self.deadline = deadline;
	self.id=0;
};


var App = function() {
	var idCounter =0;
	var self = this;
	self.tasks=ko.observableArray([]);

	this.currentItem = ko.observable(new Task("comprar pan","maNana"));
	
	self.author=ko.observable("me");
	self.storageName='content';


	self.add = function(task){
		task.id=idCounter;
		idCounter++;
		self.tasks.push(task);

		console.log("self.tasks()=");
		console.log(self.tasks());
		this.persist();
	};
	
	//self.add(new Task("task 1","today"));


	 self.removetask = function(task,persist) {
    	//console.log("pasa removetask");
    	//console.log(task);
    	//console.log(self.tasks());
        self.tasks.remove(task);
        //console.log(self.tasks());
        if(persist){
	        self.persist();
	    }
    };

self.removeAll = function(){
	console.log("removeAll. tasks().length="+this.tasks().length);
	var i =0;
	//console.log(this.tasks());
	for (var i = this.tasks().length - 1; i >= 0; i--) {
		self.removetask(this.tasks()[i]);
	};

	//console.log("deleted "+i+" items");
	//console.log(this.tasks());
	this.persist();
	//console.log(this.tasks());
}

self.copyFrom = function(string) {
	var object = ko.toJS(string);
	var newApp = $.parseJSON(string);
	for (var attr in object) {
		//if (object.hasOwnProperty(attr)) {
		if (self.hasOwnProperty(attr) || typeof attr == 'function'){
			self[attr] = object[attr];
		}
	}

	self.tasks(newApp.tasks);

	return self;

};

};


App.prototype.persist = function() {
	console.log("pasa persist");
	this.saveToSession(this.storageName,ko.toJSON(this));
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
			this.copyFrom(appStorage);
		}

	}
};

App.prototype.loadFromSession = function(name) {
	return localStorage.getItem(name);
};

App.prototype.saveToSession = function(name,data){
	localStorage.setItem(name,data);
}

App.prototype.addDummyData =function(){
	this.add(new Task("task 1","today"));
	this.currentItem(new Task("comprar pan","maNana"));
};

/*
var AppModel = function(app) {
    var self = this;

    self.app = ko.observable(app);
 
    self.addTask = function() {
         self.app().add({
            name: "",
            deadline: ""
        });
    };
 
    self.removetask = function(task) {
    	console.log("pasa removetask");
    	console.log(self.app());
        self.app().tasks.remove(task);
        console.log(self.app());
    };
 
    self.save = function(form) {
        alert("Could now transmit to server: " + ko.utils.stringifyJson(self.tasks));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.tasks);
    };
};
*/
 

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
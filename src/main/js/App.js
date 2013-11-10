var Task = function(name,deadline,id){
	var self = this;
	this.update(name,deadline,id);
};

Task.prototype.update = function(name,deadline,id) {
	this.name= name||"";
	this.deadline= deadline||"";
	this.id = id;
};


var App = function() {

	
	var self = this;

	self.idCounter =0;
	self.tasks=ko.observableArray([]);

	this.currentItem =ko.observable(new Task("",""));

	this.cache = new Task();
	
	self.author=ko.observable("me");
	self.storageName='content';

	/*
	//Bad idea -- does not work
	self.initializeAttributes = function(){
		self.author = ko.observable("me");
		self.currentItem = ko.observable(new Task("a","b"));
		self.tasks = ko.observableArray([new Task("a","b"),]);
		self.idCounter = 0;
	};
	*/

	self.add = function(task){
		if(undefined == task.id){
			task.id=self.idCounter;
			self.idCounter++;
		} else {
			var taskToDelete = self.findTaskById(task.id);
			self.removeTask(taskToDelete);
		}
		self.tasks.push(task);

		this.persist();
	};
	

	self.findTaskById = function(id){
		for (var i = self.tasks().length - 1; i >= 0; i--) {
			var currentItem = self.tasks()[i];
			if(id == currentItem.id){
				return currentItem;
			}
		};
	};

	// $root.commitTask'>Accept/Commit</a></td>
	// 					<td><a  href='#' data-bind='click: $root.rollbackTask

	self.commitTask = function(task){
		self.add(task);
		self.currentItem(new Task());
	};

	self.rollbackTask = function(task){

		console.log("received task = ");
		console.log(task);

		console.log(self.cache);
		self.add(self.cache);
		console.log(self.cache);
		self.currentItem(new Task());
		console.log(self.cache);
		self.cache=new Task();
		console.log(self.cache);
	};

	 self.removeTask = function(task,persist) {
    	
    	//console.log(task);
    	//console.log(self.tasks());
        self.tasks.remove(task);
        //console.log(self.tasks());
        if(undefined==persist|| (undefined != persist && true == persist)){
        	console.log("pasa removeTask . persist = "+persist + " es true");
	        self.persist();
	    } else {
	    	console.log("pasa removeTask . persist = "+persist + " es false");
	    }
    };

    self.editTask = function(task) {
    	self.currentItem(task);
    	self.cache = task.clone();

    };

	self.removeAll = function(){
		//console.log("removeAll. tasks().length="+this.tasks().length);
		console.log("removeAll");
		var i =0;
		//console.log(this.tasks());
		for (var i = this.tasks().length - 1; i >= 0; i--) {
			self.removeTask(this.tasks()[i], false);
		};

		//console.log("deleted "+i+" items");
		//console.log(this.tasks());
		this.persist();
		//console.log(this.tasks());
	}

	self.copyFrom = function(string) {

		if(string){
			var object = ko.toJS(string);
			var newApp = $.parseJSON(string);
			for (var attr in object) {
				//if (object.hasOwnProperty(attr)) {
				if (self.hasOwnProperty(attr) || typeof attr == 'function'){
					self[attr] = object[attr];
				}
			}

			self.tasks(newApp.tasks);
			self.idCounter = newApp.idCounter;
		}
		return self;

	};

	self.retrieveFromStorage();

};


App.prototype.persist = function() {
	this.saveToSession(this.storageName,ko.toJSON(this));
};

App.prototype.isLocalStorageAvailable = function(){
	var available = Modernizr.localstorage;
	if(available){
		console.log("localstorage is available. content="+$.toJSON(content));
	} else {
		alert("localstorage is NOT available. The application may not work properly");
	}
	return Modernizr.localstorage;
};

App.prototype.retrieveFromStorage = function (){
	var storedAppAvailable = true;
	var appStorage;
	if(this.isLocalStorageAvailable){
		appStorage = this.loadFromSession(this.storageName);

		//http://saladwithsteve.com/2008/02/javascript-undefined-vs-null.html
		if(!appStorage){
			storedAppAvailable = false;
		}
	} else {
		storedAppAvailable = false;
	}
	
	if(storedAppAvailable){
		self = this.copyFrom(appStorage);
	}
};

App.prototype.loadFromSession = function(name) {
	return localStorage.getItem(name);
};

App.prototype.saveToSession = function(name,data){
	//console.log("saveToSession:: name="+name+", data = "+data);
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
 
    self.removeTask = function(task) {
    	console.log("pasa removeTask");
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
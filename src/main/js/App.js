var Task = function(name,deadline,id){
	var self = this;
	this.update(name,deadline,id,false,undefined);
};

Task.prototype.updateFrom = function(task) {
	this.update(task.name,task.deadline,task.id,task.done,task.categories);
};

Task.prototype.update = function(name,deadline,id,done,categories) {
	this.name= name||"";
	this.deadline= deadline||"";
	this.done = ko.observable(done||false);
	this.id = id;
	this.categories = ko.observableArray(categories||[]);
};

Task.prototype.getCategory = function(name) {
	return "@"+name;
};

var CONFIG = (function(){
	var privateVars = {
		'STORAGE_NAME': 'content',
		'STORAGE_SERVER': 'http://82.98.168.17/todotwist/backend/tt.php',
	};

	return {
		get: function (name) { return privateVars[name]; }
	};

})();


var App = function() {

	var i = 0;
	
	var self = this;

	self.idCounter =0;
	self.tasks=ko.observableArray([]);

	self.newTask = ko.observable(false);

	this.currentItem =ko.observable(new Task());

	this.cache = ko.observable(null);

	this.username = ko.observable('a');
	// this.passwd = ko.observable(null);
	this.passwd = ko.observable('40bd001563085fc35165329ea1ff5c5ecbdbbeef');

	this.dirty = ko.observable(false);
	
	self.author = ko.observable("me");

	self.tags = ko.computed(function(){
		var uniqueTags = [];
		for (var i = self.tasks().length - 1; i >= 0; i--) {
			for(var j = self.tasks()[i].categories().length - 1; j>= 0; j--){
				var current = self.tasks()[i].categories()[j];
				if($.inArray(current,uniqueTags) < 0){
					uniqueTags.push(current);
				}
			}
		};
		return uniqueTags;
	});

	/*
	//Bad idea -- does not work
	self.initializeAttributes = function(){
		self.author = ko.observable("me");
		self.currentItem = ko.observable(new Task("a","b"));
		self.tasks = ko.observableArray([new Task("a","b"),]);
		self.idCounter = 0;
	};
	*/

	self.add = function(){
		var task = self.currentItem();
		console.log(task);
		if(undefined == task.id){
			task.id=self.idCounter;
			self.idCounter++;
		}
		self.tasks.push(task);
		self.cache(null);
		self.currentItem(new Task());
		this.newTask(false);
		this.persist();
		self.dirty(true);
	};

	

	// self.findPositionInTasksById =function(id){
	// 	for (var i = self.tasks().length - 1; i >= 0; i--) {
	// 		var currentItem = self.tasks()[i];
	// 		if(id == currentItem.id){
	// 			return i;
	// 		}
	// 	};
	// };

	// self.findTaskById = function(id){
	// 	var position = self.findPositionInTasksById(id);
	// 	return self.tasks()[position];
	// };

	// $root.commitTask'>Accept/Commit</a></td>
	// 					<td><a  href='#' data-bind='click: $root.rollbackTask

	self.createNewTask = function() {
		self.cache(new Task());
		self.currentItem(new Task());
		self.newTask(true);
		self.dirty(true);
	};

	self.commitTask = function(task){
		self.tasks.replace(self.cache(),task);
		self.tasks.valueHasMutated();
		self.currentItem(new Task());
		self.cache(null);
		self.newTask(false);
		self.persist();
		self.dirty(true);
	};

	self.rollbackTask = function(task){
		self.tasks.replace(task,self.cache());
		self.tasks.valueHasMutated();
		self.currentItem(new Task());
		self.cache(null);
		self.newTask(false);
		self.dirty(true);
	};

	 self.removeTask = function(task,persist) {
    	
        self.tasks.remove(task);
        if(undefined==persist|| (undefined != persist && true == persist)){
        	console.log("pasa removeTask . persist = "+persist + " es true");
	        self.persist();
	    } else {
	    	console.log("pasa removeTask . persist = "+persist + " es false");
	    }
		self.dirty(true);
    };

    self.editTask = function(task) {
    	self.newTask(false);
    	self.currentItem(task);
    	self.cache(task.clone());
		self.dirty(true);
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
		self.dirty(true);
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

			//convert objects to tasks
			var newTasks = [];
			$.each(newApp.tasks,function(index,task){
				var newTask = new Task();
				newTask.updateFrom(task);
				newTasks.push(newTask);
			});

			self.tasks(newTasks);
			self.idCounter = newApp.idCounter;
		}
		return self;

	};
};


App.prototype.persist = function() {
	this.saveToSession(CONFIG.get('STORAGE_NAME'),ko.toJSON(this));
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
		appStorage = this.loadFromSession(CONFIG.get('STORAGE_NAME'));

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

App.prototype.clearStorage = function(){
	localStorage.clear();
}

App.prototype.addDummyData =function(){
	this.currentItem(new Task("task 1","today"));
	this.add();
};

App.prototype.createToken = function() {
	var clearPassword = this.passwd();
	var codedPassword = hex_sha1(clearPassword);
	this.passwd(codedPassword);
};

var lastXhr; ;

App.prototype.saveToServer =function(alert){
	var self=this;
	if(this.username() && this.passwd() && this.passwd() != null){
		$.getJSON(CONFIG.get('STORAGE_SERVER')+"?callback=?",
			 {
			 	user:this.username(),
			 	token: this.passwd(),
			 	action:'save',
			 	app_contents:ko.toJSON(self)
			 })
			.fail(function(data,textStatus,error){
				self.handleAjax(data,"ERROR","There was an error communicating with the server",alert);
				return -2;
			 })
			.done(function(data,textStatus,error){
			 	self.handleAjax(data,"INFO","Saved OK",alert);
			 	self.dirty(false);
			 	return 0;
			 });
	} else {
		this.handleAlert("WARN","The username or password were not set when connecting to the server",alert);
		return -1;
	}
};

App.prototype.retrieveFromServer = function(alert){
	var self = this;
	if(this.username() && this.passwd() && this.passwd() != null){
		$.getJSON(CONFIG.get('STORAGE_SERVER')+"?callback=?",
			 {
			 	user: this.username(),
			 	token:this.passwd(),
			 	action:'load',
			 })
			.fail(function(data,textStatus,error){
				self.handleAjax(data,"ERROR","There was an error communicating with the server",alert);
			})
			.done(function(data,textStatus,error){
		 		self.handleAjax(data,"INFO", "LOAD OK",alert);
		 		var dataString=ko.toJSON(data.payload);
				self = self.copyFrom(dataString);
			}).always(function(data,textStatus,error){
				console.log("back from retrieveFromServer");
			});
	} else {
		this.handleAlert("WARN","The username or password were not set when connecting to the server",alert);
	}

};

App.prototype.handleAjax = function(xhr,debugLevel,messageToPrint,alert) {
	lastXhr = xhr;
	var newMessage = messageToPrint+": "+xhr.messageDescription;

/*
	switch(xhr.status){
		case 404:
			newMessage = newMessage + xhr.state();
			break;
		case 'load':
			newMessage = newMessage + xhr.success().statusText;
			break;
		default:
			newMessage = newMessage + "other status";
			break;
	}
*/
	this.handleAlert(debugLevel,newMessage,alert);
};

App.prototype.handleAlert = function(level,message,needToAlert) {
	var alertNew = needToAlert;
	if(undefined == needToAlert){
		alertNew = true;
	}
	if(alertNew){
		alert(level+": "+message);
	}
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
 


Task.prototype.clone = function() {
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

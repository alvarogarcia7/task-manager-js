describe("App", function() {
  var app;

  
  beforeEach(function() {
    app = new App();
  });

  afterEach(function () {
    app.removeAll();
  });


  describe("basic tests", function() {

      beforeEach(function() {
         expectStorageIsEmpty();
      });

    	it("variable app should exist", function() {
    		expect(undefined == app).toBeFalsy();
    	});

      
    	it("tasks should be empty", function() {
    		expect(app.tasks()).toEqual([]);
    	});

      it("basic author", function() {
        expect(app.author()).toEqual("me");
      });
  });

	describe("session storage",function(){
    it("clear it", function() {
      add1Task();
      clearTasksAndStorage();
    });

    it("save to it", function () {
      expectStorageIsEmpty();
      add1Task();
      expectStorageIsNotEmpty(1);
      add1Task();
      expectStorageIsNotEmpty(2);
      add1Task();
      expectStorageIsNotEmpty(3);
    });


    localStorage.clear();
    it("starting for first time", function(){
      add1Task();
      expectStorageIsNotEmpty(1);
    });

  });



  function clearTasksAndStorage () {
    app.removeAll();
    expect(app.tasks.length).toEqual(0);
    expectStorageIsEmpty();
  }



  function expectStorageIsEmpty(){

    var a=app.loadFromSession(app.storageName);
    //console.log("expectStorageIsEmptyOrLikeNew "+a);
    var app2 = new App();
    app2 = app2.copyFrom(a);
    //console.log("expectStorageIsEmptyOrLikeNew => ");
    //console.log(app2.tasks());
    expect(a==null || app2.tasks().length==0 ).toBe(true);
  }

  function expectStorageIsNotEmpty(taskSize){
    var appString = app.loadFromSession(app.storageName);
    //console.log("appstring = "+appString);
    expect(appString).not.toBe(null);
    expect(appString).not.toBe(undefined);

    if(undefined != taskSize){
        var storageApp = app.copyFrom(appString);
        //console.log(storageApp);
        //console.log(taskSize);
        expect(storageApp.tasks().length).toBe(taskSize);
    }
  }

  function add1Task () {
    var previousTaskNumber = app.tasks().length;
    expect(previousTaskNumber >= 0).toBe(true);
    app.add(new Object());

    var newTaskNumber = previousTaskNumber+1;
    expect(app.tasks().length).toEqual(newTaskNumber);
    expect(newTaskNumber > 0).toBe(true);

  }
/*
  describe("when song has been paused", function() {
    beforeEach(function() {
      app.play(song);
      app.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(app.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(app).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      app.resume();
      expect(app.isPlaying).toBeTruthy();
      expect(app.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    app.play(song);
    app.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      app.play(song);

      expect(function() {
        app.resume();
      }).toThrow("song is already playing");
    });
  });
  */
});
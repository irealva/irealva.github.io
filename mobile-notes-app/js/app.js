/*
Main App file 
*/

/*
// Sample Data (An array of objects)
    var todos = [{
        "id": 1,
        "title": "Go to the shop",
        "description": "Get milk and bread"
    }, {
        "id": 2,
        "title": "Post office",
        "description": "Collect mail"
    }];

    //TO DO: if no sample data then add sample data
    // Add the sample data to localStorage
    //window.localStorage.setItem("todos", JSON.stringify(todos));
*/

// jQuery plugin - Encode a set of form elements as a JSON object for manipulation/submission.
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// Define the app as a object to take out of global scope
var app = {
    findAll: function() {
        console.log('DEBUG - 2. findAll() triggered');

        var notes = JSON.parse(window.localStorage.getItem("todos"));
        console.log(notes) ;
        var len = notes.length;
        var note;

        allNotes = [];

        // Loop through todos, build up lis and push to arrays
        for (var i = 0; i < len; i++) {
            note = notes[i];
            allNotes.push('<li data-row-id="' + note.id + '" class="outstanding"><a href="view.html" data-transition="slide" class="view" data-view-id="' + note.id + '"><h2>' + note.title + '</h2><p>' + note.description + '</p></a><a href="#" data-icon="delete" data-iconpos="notext" class="delete-button" data-mark-id="' + note.id + '">Delete</a></li>');
        }

        // Remove any previously appended
        $('.todo-listview li').remove();

        // Append built up arrays to ULs here.
        $('.todo-listview').append(allNotes);

        // Refresh JQM listview
        $('.todo-listview').listview('refresh');
    },

    findById: function(id) {
        var todo = this.getFromStorage(id);

        $(document).on('pagebeforeshow', '#view', function(event) {
            $('#title').val(todo.title);
            $('#title').attr('data-id', id);
            $('#description').val(todo.description);
            $('#id').val(id);
        });
    },

    getFromStorage: function(id) {
        var todos = JSON.parse(window.localStorage.getItem("todos")),
            todo = null,
            len = todos.length,
            i = 0;

        for (; i < len; i++) {
            if (todos[i].id === id) {
                todo = todos[i];
                //break;
            }
        }

        return todo;
    },

    insert: function(json) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var passedJson = JSON.parse(json);

        // Get all todos
        var todos = JSON.parse(window.localStorage.getItem("todos")),
            todo = null,
            len = todos.length,
            i = 0;


        if (len == 0) {
            var newTodo = {
                "id": 1,
                "title": passedJson.title,
                "description": passedJson.description
            }
            todos.push(newTodo);
        } else {
            // Generate a new ID, pop the last obj in the array and grab the ID
            var lastTodo = todos.pop(),
                newID = lastTodo.id + 1;

            // Create the new Todo
            var newTodo = {
                    "id": newID,
                    "title": passedJson.title,
                    "description": passedJson.description
                }
                // Add it to the existing todos        
            todos.push(lastTodo); // Add the popped one back in
            todos.push(newTodo);
        }

        try {
            window.localStorage.setItem("todos", JSON.stringify(todos));
            console.log("DEBUG - Success,  add returned true");
        } catch (error) {
            alert("Problem saving to localstorage: " + error.message);
        } finally {
            // Redirect back to #home page, add a transition andchange the hash
            $.mobile.changePage($("#home"), {
                transition: "slide",
                reverse: true,
                changeHash: true,
            });
        }
    },

    update: function(json) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var passedJson = JSON.parse(json);

        // Get all todos
        var todos = JSON.parse(window.localStorage.getItem("todos")),
            todo = null,
            len = todos.length,
            i = 0;


        // Loop through them and update the value
        $.each(todos, function(i, v) {
            if (v.id == passedJson.id) {
                v.title = passedJson.title;
                v.description = passedJson.description;
                return false;
            }
        });


        try {
            window.localStorage.setItem("todos", JSON.stringify(todos));
            console.log("DEBUG - Success, updated returned true");
        } catch (error) {
            alert("Problem updating to localstorage: " + error.message);
        }
    },

    delete: function(json) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var passedJson = JSON.parse(json);

        // Get all todos
        var todos = JSON.parse(window.localStorage.getItem("todos")),
            todo = null,
            len = todos.length,
            i = 0;

        // Loop through existing todos and remove one to be deleted
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id == passedJson.id) {
                todos.splice(i, 1); //removes 1 element at position i 
                break;
            }
        }

        try {
            window.localStorage.setItem("todos", JSON.stringify(todos));
            console.log("DEBUG - Success, delete returned true");
        } catch (error) {
            alert("Problem deleting from localstorage: " + error.message);
        } finally {
            // Redirect back to #home page
            $.mobile.changePage($("#home"), {
                transition: "slide",
                reverse: true,
                changeHash: true
            });
        }
    },

    deleteButton: function(id) {

        // Get all todos
        var todos = JSON.parse(window.localStorage.getItem("todos")),
            todo = null,
            len = todos.length,
            i = 0;

        // Loop through existing todos and remove one to be deleted
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id == id) {
                console.log("my todos id is : " + todos[i].id + " while my input id is: " + id);
                todos.splice(i, 1); //removes 1 element at position i 
                break;
            }
        }

        try {
            window.localStorage.setItem("todos", JSON.stringify(todos));
            console.log("DEBUG - Success, quick delete returned true");
        } catch (error) {
            alert("Problem with quickDelete: " + error.message);
        } finally {
            var originalRow = $('#home *[data-row-id="' + id + '"]'),
                title = originalRow.find("h2").text(),
                desc = originalRow.find("p").text();

            // Remove from pending row
            originalRow.remove();
        }
    },

    initialize: function() {
        // Bind all events here when the app initializes
        $(document).on('pagebeforeshow', '#home', function(event) {
            console.log("DEBUG - 1. Home pageinit bind");
            app.findAll();
        });

        $(document).on('click', '.view', function(event) {
            console.log("DEBUG - Trying to access view");
            console.log("in the VIEW");
            app.findById($(this).data('view-id'))
        });

        $(document).on('click', '.add', function(event) {
            console.log("DEBUG - Trying to insert via the add method");
            var data = JSON.stringify($('#insert').serializeObject());
            app.insert(data);
        });

        $(document).on('change', '.target', function(event) {
            console.log("DEBUG - Trying to update on change");
            var data = JSON.stringify($('#edit').serializeObject());
            app.update(data);
        });

        $(document).on('click', '.delete', function(event) {
            console.log("DEBUG - Trying to delete after delete btn press");
            var data = JSON.stringify($('#edit').serializeObject());
            app.delete(data);
        });

        $(document).on('click', '.delete-button', function(event) {
            console.log("DEBUG - Delete button shortcut pressed");
            app.deleteButton($(this).data('mark-id'));
        });
    }

};

app.initialize();

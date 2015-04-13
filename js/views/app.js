// js/views/app.js

var app = app || {};

//The Application
//---------------

//Our overall **AppView** is the top-level place of UI.
app.AppView = Backbone.View.extend({

	//Instead of generating a new element, bind to the existing skeleton of
	//the app already present in the HTML

	el: '#todoapp',

	//Our template for the line of statistics at the bottom of the app.
	statsTemplate: _.template($('#stats-template').html()),

	//New
	//Delegated events for creating new items, and clearing completed ones.

	events: {
		'keypress #new-todo':'createOnEnter',
		'click #clear-completed':'clearCompleted',
		'click #toggle-all':'toggleAllComplete'
	},

	//At initialization we bind to the relevant events on `Todos`
	//collection, when items are added or changed.

	initialize: function(){
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll);

		//New
		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.listenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);

		app.Todos.fetch();
	},

	//Add a single todo item to the list by creating a view for it, and
	//appending its element to the `<ul>`.

	addOne: function(todo){
		var view = new app.TodoView({model:todo});
		$('#todo-list').append(view.render().el);
	},

	//Add all items in the **Todos** collection at once.
	addAll: function(){
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	}

});
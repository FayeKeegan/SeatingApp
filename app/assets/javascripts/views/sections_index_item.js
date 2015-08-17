SeatingApp.Views.SectionIndexItem = Backbone.CompositeView.extend({
	template: JST["sections/index_item"],
	className: "row",

	initialize: function(){
		this.listenTo(this.model, "sync", this.render)
		this.model.seatingCharts().each(this.addSeatingChartIndexItem.bind(this))
		this.listenTo(this.model.seatingCharts(), "add", this.addSeatingChartIndexItem.bind(this))
		this.listenTo(this.model.seatingCharts(), "add", this.addChartNewSubview.bind(this))
		this.listenTo(this.model.seatingCharts(), "remove", this.render)
		this.listenTo(this.model, "sync", this.render)
		this.addChartNewSubview();
	},

	events: {
		"submit .new-seating-chart" : "createSeatingChart",
		"mouseenter #seating-chart-index-item" : "seatingChartHighlight",
		"mouseleave #seating-chart-index-item" : "seatingChartUnhighlight",
		"mouseenter #new-seating-chart-index-item" : "seatingChartHighlight",
		"mouseleave #new-seating-chart-index-item" : "seatingChartUnhighlight"

	},

	seatingChartHighlight: function (e){
		$(e.currentTarget).removeClass("panel-primary").addClass("panel-info")
	},

	seatingChartUnhighlight: function (e){
		$(e.currentTarget).removeClass("panel-info").addClass("panel-primary")
	},

	createSeatingChart: function(e){
		e.preventDefault();
		var view = this;
		var seatingChartData = $(e.delegateTarget).find(".new-seating-chart-form").serializeJSON()
		var seatingChart = new SeatingApp.Models.SeatingChart(seatingChartData)
		seatingChart.set({ section_id: this.model.id })
		seatingChart.save({},{
			success: function(){
				view.model.seatingCharts().add(seatingChart);
				Backbone.history.navigate("seating_charts/"+ seatingChart.id + "/edit", { trigger: true })
			}
		})
	},

	render: function(){
		var content = this.template(({section: this.model }))
		this.$el.html(content)
		this.attachSubviews();
		return this
	},

	addSeatingChartIndexItem: function(seatingChart){
		var view = new SeatingApp.Views.SeatingChartIndexItem({
			model: seatingChart,
			collection: this.model.seatingCharts()
		})
		this.addSubview("#seating-charts-index", view)
	},

	addChartNewSubview: function(){
		var seatingChart = new SeatingApp.Models.SeatingChart()
		this.chartNewSubview = new SeatingApp.Views.SeatingChartNewSmall({ model: seatingChart });
		this.addSubview("#seating-charts-index", this.chartNewSubview)
	}
})
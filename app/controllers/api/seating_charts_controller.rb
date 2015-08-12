class Api::SeatingChartsController < ApplicationController

	def index
			@seating_charts = current_user.seating_charts
			render :index
	end

	def create
		@seating_chart = SeatingChart.new(seating_chart_params)
		if @seating_chart.save
			render json: @seating_chart
		else
			render json: @seating_chart.errors.full_messages
		end
	end

	def destroy
		@seating_chart = SeatingChart.find(params[:id])
		@seating_chart.destroy!
	end

	def show
		@seating_chart = SeatingCHart.find(params[:id])
		render :show
	end



	def seating_chart_params
		params.require(:seating_chart).permit(:name, :section_id)
	end


end

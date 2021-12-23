class EventsController < ApplicationController
  # GET /tasks
  def index
    @events = Event.all

    render json: @events
  end
end

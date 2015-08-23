class Api::V1::PostsController < ApplicationController
  
  

  private
  
  def time_buffer
    params[:infinite_scroll_time_buffer] and Time.parse(params[:infinite_scroll_time_buffer])
  end
  
  def page
    #params.has_key?(:page) ? params[:page] : 1
    
    params[:page].presence or 1
  end

end

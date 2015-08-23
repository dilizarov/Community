class Api::V1::PostsController < ApplicationController
  
  def index
    @posts = Post.where(community: params[:community]).includes(:user).
    order(created_at: :desc).
    created_before(time_buffer).
    page(page).
    per(15).
    to_a
    
    render status: 200,
    json: @posts
  end

  private
  
  def time_buffer
    params[:infinite_scroll_time_buffer] and Time.parse(params[:infinite_scroll_time_buffer])
  end
  
  def page
    #params.has_key?(:page) ? params[:page] : 1
    
    params[:page].presence or 1
  end

end

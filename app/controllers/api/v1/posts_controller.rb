class Api::V1::PostsController < ApplicationController
  
  def index
    # We include :communities because we'll select the community with name params[:community]
    # And from that association we'll derive the username and avatar image to use.
    # (Either default or community-specific one)
    @posts = Post.where(community: params[:community_id]).includes(user: [:communities]).
    order(created_at: :desc).
    created_before(time_buffer).
    page(page).
    per(15).
    to_a
    
    current_user.mark_liked_posts!(@posts)
    
    render status: 200,
    json: @posts,
    each_serializer: PostSerializer
  end

  def like
    if params[:dislike]
      @post.unliked_by(current_user)
    else
      @post.liked_by(current_user)
    end
    
    head :no_content
  end

  private
  
  def time_buffer
    params[:infinite_scroll_time_buffer] and Time.parse(params[:infinite_scroll_time_buffer])
  end
  
  def page
    params.has_key?(:page) ? params[:page] : 1    
  end
end

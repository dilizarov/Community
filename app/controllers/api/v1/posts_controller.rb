class Api::V1::PostsController < ApiController
  
  def index
    # We include :communities because we'll select the community with name params[:community]
    # And from that association we'll derive the username and avatar image to use.
    # (Either default or community-specific one)
    @posts = Post.where(community: params[:community].strip.downcase.gsub(" ", "_")).includes(user: [:communities]).
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

  def create
    @post = Post.new(post_params)
    
    if @post.save
      
      @post.notifications << Notification.new(user_id: current_user.id, kind: "post_created")
      
      render status: 200,
      json: @post
    else
      render status: :unprocessable_entity,
      json: { errors: @post.errors.full_messages }
    end
  end

  def like
    @post = Post.find_by!(external_id: params[:id])
    
    if params[:dislike]
      @post.unliked_by(current_user)      
    else
      @post.liked_by(current_user)
      
      @post.notifications.create(user_id: current_user.id, kind: "post_liked") rescue ActiveRecord::RecordNotUnique
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
  
  def post_params
    user_id = current_user ? current_user.id : nil
    params.require(:post).permit(:title, :body, :community, :username).merge(user_id: user_id)
  end
end

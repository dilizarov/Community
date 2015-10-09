class Api::V1::RepliesController < ApiController
  
  def index
    @post = Post.find_by!(external_id: params[:post_id])
    
    @replies = @post.replies.includes(user: [:communities]).to_a
    
    current_user.mark_liked_replies!(@replies)
    
    render status: 200,
           json: @replies
  end
  
  def create
    @post = Post.find_by!(external_id: params[:post_id])

    @reply = Reply.new(reply_params)
    @reply.post = @post
    
    if @reply.save
      
      @reply.notifications << Notification.new(user_id: current_user.id, kind: "reply_created")
            
      render status: :ok,
      json: @reply
    else
      render status: :unprocessable_entity,
      json: { errors: @reply.errors.full_messages }
    end  
  end
  
  def like
    @reply = Reply.find_by!(external_id: params[:id])
    
    if params[:dislike]
      @reply.unliked_by(current_user)      
    else
      @reply.liked_by(current_user)
      
      @reply.notifications.create(user_id: current_user.id, kind: "reply_liked") rescue ActiveRecord::RecordNotUnique
    end
    
    head :no_content
  end
  
  def destroy
    @reply = Reply.find_by!(external_id: params[:id])
    
    @reply.destroy
    head :no_content
  end
  
  private
  
  def reply_params
    params.require(:reply).permit(:body).merge(user_id: current_user.id)
  end
  
end

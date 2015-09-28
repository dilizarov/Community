class Api::V1::CommunitiesController < ApiController

  def index
    @communities = current_user.communities
    
    render status: 200,
    json: @communities,
    root: "communities",
    each_serializer: CommunitySerializer,
    meta: { success: true,
      info: "Communities",
      total: @communities.length }
  end
  
  def create
    relationship = JoinedCommunity.new(name: params[:community], user_id: current_user.id)
    
    if relationship.save
      head :no_content
    else
      head :unprocessable_entity
    end    
  end
  
  def show
    @relationship = JoinedCommunity.find_by!(normalized_name: normalized_name, user_id: current_user.id)
    
    render status: :ok,
    json: @relationship,
    root: "community",
    serializer: CommunitySerializer
  end
  
  def update
    @relationship = JoinedCommunity.find_by!(normalized_name: normalized_name, user_id: current_user.id)
    
    if params[:default]
      @relationship.remove_avatar!
      @relationship.username = nil
    else
      
      if params[:username] != nil
        if params[:username] != current_user.username
          @relationship.username = params[:username]
        else
          @relationship.username = nil
        end
      end
      
      if params[:community_avatar]
        @relationship.avatar = params[:community_avatar]
      end
    end
    
    if @relationship.save
      render status: :ok,
      json: @relationship,
      root: "community",
      serializer: CommunitySerializer
    else
      render status: :unprocessable_entity,
      json: { errors: @relationship.errors.full_messages }
    end
  end
  
  def destroy
    JoinedCommunity.find_by!(normalized_name: normalized_name, user_id: current_user.id).destroy
    
    head :no_content
  end
  
  private
  
  def normalized_name
    params[:community].strip.downcase.gsub(" ", "_")
  end

end

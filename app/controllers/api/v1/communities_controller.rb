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
    JoinedCommunity.create(name: params[:id], user_id: current_user.id)
    
    head :no_content
  end
  
  def update
    
  end
  
  def destroy
    JoinedCommunity.find_by!(name: params[:id], user_id: current_user.id).destroy
    
    head :no_content
  end

end

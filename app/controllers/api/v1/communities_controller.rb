class Api::V1::CommunitiesController < ApiController

  def index
    @communities = current_user.communities
    
    render status: 200,
    json: @communities,
    root: "communities",
    meta: { success: true,
      info: "Communities",
      total: @communities.length }
  end
  
  def create
    JoinedCommunity.create(name: params[:community], user_id: current_user.id)
    
    head :no_content
  end
  
  def destroy
    community = JoinedCommunity.where(name: params[:community], user_id: current_user.id).first and community.destroy
    
    head :no_content
  end

end

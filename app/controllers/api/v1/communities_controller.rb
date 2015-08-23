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

end

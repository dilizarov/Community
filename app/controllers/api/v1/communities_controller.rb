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
    @relationship = JoinedCommunity.new(name: params[:community], user_id: current_user.id)

    begin
      if @relationship.save
        render status: :ok,
        json: @relationship,
        root: "community",
        serializer: CommunitySerializer
      else
        head :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotUnique
      head :unprocessable_entity
    end
  end

  def update
    @relationship = JoinedCommunity.find_by!(normalized_name: normalized_name, user_id: current_user.id)

    if params[:default]
      @relationship.remove_avatar!
      @relationship.username = nil
    else

      if params[:username] != nil
        @relationship.username = params[:username]
      end

      if params[:community_avatar]
        @relationship.avatar = params[:community_avatar]
      end
    end

    begin
      if @relationship.save
        render status: :ok,
        json: @relationship,
        root: "community",
        serializer: CommunitySerializer
      else
        render status: :unprocessable_entity,
        json: { errors: @relationship.errors.full_messages }
      end
    rescue ActiveRecord::RecordNotUnique

      conflicting_relationship = JoinedCommunity.where(normalized_name: normalized_name).where('lower(username) = ?', params[:username].downcase).includes(:user).first

      # Users that are not meta can take meta user's usernames.
      if !current_user.meta && conflicting_relationship.user.meta
        conflicting_relationship.username = nil
        conflicting_relationship.save!
        retry
      else
        render status: :unprocessable_entity,
        json: { errors: ["Username is already taken"] }
      end
    end
  end

  def destroy
    JoinedCommunity.find_by!(normalized_name: normalized_name, user_id: current_user.id).destroy

    head :no_content
  end

  private

  def normalized_name
    params[:community].strip.downcase.gsub(" ", "")
  end

end

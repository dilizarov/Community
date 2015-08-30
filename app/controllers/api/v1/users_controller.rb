class Api::V1::UsersController < ApiController
  
  def upload_profile_pic
    render status: :ok,
    json: { user_id: params[:user_id], auth_token: params[:auth_token] }
  end
  
end

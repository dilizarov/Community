class Api::V1::SessionsController < ApiController
  
  skip_before_filter :ensure_current_user!, only: [:create, :generate_meta_account]
  
  def create
    @user = User.find_by(email: params[:user][:email])
    
    if @user && @user.valid_password?(params[:user][:password])
      @user.login!
      @user.sync_device!(params[:device]) if params[:device]
      
      render status: 200,
      json: @user,
      serializer: CurrentUserSerializer,
      root: "user",
      meta: { success: true,
        info: "Logged in" }
    else
      render status: :unprocessable_entity,
      json: { errors: ["Incorrect email or password"] }
    end
  end
  
  def generate_meta_account
    @user = User.create_meta_account!
    @user.login!
    
    render status: 200,
    json: @user,
    serializer: CurrentUserSerializer,
    root: "user",
    meta: { success: true,
      info: "Logged in" }
  end
  
  def sync_device
    current_user.sync_device!(params[:device])
    
    unless current_user.meta
      # Protect from timing attack and verify that we're syncing with a valid user
      if params[:meta_user_id] && params[:meta_auth_token]
        potential_meta_user = User.find_by(external_id: params[:meta_user_id])
        
        if potential_meta_user
          auth_tokens = potential_meta_user.authentication_tokens
          sync_flag = auth_tokens.select do |auth_token|
            
            flag = Devise.secure_compare(auth_token.token, params[:meta_auth_token])
            if flag
              potential_meta_user.auth_token = auth_token
            end
            
            flag
          end.present?
          
          if sync_flag
            potential_meta_user.sync_device!(params[:device])
          end
        end
      end
    end
    
    head status: :no_content
  end
  
  def destroy
    current_user.logout!
    
    head :no_content
  end
  
end

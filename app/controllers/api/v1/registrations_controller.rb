class Api::V1::RegistrationsController < Devise::RegistrationsController
  # My other API Controllers all inherit from ApiController, but since
  # I pass registration work over to Devise, I need to use this
  # skip_before_filter here as well.
  skip_before_filter :verify_authenticity_token,
                     if: Proc.new { |c| c.request.format == 'application/json' }
                       
  respond_to :json
  
  def create
    build_resource(sign_up_params)
    
    begin
      if resource.save
        
        # Protect from timing attack and verify that we're transferring with a valid user
        if params["transfer_user_id"] && params["transfer_auth_token"]
          potential_transfer_user = User.find_by(external_id: params["transfer_user_id"])
          
          if potential_transfer_user
            tokens = potential_transfer_user.authentication_tokens.map(&:token)
            transfer_flag = tokens.select { |token| Devise.secure_compare(token, params["transfer_auth_token"]) }.present?
            
            if transfer_flag
              potential_transfer_user.transfer_communities_to!(resource)
            end
          end
        end
        
        resource.login!
        resource.sync_device!(params[:device]) if params[:device]
      
        render status: 200,
        json: resource,
        serializer: CurrentUserSerializer,
        root: "user",
        meta: { success: true,
          info: "Registered" }
        else
          render status: :unprocessable_entity,
          json: { errors: resource.errors.full_messages }
        end
    rescue ActiveRecord::RecordNotUnique
      render status: :unprocessable_entity,
      json: { errors: [ "Username or email is already taken"] }
    end
  end
  
  def sign_up_params
    params.require(:user).permit(:username, :email, :password)
  end
end

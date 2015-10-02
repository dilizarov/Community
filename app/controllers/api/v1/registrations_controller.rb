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
        resource.login!
      
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
      json: { errors: [ "Username is already taken"] }
    end
  end
  
  def sign_up_params
    params.require(:user).permit(:username, :email, :password)
  end
end

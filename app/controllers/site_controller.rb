class SiteController < ApplicationController

  def root
    if params[:community]
      if params[:community][0] == "&"
        @community = params[:community][1..-1]
      else
        raise ActionController::RoutingError.new('Not Found')
      end
    end
  end

  def reset_password
    if params[:email] && params[:reset_token]

      @user = User.find_by(email: params[:email])

      if @user && Devise.secure_compare(@user.reset_password_token, params[:reset_token])
        @success = true
      end
    end
  end

end

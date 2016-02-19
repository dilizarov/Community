class SiteController < ApplicationController

  def root
    if params[:community]
      unless params[:community][0] == "&"
        raise ActionController::RoutingError.new('Not Found')
      end
    end
  end

  def reset_password
    if params[:email] && params[:reset_token]

      @user = User.find_by(email: params[:email])

      if @user &&
        Devise.secure_compare(@user.reset_password_token, params[:reset_token]) &&
        @user.reset_password_sent_at > 24.hours.ago

        @success = true
      end
    end
  end

end

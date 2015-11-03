class SiteController < ApplicationController
  
  def root
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

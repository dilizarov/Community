class UserMailer < ActionMailer::Base
  default from: "password@get.community"
  
  def reset_password(user)
    @user = user
    
    mail(to: @user.email, subject: "Reset your Community password")
  end
end

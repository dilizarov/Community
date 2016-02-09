class ResetPasswordEmail
  include Sidekiq::Worker
  sidekiq_options :retry => false

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.reset_password(user).deliver
  end
end

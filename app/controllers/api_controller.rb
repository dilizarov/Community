class ApiController < ApplicationController
  skip_before_filter :verify_authenticity_token,
                     if: Proc.new { |c| c.request.format == 'application/json' }
  
  # rescue_from CanCan::AccessDenied do |exception|
  #   render status: :unauthorized,
  #          json: { errors: [ "You are not authorized to perform this action" ] }
  # end
  
  rescue_from ActiveRecord::RecordNotFound do |exception|
    render status: :not_found,
    json: { error: "We could not find what you were looking for. It may have been deleted by another user." }
  end
  
  respond_to :json
  
  #before_action :authenticate_api_key!
  before_action :ensure_current_user!
  
  def authenticate_api_key!
    unless params[:api_key] == ENV["ANDROID_API_KEY"] || params[:api_key] == ENV["IOS_API_KEY"]
      render status: :unauthorized,
             json: { error: "Invalid API key" }
    end
  end
end
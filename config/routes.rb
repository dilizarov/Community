Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      devise_for :users, only: :registrations, path: '/registrations'
      
      post 'sessions'             => 'sessions#create',  as: 'login'
      post 'sessions/logout'      => 'sessions#destroy', as: 'logout'
            
      #Communities can have spaces in their names, which makes a truly restful API
      #a tad difficult. That is why we don't embed posts in communities for example.
      resources :communities, param: :community
      resources :posts do
        member do
          get 'like'
        end
      end
      
      resources :users, param: :user_id do
        member do
          post :profile_pic, action: :upload_profile_pic
        end
      end
    end
  end

end

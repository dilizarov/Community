Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      devise_for :users, only: :registrations, path: '/registrations'
      
      post 'sessions'             => 'sessions#create',  as: 'login'
      post 'sessions/logout'      => 'sessions#destroy', as: 'logout'
            
      resources :communities, shallow: true do
        resources :posts
      end
      
      resources :users, param: :user_id do
        member do
          post :profile_pic, action: :upload_profile_pic
        end
      end
    end
  end

end

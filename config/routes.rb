Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      devise_for :users, only: :registrations, path: '/registrations'
      
      post 'sessions'             => 'sessions#create',  as: 'login'
      post 'sessions/logout'      => 'sessions#destroy', as: 'logout'
      post 'sessions/meta_account' => 'sessions#generate_meta_account'
      post 'sessions/sync_device' => 'sessions#sync_device'
            
      #Communities can have spaces in their names, which makes a truly restful API
      #a tad difficult... not to mention they can also have / in them, which
      #makes them a complete nightmare.
      resources :communities, except: [:destroy, :edit, :update, :show, :new] do
        collection do
          delete 'destroy'
          get 'show'
          put 'update'
        end
      end

      resources :posts, only: [:index, :create, :destroy], shallow: true do
        member do
          get 'like'
        end
  
        resources :replies, only: [:index, :create, :destroy] do
          member do
            get 'like'
          end
        end
      end
            
      resources :users, param: :user_id, only: [] do
        member do
          post :profile_pic, action: :upload_profile_pic
          post :meta_username, action: :request_another_meta_username
          get :notifications
        end
      end
    end
  end

end

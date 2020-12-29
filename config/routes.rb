Rails.application.routes.draw do
  get 'tags/index'
  get 'tags/create'
  get 'tags/update'
  get 'tags/destroy'
  get 'todos/index'
  get 'todos/create'
  get 'todos/update'
  get 'todos/destroy'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  scope '/api/v1' do
    resources :todos
    resources :tags
  end
  
end

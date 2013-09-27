Prs5::Application.routes.draw do
#  get "main/index"

#  resources :posts

#  get "home/index"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'

#  get "rpc/call"

  match "/rpc" => 'rpc#call'

#  match '/adm/(:action)' => 'adm'

  #match '/lib(/(:action))' => 'lib'

#  scope 'lib' do
#  scope module: 'lib' do
  namespace :lib do
	  #resources :admin do
	  #scope :admin do
	  namespace :admin do
		resources :items do
			member do
			      post 'save'
			      post 'upload'
			end
			collection do
			      post 'add'
			      post 'rpc'
			end
		#	member do
		#	      get 'json'
		#	end
		end
	  end
	match '/admin' => redirect('/lib/admin/items')
	match '(/:id)' => 'home#show'
	match '(/:id/download(/:filename))' => 'home#download'
	#match '' => redirect("/lib/")
#	match '(/(:action))' => 'lib'
  end

  namespace :adm do
	match '/post(/(:action))' => 'post'
	match '/lib(/(:action))' => 'lib'
	match '(/(:action))' => 'main'
#	match '/conf/archive.html' => 'main#list_archive'
#	match '/conf/:cont_id(/(:action/(:file_name)))' => 'main'
#	match '/conf/:cont_id/:action' => redirect("/conf/:cont_id/%{action}/")
  end

  match '/my(/)' => redirect("/my/profile")
  match '/my/(:action)' => 'my'

  match '/account(/)' => redirect("/account/tos")
  match '/account/(:action)' => 'account'

#  root :to => 'home#index'
  match '/' => redirect("/conf/")

  scope :module => 'conf' do
	match '/conf/' => 'main#list'
	match '/conf/archive.html' => 'main#list_archive'
#	match '/conf/:cont_id/' => redirect("/conf/%{cont_id}")
#	match '/conf/:cont_id(/(:action))' => 'main'

	#match '/conf/:cont_id/reports(/(:action/))' => 'reports', :file_name => /[^\/]+/
	#match '/conf/:cont_id/reports/(:action)' => 'reports', :file_name => /[^\/]+/
	match '/conf/:cont_id/reports' => redirect("/conf/%{cont_id}/reports/"), :constraints => lambda {|r| !r.original_fullpath.end_with?('/')}
	match '/conf/:cont_id/reports/' => 'reports#index'
#	match '/conf/:cont_id/reports/(:file_name)' => 'reports#report', :file_name => /[^\/]+/
	match '/conf/:cont_id/reports/(:report_id.:ext)' => 'reports#report' #, :report_id => /[^\/]+/

#	match '/conf/:cont_id/reports' => redirect("/conf/%{cont_id}/reports/")

#	match '/conf/:cont_id(/(:action/(:file_name)))' => 'main'
	match '/conf/:cont_id(/(:action/(:file_name)))' => 'main', :file_name => /[^\/]+/
	match '/conf/:cont_id/:action' => redirect("/conf/:cont_id/%{action}/")

#	match '/conf/archive.html' => 'main#list'
  end

#  namespace :conf do
##	match ':controller/:action' # => 'reports#:page'
##	match 'reports/' => 'reports#index'
##	match 'reports/:action' => 'reports'
#	match 'reports/(:action)' => 'reports'
#  end

end

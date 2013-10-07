class AccountController < ApplicationController
	def tos
	#	render 'profile.html'
	end
	def login
		if request.params && request.params['log_pin']
			user_id = request.params['log_pin'].to_i
			if @appl.user.auth.checkUser user_id, request.params['log_pass'].to_s
				@appl.user.auth.dropSessionKey @current_user[:session_key] if @current_user[:session_key]
				@current_user[:session_key] = @appl.user.auth.createSessionKey user_id
				@current_user[:just_logged] = true
				@current_user[:user_id] = user_id
				redirect_to params[:return_url] || '/'
				return
			else
				@current_user[:login_error] = 1
			end
		else
		end
	#		render text: params.inspect
	end
	def logout
		if request.params && request.params['logout'] && @current_user[:session_key] 
			@appl.user.auth.dropSessionKey @current_user[:session_key]
			@current_user[:session_key] = nil
		end
		redirect_to params[:return_url] || '/'
	end
end

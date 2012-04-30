class ApplicationController < ActionController::Base
  protect_from_forgery
	around_filter :wrap_login
	def wrap_login
	#	@aaaaa='qqqqq'
		yield
		#render :text => 'qwerty'
	end
end

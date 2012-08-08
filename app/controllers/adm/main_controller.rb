class Adm::MainController < ApplicationController
	def index
		if @appl.user.is_admin(@current_user[:user_id]) or @appl.conf.user_is_conf_owner(@current_user[:user_id])
			@reports = @appl.conf.report.get_reports_list 0
			@permissions = @appl.conf.get_permissions_list 0
			render 'conf'
		else
			render 'norights'
		end
	#	render 'conf'
	end
	def admins
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'admins' : 'norights')
	end
	def users
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'users' : 'norights')
	end
	def post
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'post' : 'norights')
	end
end


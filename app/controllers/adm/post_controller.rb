class Adm::PostController < ApplicationController
	def index
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'index' : 'adm/main/norights')
	end
	def templates
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'templates' : 'adm/main/norights')
	end
	def slots
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'slots' : 'adm/main/norights')
	end
	def mailing
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'mailing' : 'adm/main/norights')
	end
end


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
		@mail_producers = @appl.post.producer.get_list
		@mail_tasks = @appl.post.taskmgr.get_tasks_list
		@mail_templates = @appl.post.get_templates nil
		@confs_list = @appl.conf.get_confs_list.select { |c|
			c['info'] && c['info']['title'] && (
				c['info']['title']['en'] && c['info']['title']['en'].length>0 ||
				c['info']['title']['ru'] && c['info']['title']['ru'].length>0
			)
		}
		render (@appl.user.is_admin(@current_user[:user_id]) ? 'mailing' : 'adm/main/norights')
	end
end


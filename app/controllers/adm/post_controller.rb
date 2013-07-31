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
		if @appl.user.is_admin(@current_user[:user_id])
			if params
				case params['op']
				when 'add_task' then
					attr = {
						name: params['name'],
						producer: params['producer'],
						template: params['template'],
						args: {}
					}
					attr[:args]['confs'] = params['args_confs'] if params['args_confs']
					@appl.post.taskmgr.new_task attr
				when 'delete_tasks' then
					tasks = params['tasks']
					if tasks.is_a? Array
						tasks.each do |t|
							@appl.post.taskmgr.remove_task t
						end
					end
				end
			end
			@mail_producers = @appl.post.producer.get_list
			@mail_tasks = @appl.post.taskmgr.get_tasks_list
			@mail_templates = @appl.post.get_templates nil
			@confs_list = @appl.conf.get_confs_list.select { |c|
				c['info'] && c['info']['title'] && (
					c['info']['title']['en'] && c['info']['title']['en'].length>0 ||
					c['info']['title']['ru'] && c['info']['title']['ru'].length>0
				)
			}
			render 'mailing'
		else
			render 'adm/main/norights'
		end
	end
	def mailing_items
		if @appl.user.is_admin(@current_user[:user_id])
			@mail_task_items = []
			if params
				@mail_task_info = @appl.post.taskmgr.get_task_info params['task_id']
				if @mail_task_info
					case params['op']
					when 'make_list' then
						@appl.post.taskmgr.gen_task_elms params['task_id']
					when 'delete_all' then
						@appl.post.taskmgr.remove_task_elms params['task_id']
					when 'delete_marked' then
						@appl.post.taskmgr.remove_task_elms params['task_id'], params['items'] ? params['items'] : []
					when 'send_all_prepared' then
						@appl.post.taskmgr.change_task_elms_state params['task_id'], 'prepared', 'sending'
					when 'send_marked' then
						@appl.post.taskmgr.change_task_elms_state params['task_id'], nil, 'sending', params['items'] ? params['items'] : []
					end
					@mail_task_items = @appl.post.taskmgr.get_task_elms params['task_id']
				end
			end
			render 'mailing_items'
		else
			render 'adm/main/norights'
		end
	end
end


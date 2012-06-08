class Conf::MainController < ApplicationController
	around_filter :preparation, :except => [:list, :list_archive]
	def list
		#@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
		@list = @appl.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
	end
	def list_archive
		#@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
		@list = @appl.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='archived' }
	end
	def index
	end
	def mypapers
		render @current_user[:user_id] ? '/conf/main/mypapers' : '/conf/main/enterplease'
	end
	def mypapers_file
		render :layout => false
	end
	def reviewing
		can_view = @user_rights['appoint_reviewers'] || @user_rights['review_everything'] || @user_rights['set_final_decision'] || @user_rights['delete_reviews'] || @appl.conf.paper.has_papers_for_reviewing(@current_user[:user_id], @cont_id)
		render @current_user[:user_id] ? (can_view ? '/conf/main/reviewing/index' : '/conf/main/norights') : '/conf/main/enterplease'
	end
	def reviewing2
		can_view = @appl.conf.user_is_section_manager(@current_user[:user_id], @cont_id)
		render @current_user[:user_id] ? (can_view ? '/conf/main/reviewing2/index' : '/conf/main/norights') : '/conf/main/enterplease'
	end
	def preparation
		@cont_id = params[:cont_id].to_s
		@conf_data = @appl.conf.get_conf_data @cont_id
		@conf_permissions = @conf_data['permissions'] || {}
		@conf_sections = @appl.conf.get_conf_sections @cont_id
		@conf_lang = @conf_data['info']['lang']
		@lang_list = case @conf_lang
			     when 'en' then %w[en]
			     when 'ru' then %w[ru]
			     else %w[en ru]
			     end
		@user_rights = @appl.conf.get_user_rights @cont_id, @current_user[:user_id]
		prev_menu_access = @menu_access
		@menu_access = -> id {
			case id
			when :reports then
				@appl.conf.report.get_reports_list( @cont_id ).keys.push('reports').inject(false) do |acc, k|
					acc || @user_rights[k.to_s+'_view']
				end
			when :reviewing then
				@user_rights['appoint_reviewers'] ||
					@user_rights['review_everything'] ||
					@user_rights['set_final_decision'] ||
					@appl.conf.paper.has_papers_for_reviewing(@current_user[:user_id], @cont_id)
			when :reviewing2 then
				@appl.conf.user_is_section_manager(@current_user[:user_id], @cont_id)
			else prev_menu_access[id]
			end
		}
		yield
	end
end

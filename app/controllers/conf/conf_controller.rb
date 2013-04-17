class Conf::ConfController < ApplicationController
	around_filter :preparation, :except => [:list, :list_archive]
	def preparation
		@cont_id = params[:cont_id].to_s
		@conf_data = @appl.conf.get_conf_data @cont_id
		@conf_permissions = @conf_data['permissions'] || {}
		@conf_sections = @appl.conf.get_conf_sections @cont_id
		@conf_sections_map = @conf_sections.inject({}) do |acc, v|
			acc[v['id']] = v
			acc
		end
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
			when :myparticipation then
				true
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


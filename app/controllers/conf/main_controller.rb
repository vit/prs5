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
	def download
		@_id = request.params['id']
		@type = request.params['type']
		@lng = request.params['lang']
		can_download = false
		username = "anonymous"
=begin
		if @current_user[:user_id]
			username = @current_user[:user_id]
			can_download =
				@user_rights['files_view'] ||
				@user_rights['abstract_files_view'] && @type=='abstract' ||
				@user_rights['paper_files_view'] && @type=='paper' ||
				@user_rights['presentation_files_view'] && @type=='presentation' ||
				@user_rights['review_everything'] ||
				@appl.conf.paper.get_paper_owner(@cont_id, @_id) == @current_user[:user_id] ||
				@appl.conf.paper.is_paper_reviewer(@current_user[:user_id], @cont_id, @_id) # ||
			#	true
		end
		if can_download
			if @cont_id && @_id && @lng
				@file = @appl.conf.paper.get_paper_file(@cont_id, @_id, @lng, @type)
				if @file
					@response.header['Content-Type'] = @file.content_type
					@file.read
				else
					''
				end
			else
				''
			end
		else
=end
			#	"Abstract file downloading is not permitted for user '#{username}'"
			render :inline => "User '#{username}' doesn't have permittion to download this file"
	#	end
	end
	def mypapers
		render @current_user[:user_id] ? '/conf/main/mypapers' : '/conf/main/enterplease'
	end
	def mypapers_file
		user_id = @current_user[:user_id]
		@_id = request.params['id']
		@type = request.params['type']
		@lng = request.params['lang']
		delete = request.params['delete']
		@can_delete = @can_upload = false
		if %w[abstract paper presentation exdoc].include? @type
			@can_delete =
				#	@type=='abstract' && @conf_permissions['PAPREG_PAPER_ABSTRACT_REMOVE'] ||
				#	@type=='paper' && @conf_permissions['PAPREG_PAPER_FILE_REMOVE'] ||
				#	@type=='presentation' && @conf_permissions['PAPREG_PAPER_PRESENTATION_REMOVE'] ||
				@type=='abstract' && @user_rights['PAPREG_PAPER_ABSTRACT_REMOVE'] ||
				@type=='paper' && @user_rights['PAPREG_PAPER_FILE_REMOVE'] ||
				@type=='presentation' && @user_rights['PAPREG_PAPER_PRESENTATION_REMOVE'] ||
				@type=='exdoc' && @user_rights['PAPREG_PAPER_EXDOC_REMOVE']
			if user_id && @cont_id && @_id && @lng && delete && @can_delete
				@appl.conf.paper.delete_my_paper_file(user_id, @cont_id, @_id, @lng, @type)
			end
			if user_id && @cont_id && @_id && @lng
				@existed_before = @lang_list.inject({}) do |acc, lang|
					acc[lang] = true if @appl.conf.paper.get_my_paper_file_info(user_id, @cont_id, @_id, lang, @type)
					acc
				end
				@file_info = @appl.conf.paper.get_my_paper_file_info(user_id, @cont_id, @_id, @lng, @type)
				@can_upload = 	@type=='abstract' && (
					#	@file_info && @conf_permissions['PAPREG_PAPER_ABSTRACT_REUPLOAD'] ||
					#	!@file_info && @conf_permissions['PAPREG_PAPER_ABSTRACT_UPLOAD'] ||
					@file_info && @user_rights['PAPREG_PAPER_ABSTRACT_REUPLOAD'] ||
					!@file_info && @user_rights['PAPREG_PAPER_ABSTRACT_UPLOAD']
				) ||
					@type=='paper' && (
						#	@file_info && @conf_permissions['PAPREG_PAPER_FILE_REUPLOAD'] ||
						#	!@file_info && @conf_permissions['PAPREG_PAPER_FILE_UPLOAD'] ||
						@file_info && @user_rights['PAPREG_PAPER_FILE_REUPLOAD'] ||
						!@file_info && @user_rights['PAPREG_PAPER_FILE_UPLOAD']
				) ||
					@type=='presentation' && (
						#	@file_info && @conf_permissions['PAPREG_PAPER_PRESENTATION_REUPLOAD'] ||
						#	!@file_info && @conf_permissions['PAPREG_PAPER_PRESENTATION_UPLOAD'] ||
						@file_info && @user_rights['PAPREG_PAPER_PRESENTATION_REUPLOAD'] ||
						!@file_info && @user_rights['PAPREG_PAPER_PRESENTATION_UPLOAD']
				) ||
					@type=='exdoc' && (
						@file_info && @user_rights['PAPREG_PAPER_EXDOC_REUPLOAD'] ||
						!@file_info && @user_rights['PAPREG_PAPER_EXDOC_UPLOAD']
				)
				inputfile = request.params['file']
				if inputfile && @can_upload
				#	params[:file_upload][:my_file].tempfile
				#	render :text => params[:file_upload].inspect
				#	render :text => params['file'].inspect
			#		render :text => params['file'].read.inspect
				#	render :text => params['file'].class.inspect
				#	render :text => inputfile[:tempfile].inspect
		#			render :text => inputfile.tempfile.inspect
		#			return
				#	@appl.conf.paper.put_my_paper_file(user_id, @cont_id, @_id, @lng, @type, inputfile[:tempfile], {
					@appl.conf.paper.put_my_paper_file(user_id, @cont_id, @_id, @lng, @type, inputfile.tempfile, {
				#	@appl.conf.paper.put_my_paper_file(user_id, @cont_id, @_id, @lng, @type, inputfile, {
						content_type: inputfile.content_type,
						filename: inputfile.original_filename
					})
#=begin
					required_lang_list = ['ru', 'by', 'ua'].include?(@current_user[:info]['country']) ?
						@lang_list :
						(@lang_list.length==1 ? @lang_list : ['en'])
					check_files_condition = -> arr {
						required_lang_list.inject(true) do |acc, l|
						acc && arr[l]
						end
					}
					@file_info = @appl.conf.paper.get_my_paper_file_info(user_id, @cont_id, @_id, @lng, @type)
					if !check_files_condition[@existed_before] && check_files_condition[@existed_before.merge({@lng => true})]
						#@cond_ok = true
						@appl.mail.send_notification :files_uploaded, :both, {receiver_pin: user_id, file_type: @type, paper_id: @_id, cont_id: @cont_id}
					end
#=end
				end
			end
		end
		render :layout => false
	end
	def myparticipation
		render @current_user[:user_id] ? '/conf/main/myparticipation' : '/conf/main/enterplease'
	end
	def myparticipation1
		render @current_user[:user_id] ? '/conf/main/myparticipation1' : '/conf/main/enterplease'
	end
	def myparticipation2
		@par = params
		#render @current_user[:user_id] ? '/conf/main/myparticipation2' : '/conf/main/enterplease'
	end
	def reviewing
		can_view = @user_rights['appoint_reviewers'] || @user_rights['review_everything'] || @user_rights['set_final_decision'] || @user_rights['delete_reviews'] || @appl.conf.paper.has_papers_for_reviewing(@current_user[:user_id], @cont_id)
	#	render @current_user[:user_id] ? (can_view ? '/conf/main/reviewing/index' : '/conf/main/norights') : '/conf/main/enterplease'
		render @current_user[:user_id] ? (can_view ? '/conf/main/reviewing' : '/conf/main/norights') : '/conf/main/enterplease'
	end
	def reviewing2
		can_view = @appl.conf.user_is_section_manager(@current_user[:user_id], @cont_id)
	#	render @current_user[:user_id] ? (can_view ? '/conf/main/reviewing2/index' : '/conf/main/norights') : '/conf/main/enterplease'
		render @current_user[:user_id] ? (can_view ? '/conf/main/reviewing2' : '/conf/main/norights') : '/conf/main/enterplease'
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

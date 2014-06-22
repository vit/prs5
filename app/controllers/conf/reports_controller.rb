#class Conf::ReportsController < ApplicationController
class Conf::ReportsController < Conf::ConfController
	def index
#		render :text => 'qwrtqrtqr'
	end
	def report

					report_id = params['report_id']
					ext = params['ext']
					@reports = @appl.conf.report.get_reports_list @cont_id
					report = @reports[report_id.to_sym]
					if report && %w[html csv xls].include?(ext)
						can_view = false
						username = "anonymous"
						if @current_user[:user_id]
							username = @current_user[:user_id]
							can_view = @user_rights['reports_view'] || @user_rights[ report_id+'_view']
						end
						if can_view
							@data_lang_code = request.params['data_lang'] || 'en'
							@file_class_code = request.params['file_class'] || 'unknown'
							case ext
							when 'html' then
								case report_id
								when 'report_1' then
									@summary = @appl.conf.report.get_summary @cont_id, @data_lang_code
							#		render '/page/conf/id/reports/summary'
								#	render :file => 'conf/reports/reports/summary'
								#	render 'conf/reports/reports/summary', :layout => false
								when 'report_2' then
									@report_data = @appl.conf.report.papers_full_list @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/paperslist'
								when 'abstracts_by_country' then
									@report_data = @appl.conf.report.abstracts_by_country @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/abstracts_by_country'
								when 'papers_by_section' then
									@report_data = @appl.conf.report.papers_by_section @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/papers_by_section'
								when 'papers_statistics_after_decision' then
									@report_data = @appl.conf.report.papers_statistics_after_decision @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/papers_statistics_after_decision'
								when 'papers_statistics' then
									@report_data = @appl.conf.report.papers_statistics @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/papers_statistics'
								when 'papers_list_with_reviews' then
									@report_data = @appl.conf.report.papers_list_with_reviews @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/papers_list_with_reviews'
								when 'abstracts_with_files' then
									@report_data = @appl.conf.report.abstracts_with_files @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/abstracts_with_files'
								when 'abstracts_with_paper_files' then
									@report_data = @appl.conf.report.abstracts_with_paper_files @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/abstracts_with_paper_files'
								when 'abstract_ids_with_files' then
									@report_data = @appl.conf.report.abstracts_with_files @cont_id, @data_lang_code
								#	render '/page/conf/id/reports/abstract_ids_with_files'
								when 'keywords_1' then
									@report_data = @appl.conf.report.papers_full_list @cont_id, @data_lang_code
								when 'keywords_2' then
									@report_data = @appl.conf.report.papers_full_list @cont_id, @data_lang_code
								when 'keywords_3' then
									@report_data = @appl.conf.report.papers_full_list @cont_id, @data_lang_code
								end
								#render 'conf/reports/reports/'+report_id, :layout => false
								render "conf/reports/reports/#{report_id}", :layout => false
							else
#=begin
#								@ss = ::StreamSheet.writer ext
								response.header['Content-Type'] = {
									'csv' => 'text/csv; charset=UTF-8',
									'xls' => 'application/vnd.ms-excel'
								}[ ext ]
	#							response.header['Content-Type'] = 'application/vnd.ms-excel'
								eval "@report_data = @appl.conf.report.#{report_id} @cont_id, @data_lang_code"
#								render "/conf/reports/#{report_id}.csv"
#								@ss.to_s
#=end
			#					render :text => @reports.inspect
								render "/conf/reports/csv_wrapper", :layout => false, :locals => {ext: ext, report_id: report_id}
							end
						else
							render :text => "Access to the report '#{report_id}' not permitted for user '#{username}'"
						end
					else
#						"Report #{report_id} not found"
						render :text => "Report #{report_id} not found"
					end


		#render :text => 'Report:'
		#render :text => params.inspect
#		render :text => @reports.inspect
	end
end

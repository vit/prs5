class ApplicationController < ActionController::Base
  protect_from_forgery
	#around_filter :wrap_login, :wr_accept_language, :wr_application, :wr_user_session, :wr_lang_selected, :wr_web_login, :wr_web_logout, :wr_user_id, :wr_user_info, :wr_country_list, :wr_menu_access
	around_filter :wrap_login, :wr_accept_language, :wr_application, :wr_user_session, :wr_lang_selected, :wr_user_id, :wr_user_info, :wr_country_list, :wr_menu_access
	def wrap_login
	#	@aaaaa='qqqqq'
		yield
		#render :text => 'qwerty'
	end
	def wr_application
		@appl = Coms::App.model #@request.env['application']
		yield
	end
	def wr_user_session
		@current_user = {
			user_id: nil,
			session_key: request.cookies['session_key'],
			login_error: nil,
			just_logged: false
		}
		yield
		if @current_user[:session_key] 
			response.set_cookie 'session_key', :path => '/', :value => @current_user[:session_key]
		else
			response.delete_cookie 'session_key', :path => '/'
		end
	end
	def wr_lang_selected
		request.languages.unshift request.cookies['ecms_lang'] if request.cookies['ecms_lang']
		request.languages << 'en' << 'ru'
		request.languages.uniq!
	#	@language = request.cookies['ecms_lang']=='ru' ? 'ru' : 'en'
	#	@language = request.languages ? -> arr {
		@language = -> arr {
			arr.each do |l|
				return l if ['en', 'ru'].include?(l)
			end
		}[request.languages]
	#	}[request.languages] : 'en'
		yield
	end
=begin
	def wr_web_login
	#	p request.params.inspect
		if request.params && request.params['log_pin']
			user_id = request.params['log_pin'].to_i
	#	p user_id
			if @appl.user.auth.checkUser user_id, request.params['log_pass'].to_s
				@appl.user.auth.dropSessionKey @current_user[:session_key] if @current_user[:session_key]
				@current_user[:session_key] = @appl.user.auth.createSessionKey user_id
				@current_user[:just_logged] = true
			else
				@current_user[:login_error] = 1
			end
		end
	#	puts @current_user
		yield
	end
	def wr_web_logout
		if request.params && request.params['logout'] && @current_user[:session_key] 
			@appl.user.auth.dropSessionKey @current_user[:session_key]
			@current_user[:session_key] = nil
		end
		yield
	end
=end
	def wr_user_id
		if @current_user[:session_key]
			user_id = @appl.user.auth.checkSessionKey @current_user[:session_key]
			if user_id
				@current_user[:user_id] = user_id
			else
				@current_user[:session_key] = nil
				@current_user[:login_error] = 2
			end
		end
		yield
	end
	def wr_user_info
		if @current_user[:user_id]
			ui = @appl.user.info.get_user_info_ml @current_user[:user_id]
			res = {}
			request.languages.each do |lang_code|
				if ui[lang_code]
					res = ui[lang_code]
					break
				end
			end
			@current_user[:info] = res
		end
		yield
	end
	def wr_country_list
#		@appl.country = ::Coms::User::Country
		@country = ::Coms::User::Country
		yield
	end
	HEADERS = -> do
		@response.header['Content-Type'] = 'text/html; charset=UTF-8'
		#@response.header['Cache-Control'] = 'no-cache, must-revalidate'
		@response.header['Cache-Control'] = 'max-age=0, no-store, no-cache, must-revalidate'
		@response.header['Pragma'] = 'no-cache'
		_
	end
	RENDERER = -> do
		class << self
			define_method :render do |path, args={}|
				#args = {lang: @request.languages, data_from: self}.merge(args)
				args = {data_from: self}.merge(args)
				args[:lang] = @request.respond_to?(:languages) ? @request.languages : []
				@request.env['renderer'].render( path, args )
			end
		end
		_
	end
	def wr_accept_language
		class << request; attr_accessor :languages; end
		request.languages = request.env['HTTP_ACCEPT_LANGUAGE'] ?
			request.env['HTTP_ACCEPT_LANGUAGE'].split(?,).map{ |s|
				s.split(?;)
			}.map{ |a|
				a.empty? ? nil : a.first.to_s.strip
			}.select{ |s| not (s.nil? or s.empty?) } : []
		yield
	end
	def wr_menu_access
		@menu_access = -> id {
			case id
			when :adm then @appl.user.is_admin @current_user[:user_id] or @appl.conf.user_is_conf_owner @current_user[:user_id]
				#	when :reports then true
			else false
			end
		}
		yield
	end
	JSONBODY = -> do
		class << @request; attr_accessor :json_body; end
		class << @response; attr_accessor :json_body; end
		@request.json_body = (JSON.load @request.body rescue {})
		_
		@response.body = @response.json_body.to_json if @response.json_body
	end
end

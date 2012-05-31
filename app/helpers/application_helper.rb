module ApplicationHelper
	def _ s
	#	@__translation[s]
	#	@__translation.inspect
	#	@__translation ? @__translation[s] : s
	#	@__translation ? @__translation['qqq'] : s
	#	@__translations_stack ? @__translations_stack.last['qqq'] : s
#	puts s.to_s+'@@@'
#	puts	@__translations_stack ? @__translations_stack.last[s] : s
#		@__translations_stack ? @__translations_stack.last[s] : s
		@__translations_stack && @__translations_stack.last && @__translations_stack.last[s] ? @__translations_stack.last[s] : s.to_s
	#	`pwd`
	end
	def init_translation
		id0 = get_current_template_name
#		puts id0
		id = id0.gsub(/^app\/views\//, '')
	#	id1 = id1.gsub(/\.(.*?)$/, 'q')
	#	id2 = id1.gsub(/\.(.*)$/, 'q')
	#	id2 = id1.gsub(/\.(.*)/, 'q')
		id = id.gsub(/\.\w*$/, '')
#		puts id
	#	puts '>>>>>> init'
	#	id = 'app/lang/test'
#		id = 'test'
		#id = '../../app/lang/test'
	#	@__translation = TranslationLoader.get_translation 'ru', id
		@__translations_stack ||= []
	#	__translation = TranslationLoader.get_translation 'ru', id
		__translation = TranslationLoader.get_translation request.languages, id
		@__translations_stack << __translation
	end
	def drop_translation
		#@__translation = nil
		@__translations_stack ? @__translations_stack.pop : nil
	#	puts '<<<<<< drop'
	end

	def push_template_name s
		@__templates_stack ||= []
		@__templates_stack << s
	end
	def pop_template_name
		@__templates_stack ? @__templates_stack.pop : nil
	end
	def get_current_template_name
		@__templates_stack ? @__templates_stack.last : nil
	end
	def print_template_names
		puts '>>>'
		puts @__templates_stack.inspect
		puts '<<<'
	end
	def get_template_names
		@__templates_stack
	end
end

module ApplicationHelper
	def _ s
		@__translations_stack && @__translations_stack.last && @__translations_stack.last[s] ? @__translations_stack.last[s] : s.to_s
	end
	def init_translation
		id0 = get_current_template_name
#		puts id0
		id = id0.gsub(/^app\/views\//, '')
	#	id1 = id1.gsub(/\.(.*?)$/, 'q')
	#	id2 = id1.gsub(/\.(.*)$/, 'q')
	#	id2 = id1.gsub(/\.(.*)/, 'q')
		id = id.gsub(/\.\w*$/, '')
		@__translations_stack ||= []
	#	__translation = TranslationLoader.get_translation 'ru', id
	#	__translation = TranslationLoader.get_translation request.languages, id
		langs = ['en', 'ru'].unshift( @language )
		__translation = TranslationLoader.get_translation langs, id
		@__translations_stack << __translation
	end
	def drop_translation
		@__translations_stack ? @__translations_stack.pop : nil
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
